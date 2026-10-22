import { pool } from "../config/db.js";

export const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT
      id,
      fname,
      lname,
      email,
      hashed_password,
      role,
      status,
      created_at,
      avatar,
      updated_at
    FROM users;
  `);

  return result.rows;
};

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

export const deletUserById = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows[0];
};

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
     SET fname = $1,
         lname = $2,
         email = $3,
         avatar = $4,

         updated_at = $5
     WHERE id = $6
     RETURNING *`,
    [fname, lname, email, avatar,  updated_at, id],
  );

  return result.rows[0];
};
// --------------status------------
export const updateUserStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE users
     SET status = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, fname, lname, email, role, status, created_at, avatar, updated_at`,
    [status, id],
  );

  return result.rows[0];
};
