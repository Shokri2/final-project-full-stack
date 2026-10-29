import { pool } from "../config/db.js";

const cropFields = `
  id,
  name,
  name_ar,
  image,
  description,
  water_needs,
  temperature_min,
  temperature_max,
  sunlight,
  soil_type,
  growth_duration_days,
  created_at,
  updated_at
`;

export const getAllCrops = async () => {
  const result = await pool.query(`
    SELECT ${cropFields}
    FROM crops
    ORDER BY id ASC;
  `);

  return result.rows;
};

export const getCropById = async (id) => {
  const cropResult = await pool.query(
    `SELECT ${cropFields} FROM crops WHERE id = $1;`,
    [id],
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

export const createCrop = async (crop) => {
  const {
    name,
    name_ar,
    image = null,
    description = null,
    water_needs = null,
    temperature_min = null,
    temperature_max = null,
    sunlight = null,
    soil_type = null,
    growth_duration_days = null,
  } = crop;

  const result = await pool.query(
    `INSERT INTO crops (
      name, name_ar, image, description, water_needs,
      temperature_min, temperature_max, sunlight,
      soil_type, growth_duration_days
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING ${cropFields};`,
    [
      name,
      name_ar,
      image,
      description,
      water_needs,
      temperature_min,
      temperature_max,
      sunlight,
      soil_type,
      growth_duration_days,
    ],
  );

  return result.rows[0];
};

export const updateCrop = async (id, crop) => {
  const allowedFields = [
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

  const fields = allowedFields.filter((field) => crop[field] !== undefined);

  if (fields.length === 0) {
    return null;
  }

  const values = fields.map((field) => crop[field]);

  const setClauses = fields.map((field, index) => `${field} = $${index + 1}`);

  values.push(id);

  const result = await pool.query(
    `UPDATE crops
     SET ${setClauses.join(", ")},
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $${values.length}
     RETURNING ${cropFields};`,
    values,
  );

  return result.rows[0] ?? null;
};

export const deleteCrop = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingCrop = await client.query(
      "SELECT id FROM crops WHERE id = $1 FOR UPDATE;",
      [id],
    );

    if (existingCrop.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    await client.query("DELETE FROM crop_growth_stages WHERE crop_id = $1;", [
      id,
    ]);

    await client.query("DELETE FROM crops WHERE id = $1;", [id]);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
