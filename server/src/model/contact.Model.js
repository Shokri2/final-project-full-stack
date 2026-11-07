import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";

export const createContactMessage = async ({ name, email, subject, message }) => {
  const result = await pool.query(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, subject, status, created_at`,
    [name, email, subject, message],
  );

  return result.rows[0];
};

export const getContactMessages = async (filters) => {
  const builder = createWhereBuilder();

  if (filters.status) {
    builder.add("status = ?", filters.status);
  }

  if (filters.search) {
    builder.add(
      "(name ILIKE ? OR email ILIKE ? OR subject ILIKE ? OR message ILIKE ?)",
      toSearchPattern(filters.search),
    );
  }

  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT *, COUNT(*) OVER() AS total_count
     FROM contact_messages
     ${builder.where()}
     ORDER BY created_at ${filters.order === "asc" ? "ASC" : "DESC"}, id DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const messages = result.rows.map(({ total_count, ...message }) => message);

  return { messages, total };
};

export const updateContactStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id],
  );

  return result.rows[0] ?? null;
};

export const deleteContactMessage = async (id) => {
  const result = await pool.query(
    `DELETE FROM contact_messages WHERE id = $1 RETURNING id`,
    [id],
  );

  return result.rowCount > 0;
};
