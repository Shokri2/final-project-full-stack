import { pool } from "../config/db.js";

// sql injection

export const createUser = async ({
  fname,
  lname,
  email,
  hashed_password,
  role,
  avatar,
}) => {
  const result = await pool.query(
    `INSERT INTO users (fname, lname, email, hashed_password, role, avatar)
     VALUES ($1, $2, $3, $4, $5, $6) returning *`,
    [fname, lname, email, hashed_password, role, avatar],
  );
  return result.rows[0];
  // last row
};
export const findUserByEmail = async ({ email }) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  return result.rows;
};
