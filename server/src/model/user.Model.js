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
      created_at,
      avatar,
      updated_at
    FROM users;
  `);

  return result.rows;
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `select id, fname, lname, email, role, created_at, avatar, updated_at
         from users
         where id = $1`,
    [id],
  );

  return result.rows[0];
};

export const deletUserById = async (id) => {
  const result = await pool.query(
    `delete from users
         where id = $1
         returning *`,
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
    `update users
         set fname=$1,
             lname=$2,
             email=$3,
             avatar=$4,
             updated_at=$5
         where id = $6
         returning *`,
    [fname, lname, email, avatar, updated_at, id],
  );

  return result.rows[0];
};
