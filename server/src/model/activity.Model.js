import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";

export const getActivities = async (filters) => {
  const builder = createWhereBuilder();

  if (filters.search) {
    builder.add(
      "(a.action ILIKE ? OR u.name ILIKE ? OR u.email ILIKE ?)",
      toSearchPattern(filters.search),
    );
  }

  if (filters.action) {
    builder.add("a.action = ?", filters.action);
  }

  if (filters.entity_type) {
    builder.add("a.entity_type = ?", filters.entity_type);
  }

  if (filters.user_id) {
    builder.add("a.user_id = ?", filters.user_id);
  }

  if (filters.from) {
    builder.add("a.created_at >= ?", filters.from);
  }

  if (filters.to) {
    builder.add("a.created_at <= ?", filters.to);
  }

  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT
       a.id,
       a.action,
       a.entity_type,
       a.entity_id,
       a.details,
       a.ip_address,
       a.created_at,
       a.user_id,
       u.name AS user_name,
       u.email AS user_email,
       u.role AS user_role,
       COUNT(*) OVER() AS total_count
     FROM activity_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ${builder.where()}
     ORDER BY a.created_at ${filters.order === "asc" ? "ASC" : "DESC"}, a.id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const activities = result.rows.map(({ total_count, ...activity }) => activity);

  return { activities, total };
};

export const getActivityActions = async () => {
  const result = await pool.query(
    `SELECT DISTINCT action FROM activity_logs ORDER BY action`,
  );

  return result.rows.map((row) => row.action);
};
