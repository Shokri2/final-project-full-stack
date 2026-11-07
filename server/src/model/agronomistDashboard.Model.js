import { pool } from "../config/db.js";
import { countRequestsByStatus, getRecentRequests } from "./requestStats.Model.js";
import { agronomistFeedbackScope } from "../utils/feedbackRules.js";

const getPerformance = async (agronomistId) => {
  const result = await pool.query(
    `SELECT
       ROUND(AVG(EXTRACT(EPOCH FROM (answered_at - assigned_at)) / 3600)::numeric, 1) AS average_response_hours,
       COUNT(*) FILTER (WHERE answered_at >= NOW() - INTERVAL '7 days')::int AS answered_last_7_days
     FROM consultation_requests
     WHERE agronomist_id = $1 AND answered_at IS NOT NULL`,
    [agronomistId],
  );

  return result.rows[0];
};

const getFeedbackOverview = async (agronomistId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE f.status = 'pending')::int AS pending_to_review,
       ROUND(AVG(f.rating) FILTER (
         WHERE f.status = 'approved'
           AND EXISTS (SELECT 1 FROM consultation_requests r WHERE r.id = f.request_id AND r.agronomist_id = $1)
       )::numeric, 1) AS my_consultations_rating
     FROM feedback f
     WHERE ${agronomistFeedbackScope("$1")} AND f.user_id <> $1`,
    [agronomistId],
  );

  return result.rows[0];
};

const getSpecialties = async (agronomistId) => {
  const result = await pool.query(
    `SELECT c.id, c.name
     FROM agronomist_specialties s
     JOIN categories c ON c.id = s.category_id
     WHERE s.agronomist_id = $1
     ORDER BY c.name`,
    [agronomistId],
  );

  return result.rows;
};

export const getAgronomistDashboard = async (agronomistId) => {
  const mine = "r.agronomist_id = $1";

  const [requests, performance, feedback, specialties, queue, recent] = await Promise.all([
    countRequestsByStatus("agronomist_id = $1", [agronomistId]),
    getPerformance(agronomistId),
    getFeedbackOverview(agronomistId),
    getSpecialties(agronomistId),
    getRecentRequests(`${mine} AND r.status IN ('assigned', 'in_progress')`, [agronomistId], {
      orderBy: "CASE r.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, r.assigned_at ASC",
      limit: 10,
    }),
    getRecentRequests(`${mine} AND r.status IN ('answered', 'closed', 'rejected')`, [agronomistId], {
      orderBy: "r.updated_at DESC",
    }),
  ]);

  return {
    requests,
    performance,
    feedback,
    specialties,
    work_queue: queue,
    recently_processed: recent,
  };
};
