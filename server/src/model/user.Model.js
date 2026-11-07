import { pool } from "../config/db.js";

const userFields = `
  id,
  name,
  email,
  phone,
  role,
  avatar,
  is_active,
  (email_verified_at IS NOT NULL) AS email_verified,
  last_login_at,
  created_at,
  updated_at
`;

export const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT ${userFields}
    FROM users
    ORDER BY id;
  `);

  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT ${userFields}
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

export const deletUserById = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING ${userFields}`,
    [id],
  );

  return result.rows[0];
};

export const updateUser = async ({ id, name, phone, avatar }) => {
  const result = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         phone = COALESCE($2, phone),
         avatar = COALESCE($3, avatar)
     WHERE id = $4
     RETURNING ${userFields}`,
    [name ?? null, phone ?? null, avatar ?? null, id],
  );

  return result.rows[0];
};

export const updateUserStatus = async (id, isActive) => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = $1
     WHERE id = $2
     RETURNING ${userFields}`,
    [isActive, id],
  );

  return result.rows[0];
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
