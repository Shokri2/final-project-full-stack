import { pool } from "../config/db.js";

export const getEligibleAgronomists = async (categoryId) => {
  const result = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       (SELECT COUNT(*)::int
        FROM consultation_requests r
        WHERE r.agronomist_id = u.id
          AND r.status IN ('assigned', 'in_progress')) AS open_requests
     FROM users u
     JOIN agronomist_specialties s ON s.agronomist_id = u.id
     WHERE s.category_id = $1
       AND u.role = 'agronomist'
       AND u.is_active = TRUE
     ORDER BY open_requests ASC, u.name ASC`,
    [categoryId],
  );

  return result.rows;
};

export const isEligibleAgronomist = async (client, agronomistId, categoryId) => {
  const result = await client.query(
    `SELECT 1
     FROM users u
     JOIN agronomist_specialties s ON s.agronomist_id = u.id
     WHERE u.id = $1
       AND s.category_id = $2
       AND u.role = 'agronomist'
       AND u.is_active = TRUE`,
    [agronomistId, categoryId],
  );

  return result.rowCount > 0;
};
