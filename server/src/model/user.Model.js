
import { pool } from "../config/db.js";

// Get all users without exposing password hashes
export const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      fname,
      lname,
      email,
      role,
      status,
      created_at,
      avatar,
      updated_at
    FROM users;
  `);

  return result.rows;
};

// Get one user without exposing password hash
export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT
       id,
       fname,
       lname,
       email,
       role,
       status,
       created_at,
       avatar,
       updated_at
     FROM users
     WHERE id = $1`,
    [id],
  );

  return result.rows[0];
};

// Delete user and return safe fields only
export const deletUserById = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING
       id,
       fname,
       lname,
       email,
       role,
       status,
       created_at,
       avatar,
       updated_at`,
    [id],
  );

  return result.rows[0];
};

// Update profile fields only
export const updateUser = async ({
  id,
  fname,
  lname,
  email,
  avatar,
  updated_at,
}) => {
  const result = await pool.query(
    `UPDATE users
     SET fname = COALESCE($1, fname),
         lname = COALESCE($2, lname),
         email = COALESCE($3, email),
         avatar = COALESCE($4, avatar),
         updated_at = $5
     WHERE id = $6
     RETURNING
       id,
       fname,
       lname,
       email,
       role,
       status,
       created_at,
       avatar,
       updated_at`,
    [fname ?? null, lname ?? null, email ?? null, avatar ?? null, updated_at, id],
  );

  return result.rows[0];
};

// Update user status
export const updateUserStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE users
     SET status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING
       id,
       fname,
       lname,
       email,
       role,
       status,
       created_at,
       avatar,
       updated_at`,
    [status, id],
  );

  return result.rows[0];
};
