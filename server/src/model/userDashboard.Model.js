import { pool } from "../config/db.js";
import { countRequestsByStatus, getRecentRequests } from "./requestStats.Model.js";
import { findCurrentUserById } from "./auth.Model.js";

const getRequestTimeline = async (userId) => {
  const result = await pool.query(
    `SELECT
       h.id, h.request_id, r.title AS request_title,
       h.from_status, h.to_status, h.note, h.created_at,
       u.name AS changed_by_name, u.role AS changed_by_role
     FROM request_status_history h
     JOIN consultation_requests r ON r.id = h.request_id
     LEFT JOIN users u ON u.id = h.changed_by
     WHERE r.user_id = $1
     ORDER BY h.created_at DESC, h.id DESC
     LIMIT 8`,
    [userId],
  );

  return result.rows;
};

const getFeedbackCounts = async (userId) => {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
       COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
       COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
     FROM feedback
     WHERE user_id = $1`,
    [userId],
  );

  return result.rows[0];
};

const getRequestsAwaitingReview = async (userId) => {
  const result = await pool.query(
    `SELECT r.id, r.title, r.status, c.name AS crop_name
     FROM consultation_requests r
     JOIN crops c ON c.id = r.crop_id
     WHERE r.user_id = $1
       AND r.status IN ('answered', 'closed')
       AND NOT EXISTS (SELECT 1 FROM feedback f WHERE f.request_id = r.id)
     ORDER BY r.answered_at DESC
     LIMIT 5`,
    [userId],
  );

  return result.rows;
};

export const getUserDashboard = async (userId) => {
  const [account, requests, recent, activity, feedback, toReview] = await Promise.all([
    findCurrentUserById(userId),
    countRequestsByStatus("user_id = $1", [userId]),
    getRecentRequests("r.user_id = $1", [userId]),
    getRequestTimeline(userId),
    getFeedbackCounts(userId),
    getRequestsAwaitingReview(userId),
  ]);

  return {
    account,
    requests,
    recent_requests: recent,
    recent_activity: activity,
    feedback,
    consultations_to_review: toReview,
  };
};
