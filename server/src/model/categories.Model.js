import { pool } from "../config/db.js";

export const createCategories = async ({ name, description, created_by }) => {
  const result = await pool.query(
    `insert into categories(name, description, created_by) values
        ($1, $2, $3) returning *`,
    [name, description, created_by],
  );

  return result.rows[0];
};

export const getAllCategories = async () => {
  const result = await pool.query(`select * from categories`);

  return result.rows;
};

export const getCategoryByName = async ( name ) => {
  const result = await pool.query(`SELECT * FROM categories WHERE name = $1`, [
    name,
  ]);

  return result.rows;
};
export const getCategoryById = async ({ id }) => {
  const result = await pool.query(`select * from categories where id = $1`, [
    id,
  ]);
  return result.rows;
};

export const deleteCategory = async (id) => {
  const result = await pool.query(
    `delete from categories where id= $1 returning *`,
    [id],
  );
  return result.rows;
};

export const updateCategory = async (
  id,
  updated_by,
  name,
  description,
  updated_at,
) => {
  const result = await pool.query(
    `update categories set name=$1, description=$2,updated_by=$3 updated_at=$4 where id=$5 returning * `,
    [name, description, updated_by, updated_at, id],
  );
  return result.rows;
};