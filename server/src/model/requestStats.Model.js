import { pool } from "../config/db.js";

export const countRequestsByStatus = async (whereSql = "TRUE", params = []) => {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE status = 'assigned')::int AS assigned,
       COUNT(*) FILTER (WHERE status = 'in_progress')::int AS in_progress,
       COUNT(*) FILTER (WHERE status = 'answered')::int AS answered,
       COUNT(*) FILTER (WHERE status = 'closed')::int AS closed,
       COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
       COUNT(*) FILTER (WHERE status = 'cancelled')::int AS cancelled
     FROM consultation_requests
     WHERE ${whereSql}`,
    params,
  );

  return result.rows[0];
};

export const getRecentRequests = async (whereSql, params, { orderBy = "r.created_at DESC", limit = 5 } = {}) => {
  const result = await pool.query(
    `SELECT
       r.id, r.title, r.status, r.priority, r.created_at, r.updated_at,
       c.name AS crop_name, owner.name AS user_name, agronomist.name AS agronomist_name
     FROM consultation_requests r
     JOIN crops c ON c.id = r.crop_id
     JOIN users owner ON owner.id = r.user_id
     LEFT JOIN users agronomist ON agronomist.id = r.agronomist_id
     WHERE ${whereSql}
     ORDER BY ${orderBy}
     LIMIT ${Number(limit)}`,
    params,
  );

  return result.rows;
};
