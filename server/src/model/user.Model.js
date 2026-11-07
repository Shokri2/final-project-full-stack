import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";

const userFields = `
  u.id,
  u.name,
  u.email,
  u.phone,
  u.role,
  u.avatar,
  u.is_active,
  (u.email_verified_at IS NOT NULL) AS email_verified,
  u.last_login_at,
  u.created_at,
  u.updated_at
`;

const userSortColumns = {
  created_at: "u.created_at",
  name: "LOWER(u.name)",
  email: "u.email",
  role: "u.role",
  last_login_at: "u.last_login_at",
};

export const getAllUsers = async (filters) => {
  const builder = createWhereBuilder();

  if (filters.search) {
    builder.add(
      "(u.name ILIKE ? OR u.email ILIKE ? OR u.phone ILIKE ?)",
      toSearchPattern(filters.search),
    );
  }

  if (filters.role) {
    builder.add("u.role = ?", filters.role);
  }

  if (filters.is_active !== undefined) {
    builder.add("u.is_active = ?", filters.is_active);
  }

  if (filters.email_verified !== undefined) {
    builder.addRaw(
      filters.email_verified
        ? "u.email_verified_at IS NOT NULL"
        : "u.email_verified_at IS NULL",
    );
  }

  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT ${userFields}, COUNT(*) OVER() AS total_count
     FROM users u
     ${builder.where()}
     ORDER BY ${userSortColumns[filters.sort]} ${filters.order === "asc" ? "ASC" : "DESC"} NULLS LAST, u.id
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const users = result.rows.map(({ total_count, ...user }) => user);

  return { users, total };
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT
       ${userFields},
       COALESCE(
         (SELECT json_agg(json_build_object('id', c.id, 'name', c.name) ORDER BY c.name)
          FROM agronomist_specialties s
          JOIN categories c ON c.id = s.category_id
          WHERE s.agronomist_id = u.id),
         '[]'::json
       ) AS specialties,
       (SELECT COUNT(*)::int FROM consultation_requests r WHERE r.user_id = u.id) AS submitted_requests,
       (SELECT COUNT(*)::int FROM consultation_requests r WHERE r.agronomist_id = u.id) AS assigned_requests,
       (SELECT COUNT(*)::int FROM feedback f WHERE f.user_id = u.id) AS feedback_count
     FROM users u
     WHERE u.id = $1`,
    [id],
  );

  return result.rows[0];
};

export const createUserByAdmin = async (
  { name, email, phone, hashed_password, role },
  client = pool,
) => {
  const result = await client.query(
    `INSERT INTO users (name, email, phone, hashed_password, role, email_verified_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
     RETURNING id`,
    [name, email, phone ?? null, hashed_password, role],
  );

  return result.rows[0];
};

export const deletUserById = async (id) => {
  const result = await pool.query(
    `DELETE FROM users u
     WHERE u.id = $1
     RETURNING ${userFields}`,
    [id],
  );

  return result.rows[0];
};

export const updateUser = async ({ id, name, phone, avatar }) => {
  const result = await pool.query(
    `UPDATE users u
     SET name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         avatar = COALESCE($3, avatar)
     WHERE u.id = $4
     RETURNING ${userFields}`,
    [name ?? null, phone ?? null, avatar ?? null, id],
  );

  return result.rows[0];
};

export const updateUserStatus = async (id, isActive) => {
  const result = await pool.query(
    `UPDATE users u
     SET is_active = $1
     WHERE u.id = $2
     RETURNING ${userFields}`,
    [isActive, id],
  );

  return result.rows[0];
};

export const updateUserRole = async (id, role, client = pool) => {
  const result = await client.query(
    `UPDATE users u
     SET role = $1
     WHERE u.id = $2
     RETURNING ${userFields}`,
    [role, id],
  );

  return result.rows[0];
};

export const replaceAgronomistSpecialties = async (
  agronomistId,
  categoryIds,
  client = pool,
) => {
  await client.query(
    `DELETE FROM agronomist_specialties WHERE agronomist_id = $1`,
    [agronomistId],
  );

  if (categoryIds.length > 0) {
    await client.query(
      `INSERT INTO agronomist_specialties (agronomist_id, category_id)
       SELECT $1, UNNEST($2::int[])`,
      [agronomistId, categoryIds],
    );
  }
};

export const countActiveAdmins = async (client = pool) => {
  const result = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM users
     WHERE role = 'admin' AND is_active = TRUE`,
  );

  return result.rows[0].count;
};

export const getUserPasswordById = async (id) => {
  const result = await pool.query(
    `SELECT id, hashed_password
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

export const updateUserPassword = async (id, hashed_password) => {
  await pool.query(
    `UPDATE users
     SET hashed_password = $1
     WHERE id = $2`,
    [hashed_password, id],
  );
};
