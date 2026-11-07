import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";
import { agronomistFeedbackScope } from "../utils/feedbackRules.js";

const feedbackSortColumns = {
  created_at: "f.created_at",
  rating: "f.rating",
  status: "f.status",
};

const runListQuery = async (builder, filters, columns) => {
  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT ${columns}, COUNT(*) OVER() AS total_count
     FROM feedback f
     JOIN users u ON u.id = f.user_id
     LEFT JOIN crops c ON c.id = f.crop_id
     LEFT JOIN consultation_requests r ON r.id = f.request_id
     ${builder.where()}
     ORDER BY ${feedbackSortColumns[filters.sort]} ${filters.order === "asc" ? "ASC" : "DESC"}, f.id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const feedback = result.rows.map(({ total_count, ...row }) => row);

  return { feedback, total };
};

export const getPublicFeedback = async (filters) => {
  const builder = createWhereBuilder();
  builder.addRaw("f.status = 'approved'");

  if (filters.crop_id) {
    builder.add("f.crop_id = ?", filters.crop_id);
  }

  if (filters.rating) {
    builder.add("f.rating = ?", filters.rating);
  }

  if (filters.search) {
    builder.add("f.comment ILIKE ?", toSearchPattern(filters.search));
  }

  return runListQuery(
    builder,
    filters,
    `f.id, f.rating, f.comment, f.created_at, f.crop_id,
     c.name AS crop_name, c.name_ar AS crop_name_ar,
     u.name AS user_name, (f.request_id IS NOT NULL) AS verified_consultation`,
  );
};

export const getUserFeedback = async (userId, filters) => {
  const builder = createWhereBuilder();
  builder.add("f.user_id = ?", userId);

  if (filters.status) {
    builder.add("f.status = ?", filters.status);
  }

  if (filters.search) {
    builder.add("f.comment ILIKE ?", toSearchPattern(filters.search));
  }

  return runListQuery(
    builder,
    filters,
    `f.id, f.rating, f.comment, f.status, f.rejection_reason, f.created_at, f.reviewed_at,
     f.crop_id, c.name AS crop_name, f.request_id, r.title AS request_title`,
  );
};

export const getManagedFeedback = async (filters, user) => {
  const builder = createWhereBuilder();

  if (user.role === "agronomist") {
    builder.add(agronomistFeedbackScope("?"), user.id);
    builder.add("f.user_id <> ?", user.id);
  }

  if (filters.status) {
    builder.add("f.status = ?", filters.status);
  }

  if (filters.crop_id) {
    builder.add("f.crop_id = ?", filters.crop_id);
  }

  if (filters.rating) {
    builder.add("f.rating = ?", filters.rating);
  }

  if (filters.type === "request") {
    builder.addRaw("f.request_id IS NOT NULL");
  } else if (filters.type === "crop") {
    builder.addRaw("f.request_id IS NULL AND f.crop_id IS NOT NULL");
  } else if (filters.type === "platform") {
    builder.addRaw("f.request_id IS NULL AND f.crop_id IS NULL");
  }

  if (filters.search) {
    builder.add("(f.comment ILIKE ? OR u.name ILIKE ? OR c.name ILIKE ?)", toSearchPattern(filters.search));
  }

  return runListQuery(
    builder,
    filters,
    `f.id, f.rating, f.comment, f.status, f.rejection_reason, f.created_at, f.reviewed_at,
     f.user_id, u.name AS user_name, u.email AS user_email,
     f.crop_id, c.name AS crop_name, f.request_id, r.title AS request_title`,
  );
};

export const isFeedbackInAgronomistScope = async (feedbackId, agronomistId) => {
  const result = await pool.query(
    `SELECT 1 FROM feedback f WHERE f.id = $1 AND ${agronomistFeedbackScope("$2")}`,
    [feedbackId, agronomistId],
  );

  return result.rowCount > 0;
};
