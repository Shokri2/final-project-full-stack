import { pool } from "../config/db.js";

export const createCategories = async ({ name, description, created_by }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, created_by],
  );

  return result.rows[0];
};

export const getAllCategories = async () => {
  const result = await pool.query(`SELECT * FROM categories ORDER BY id`);

  return result.rows;
};

export const getCategoryByName = async (name) => {
  const result = await pool.query(
    `SELECT * FROM categories WHERE LOWER(name) = LOWER($1)`,
    [name],
  );

  return result.rows;
};

export const getCategoryById = async ({ id }) => {
  const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [
    id,
  ]);

  return result.rows;
};

export const deleteCategory = async (id) => {
  const result = await pool.query(
    `DELETE FROM categories WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows;
};

export const updateCategory = async (id, updated_by, name, description) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1,
         description = $2,
         updated_by = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [name, description, updated_by, id],
  );

  return result.rows;
};
