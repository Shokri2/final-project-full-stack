import { pool } from "../config/db.js";

// Create a new user
export const createUser = async ({
  name,
  email,
  hashed_password,
  role,
  avatar,
}) => {
  const result = await pool.query(
    `INSERT INTO users (
       name,
       email,
       hashed_password,
       role,
       avatar
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       id,
       name,
       email,
       role,
       status,
       avatar,
       created_at,
       updated_at`,
    [name, email, hashed_password, role, avatar ?? null],
  );

  return result.rows[0];
};

// Find a user by email for authentication
export const findUserByEmail = async ({ email }) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       fname,
       lname,
       email,
       hashed_password,
       role,
       status,
       avatar,
       created_at,
       updated_at
     FROM users
     WHERE email = $1`,
    [email],
  );

  return result.rows;
};
