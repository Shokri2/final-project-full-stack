import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";

const cropFields = `
  c.id,
  c.category_id,
  cat.name AS category_name,
  c.name,
  c.name_ar,
  c.image,
  c.description,
  c.water_needs,
  c.temperature_min,
  c.temperature_max,
  c.sunlight,
  c.soil_type,
  c.growth_duration_days,
  c.is_active,
  c.created_at,
  c.updated_at
`;

const ratingFields = `
  (SELECT ROUND(AVG(f.rating)::numeric, 1)
   FROM feedback f
   WHERE f.crop_id = c.id AND f.status = 'approved') AS average_rating,
  (SELECT COUNT(*)::int
   FROM feedback f
   WHERE f.crop_id = c.id AND f.status = 'approved') AS reviews_count
`;

const cropSortColumns = {
  name: "LOWER(c.name)",
  created_at: "c.created_at",
  growth_duration_days: "c.growth_duration_days",
  temperature_min: "c.temperature_min",
  rating: "average_rating",
  requests_count: "requests_count",
};

const editableFields = [
  "category_id",
  "is_active",
  "name",
  "name_ar",
  "image",
  "description",
  "water_needs",
  "temperature_min",
  "temperature_max",
  "sunlight",
  "soil_type",
  "growth_duration_days",
];

export const getAllCrops = async (filters, { includeInactive = false } = {}) => {
  const builder = createWhereBuilder();

  if (!includeInactive) {
    builder.addRaw("c.is_active = TRUE");
  } else if (filters.is_active !== undefined) {
    builder.add("c.is_active = ?", filters.is_active);
  }

  if (filters.search) {
    builder.add("(c.name ILIKE ? OR c.name_ar ILIKE ?)", toSearchPattern(filters.search));
  }

  if (filters.category_id) {
    builder.add("c.category_id = ?", filters.category_id);
  }

  if (filters.sunlight) {
    builder.add("c.sunlight ILIKE ?", toSearchPattern(filters.sunlight));
  }

  if (filters.max_growth_days) {
    builder.add("c.growth_duration_days <= ?", filters.max_growth_days);
  }

  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT
       ${cropFields},
       ${ratingFields},
       (SELECT COUNT(*)::int FROM consultation_requests r WHERE r.crop_id = c.id) AS requests_count,
       COUNT(*) OVER() AS total_count
     FROM crops c
     JOIN categories cat ON cat.id = c.category_id
     ${builder.where()}
     ORDER BY ${cropSortColumns[filters.sort]} ${filters.order === "desc" ? "DESC" : "ASC"} NULLS LAST, c.id
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const crops = result.rows.map(({ total_count, ...crop }) => crop);

  return { crops, total };
};

export const getCropById = async (id, { includeInactive = false } = {}) => {
  const cropResult = await pool.query(
    `SELECT
       ${cropFields},
       ${ratingFields},
       (SELECT COUNT(*)::int FROM consultation_requests r WHERE r.crop_id = c.id) AS requests_count
     FROM crops c
     JOIN categories cat ON cat.id = c.category_id
     WHERE c.id = $1
       AND ($2::boolean OR c.is_active = TRUE)`,
    [id, includeInactive],
  );

  if (cropResult.rows.length === 0) {
    return null;
  }

  const stagesResult = await pool.query(
    `SELECT id, name, name_ar, stage_order, duration_days, tips
     FROM crop_growth_stages
     WHERE crop_id = $1
     ORDER BY stage_order ASC;`,
    [id],
  );

  return {
    ...cropResult.rows[0],
    growth_stages: stagesResult.rows,
  };
};

const replaceGrowthStages = async (client, cropId, stages) => {
  await client.query("DELETE FROM crop_growth_stages WHERE crop_id = $1", [cropId]);

  for (const [index, stage] of stages.entries()) {
    await client.query(
      `INSERT INTO crop_growth_stages
         (crop_id, name, name_ar, stage_order, duration_days, tips)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        cropId,
        stage.name,
        stage.name_ar,
        index + 1,
        stage.duration_days ?? null,
        stage.tips || null,
      ],
    );
  }
};

export const createCrop = async (crop, userId) => {
  const fields = editableFields.filter((field) => crop[field] !== undefined);
  const values = fields.map((field) => (crop[field] === "" ? null : crop[field]));

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO crops (${fields.join(", ")}, created_by, updated_by)
       VALUES (${fields.map((_, index) => `$${index + 1}`).join(", ")}, $${fields.length + 1}, $${fields.length + 1})
       RETURNING id`,
      [...values, userId],
    );

    const cropId = result.rows[0].id;

    if (crop.growth_stages) {
      await replaceGrowthStages(client, cropId, crop.growth_stages);
    }

    await client.query("COMMIT");

    return cropId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateCrop = async (id, crop, userId) => {
  const fields = editableFields.filter((field) => crop[field] !== undefined);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const values = fields.map((field) => (crop[field] === "" ? null : crop[field]));
    const setClauses = fields.map((field, index) => `${field} = $${index + 1}`);

    const result = await client.query(
      `UPDATE crops
       SET ${[...setClauses, `updated_by = $${fields.length + 1}`].join(", ")}
       WHERE id = $${fields.length + 2}
       RETURNING id`,
      [...values, userId, id],
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    if (crop.growth_stages) {
      await replaceGrowthStages(client, id, crop.growth_stages);
    }

    await client.query("COMMIT");

    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteCrop = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingCrop = await client.query(
      `SELECT c.id, c.name,
              (SELECT COUNT(*)::int FROM consultation_requests r WHERE r.crop_id = c.id) AS requests_count
       FROM crops c
       WHERE c.id = $1
       FOR UPDATE;`,
      [id],
    );

    if (existingCrop.rowCount === 0) {
      await client.query("ROLLBACK");
      return { deleted: false, reason: "NOT_FOUND" };
    }

    if (existingCrop.rows[0].requests_count > 0) {
      await client.query("ROLLBACK");
      return {
        deleted: false,
        reason: "HAS_REQUESTS",
        requestsCount: existingCrop.rows[0].requests_count,
      };
    }

    await client.query("DELETE FROM crop_growth_stages WHERE crop_id = $1;", [id]);
    await client.query("DELETE FROM crops WHERE id = $1;", [id]);

    await client.query("COMMIT");

    return { deleted: true, name: existingCrop.rows[0].name };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateCropStatus = async (id, isActive, userId) => {
  const result = await pool.query(
    `UPDATE crops
     SET is_active = $1,
         updated_by = $2
     WHERE id = $3
     RETURNING id, name, is_active`,
    [isActive, userId, id],
  );

  return result.rows[0] ?? null;
};
