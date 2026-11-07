import { pool } from "../config/db.js";

export const createFeedback = async ({ user_id, crop_id, request_id, rating, comment }) => {
  const result = await pool.query(
    `INSERT INTO feedback (user_id, crop_id, request_id, rating, comment)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [user_id, crop_id ?? null, request_id ?? null, rating, comment],
  );

  return result.rows[0].id;
};

export const findFeedbackById = async (id) => {
  const result = await pool.query(
    `SELECT
       f.*,
       u.name AS user_name,
       c.name AS crop_name,
       c.name_ar AS crop_name_ar,
       c.category_id,
       r.title AS request_title,
       r.agronomist_id AS request_agronomist_id,
       reviewer.name AS reviewed_by_name
     FROM feedback f
     JOIN users u ON u.id = f.user_id
     LEFT JOIN crops c ON c.id = f.crop_id
     LEFT JOIN consultation_requests r ON r.id = f.request_id
     LEFT JOIN users reviewer ON reviewer.id = f.reviewed_by
     WHERE f.id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
};

export const findActiveFeedbackForTarget = async (userId, { cropId, requestId }) => {
  const result = await pool.query(
    `SELECT id, status
     FROM feedback
     WHERE user_id = $1
       AND status IN ('pending', 'approved')
       AND (
         ($2::int IS NOT NULL AND request_id = $2)
         OR ($2::int IS NULL AND request_id IS NULL AND crop_id IS NOT DISTINCT FROM $3::int)
       )
     LIMIT 1`,
    [userId, requestId ?? null, cropId ?? null],
  );

  return result.rows[0] ?? null;
};

export const updateOwnFeedback = async (id, { rating, comment }) => {
  const result = await pool.query(
    `UPDATE feedback
     SET rating = COALESCE($1, rating),
         comment = COALESCE($2, comment)
     WHERE id = $3
       AND status = 'pending'
     RETURNING id`,
    [rating ?? null, comment ?? null, id],
  );

  return result.rowCount > 0;
};

export const deleteFeedback = async (id) => {
  await pool.query(`DELETE FROM feedback WHERE id = $1`, [id]);
};

export const setFeedbackStatus = async (id, { status, reviewerId, reason }) => {
  await pool.query(
    `UPDATE feedback
     SET status = $1,
         reviewed_by = $2,
         reviewed_at = CURRENT_TIMESTAMP,
         rejection_reason = $3
     WHERE id = $4`,
    [status, reviewerId, status === "rejected" ? reason : null, id],
  );
};

export const getRatingSummary = async (cropId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS reviews_count,
       ROUND(AVG(rating)::numeric, 1) AS average_rating,
       COUNT(*) FILTER (WHERE rating = 5)::int AS five,
       COUNT(*) FILTER (WHERE rating = 4)::int AS four,
       COUNT(*) FILTER (WHERE rating = 3)::int AS three,
       COUNT(*) FILTER (WHERE rating = 2)::int AS two,
       COUNT(*) FILTER (WHERE rating = 1)::int AS one
     FROM feedback
     WHERE crop_id = $1 AND status = 'approved'`,
    [cropId],
  );

  return result.rows[0];
};
