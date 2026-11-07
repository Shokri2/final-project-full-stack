import { pool } from "../config/db.js";

export const createUser = async (
  { name, email, phone, hashed_password, avatar },
  client = pool,
) => {
  const result = await client.query(
    `INSERT INTO users (
       name,
       email,
       phone,
       hashed_password,
       role,
       avatar
     )
     VALUES ($1, $2, $3, $4, 'user', $5)
     RETURNING
       id,
       name,
       email,
       phone,
       role,
       avatar,
       is_active,
       (email_verified_at IS NOT NULL) AS email_verified,
       created_at,
       updated_at`,
    [name, email, phone ?? null, hashed_password, avatar ?? null],
  );

  return result.rows[0];
};

export const findUserByEmail = async ({ email }) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       email,
       phone,
       hashed_password,
       role,
       avatar,
       is_active,
       email_verified_at,
       created_at,
       updated_at
     FROM users
     WHERE email = $1`,
    [email],
  );

  return result.rows;
};

export const findCurrentUserById = async (id) => {
  const result = await pool.query(
    `SELECT
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
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

export const markEmailAsVerified = async (userId, client = pool) => {
  await client.query(
    `UPDATE users
     SET email_verified_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND email_verified_at IS NULL`,
    [userId],
  );
};

export const updateLastLogin = async (userId) => {
  await pool.query(
    `UPDATE users
     SET last_login_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [userId],
  );
};
