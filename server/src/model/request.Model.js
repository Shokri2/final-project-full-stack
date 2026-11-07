import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";

const requestSortColumns = {
  created_at: "r.created_at",
  updated_at: "r.updated_at",
  priority: "CASE r.priority WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END",
  status: "r.status",
};

export const createRequest = async (client, request) => {
  const result = await client.query(
    `INSERT INTO consultation_requests
       (user_id, crop_id, title, description, farm_location, field_area_m2, priority)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, status`,
    [
      request.user_id,
      request.crop_id,
      request.title,
      request.description,
      request.farm_location || null,
      request.field_area_m2 ?? null,
      request.priority,
    ],
  );

  return result.rows[0];
};

const applyScope = (builder, user) => {
  if (user.role === "user") {
    builder.add("r.user_id = ?", user.id);
  }

  if (user.role === "agronomist") {
    builder.add("r.agronomist_id = ?", user.id);
  }
};

export const getRequests = async (filters, user) => {
  const builder = createWhereBuilder();

  applyScope(builder, user);

  if (filters.search) {
    builder.add(
      "(r.title ILIKE ? OR c.name ILIKE ? OR c.name_ar ILIKE ? OR owner.name ILIKE ?)",
      toSearchPattern(filters.search),
    );
  }

  if (filters.status) {
    builder.add("r.status = ANY(?::varchar[])", filters.status);
  }

  if (filters.priority) {
    builder.add("r.priority = ?", filters.priority);
  }

  if (filters.crop_id) {
    builder.add("r.crop_id = ?", filters.crop_id);
  }

  if (filters.agronomist_id && user.role === "admin") {
    builder.add("r.agronomist_id = ?", filters.agronomist_id);
  }

  if (filters.from) {
    builder.add("r.created_at >= ?", filters.from);
  }

  if (filters.to) {
    builder.add("r.created_at <= ?", filters.to);
  }

  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT
       r.id,
       r.title,
       r.status,
       r.priority,
       r.farm_location,
       r.created_at,
       r.updated_at,
       r.assigned_at,
       r.answered_at,
       r.crop_id,
       c.name AS crop_name,
       c.name_ar AS crop_name_ar,
       c.image AS crop_image,
       r.user_id,
       owner.name AS user_name,
       r.agronomist_id,
       agronomist.name AS agronomist_name,
       (SELECT COUNT(*)::int FROM request_attachments a WHERE a.request_id = r.id) AS attachments_count,
       COUNT(*) OVER() AS total_count
     FROM consultation_requests r
     JOIN crops c ON c.id = r.crop_id
     JOIN users owner ON owner.id = r.user_id
     LEFT JOIN users agronomist ON agronomist.id = r.agronomist_id
     ${builder.where()}
     ORDER BY ${requestSortColumns[filters.sort]} ${filters.order === "asc" ? "ASC" : "DESC"}, r.id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const requests = result.rows.map(({ total_count, ...request }) => request);

  return { requests, total };
};

export const getRequestForUpdate = async (client, id) => {
  const result = await client.query(
    `SELECT r.*, c.category_id, c.name AS crop_name
     FROM consultation_requests r
     JOIN crops c ON c.id = r.crop_id
     WHERE r.id = $1
     FOR UPDATE OF r`,
    [id],
  );

  return result.rows[0] ?? null;
};

export const getRequestById = async (id) => {
  const result = await pool.query(
    `SELECT id, user_id, agronomist_id, status, crop_id
     FROM consultation_requests
     WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
};

export const updateRequestFields = async (id, fields) => {
  const editable = ["crop_id", "title", "description", "farm_location", "field_area_m2", "priority"];
  const keys = editable.filter((key) => fields[key] !== undefined);
  const values = keys.map((key) => (fields[key] === "" ? null : fields[key]));
  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

  const result = await pool.query(
    `UPDATE consultation_requests
     SET ${setClauses.join(", ")}
     WHERE id = $${keys.length + 1}
       AND status = 'pending'
     RETURNING id`,
    [...values, id],
  );

  return result.rowCount > 0;
};
