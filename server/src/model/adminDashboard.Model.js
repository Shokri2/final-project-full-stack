import { pool } from "../config/db.js";
import { countRequestsByStatus, getRecentRequests } from "./requestStats.Model.js";

const getTotals = async () => {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM users) AS total_users,
       (SELECT COUNT(*)::int FROM users WHERE role = 'user') AS farmers,
       (SELECT COUNT(*)::int FROM users WHERE role = 'agronomist') AS agronomists,
       (SELECT COUNT(*)::int FROM users WHERE role = 'admin') AS admins,
       (SELECT COUNT(*)::int FROM users WHERE NOT is_active) AS inactive_users,
       (SELECT COUNT(*)::int FROM users WHERE email_verified_at IS NULL) AS unverified_users,
       (SELECT COUNT(*)::int FROM users WHERE created_at >= NOW() - INTERVAL '30 days') AS new_users_30_days,
       (SELECT COUNT(*)::int FROM crops) AS total_crops,
       (SELECT COUNT(*)::int FROM crops WHERE is_active) AS active_crops,
       (SELECT COUNT(*)::int FROM categories) AS total_categories`,
  );

  return result.rows[0];
};

const getFeedbackTotals = async () => {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
       COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
       ROUND(AVG(rating) FILTER (WHERE status = 'approved')::numeric, 1) AS average_rating
     FROM feedback`,
  );

  return result.rows[0];
};

const getRequestsTrend = async (days = 14) => {
  const result = await pool.query(
    `SELECT
       TO_CHAR(day, 'YYYY-MM-DD') AS date,
       COUNT(r.id)::int AS requests
     FROM GENERATE_SERIES(CURRENT_DATE - ($1::int - 1), CURRENT_DATE, INTERVAL '1 day') AS day
     LEFT JOIN consultation_requests r ON r.created_at::date = day::date
     GROUP BY day
     ORDER BY day`,
    [days],
  );

  return result.rows;
};

const getTopCrops = async () => {
  const result = await pool.query(
    `SELECT c.id, c.name, c.name_ar, COUNT(r.id)::int AS requests
     FROM crops c
     JOIN consultation_requests r ON r.crop_id = c.id
     GROUP BY c.id
     ORDER BY requests DESC, c.name
     LIMIT 5`,
  );

  return result.rows;
};

const getAgronomistWorkload = async () => {
  const result = await pool.query(
    `SELECT
       u.id, u.name, u.is_active,
       COUNT(r.id) FILTER (WHERE r.status IN ('assigned', 'in_progress'))::int AS open_requests,
       COUNT(r.id) FILTER (WHERE r.status IN ('answered', 'closed'))::int AS completed_requests
     FROM users u
     LEFT JOIN consultation_requests r ON r.agronomist_id = u.id
     WHERE u.role = 'agronomist'
     GROUP BY u.id
     ORDER BY open_requests DESC, u.name`,
  );

  return result.rows;
};

const getRecentActivities = async () => {
  const result = await pool.query(
    `SELECT a.id, a.action, a.entity_type, a.entity_id, a.created_at, u.name AS user_name, u.role AS user_role
     FROM activity_logs a
     LEFT JOIN users u ON u.id = a.user_id
     ORDER BY a.created_at DESC, a.id DESC
     LIMIT 8`,
  );

  return result.rows;
};

const getAttentionCounts = async () => {
  const result = await pool.query(
    `SELECT
       (SELECT COUNT(*)::int FROM consultation_requests
        WHERE status = 'pending' AND created_at < NOW() - INTERVAL '48 hours') AS overdue_pending_requests,
       (SELECT COUNT(*)::int FROM feedback WHERE status = 'pending') AS pending_feedback,
       (SELECT COUNT(*)::int FROM contact_messages WHERE status = 'new') AS new_contact_messages,
       (SELECT COUNT(*)::int FROM crops c
        WHERE c.is_active AND NOT EXISTS (
          SELECT 1 FROM agronomist_specialties s
          JOIN users u ON u.id = s.agronomist_id AND u.is_active
          WHERE s.category_id = c.category_id
        )) AS crops_without_specialist`,
  );

  return result.rows[0];
};

export const getAdminDashboard = async () => {
  const [totals, requests, feedback, trend, topCrops, workload, activities, attention, waiting] =
    await Promise.all([
      getTotals(),
      countRequestsByStatus(),
      getFeedbackTotals(),
      getRequestsTrend(),
      getTopCrops(),
      getAgronomistWorkload(),
      getRecentActivities(),
      getAttentionCounts(),
      getRecentRequests("r.status = 'pending'", [], { orderBy: "r.created_at ASC" }),
    ]);

  return {
    totals,
    requests,
    feedback,
    requests_trend: trend,
    top_crops: topCrops,
    agronomist_workload: workload,
    recent_activities: activities,
    needs_attention: { ...attention, oldest_pending_requests: waiting },
  };
};
