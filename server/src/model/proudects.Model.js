import { pool } from "../config/db.js";

// CREATE PRODUCT
export const createProduct = async ({
  name,
  description,
  price,
  stock,
  image,
  catid,
  created_by,
  status,
}) => {
  const result = await pool.query(
    `insert into products
    (name, description, price, stock, image, catid, created_by, status)
    values ($1, $2, $3, $4, $5, $6, $7, $8)
    returning *`,
    [name, description, price, stock, image, catid, created_by, status],
  );
  return result.rows[0];
};
export const getAllProducts = async () => {
  const result = await pool.query(`select * from products`);

  return result.rows;
};
export const getProductByName = async (name) => {
  const result = await pool.query(`select * from products where name = $1`, [
    name,
  ]);
  return result.rows;
};
export const getProductById = async ({ id }) => {
  const result = await pool.query(`select * from products where id = $1`, [id]);
  return result.rows;
};
export const deleteProduct = async (id) => {
  const result = await pool.query(
    `delete from products where id = $1 returning *`,
    [id],
  );
  return result.rows;
};
export const updateProduct = async (
  id,
  updated_by,
  name,
  description,
  price,
  stock,
  image,
  catid,
  status,
) => {
  const result = await pool.query(
    `update products
     set name = $1,
         description = $2,
         price = $3,
         stock = $4,
         image = $5,
         catid = $6,
         updated_by = $7,
         status = $8,
         updated_at = CURRENT_TIMESTAMP
     where id = $9
     returning *`,
    [name, description, price, stock, image, catid, updated_by, status, id],
  );
  return result.rows;
};
export const updateProductStatus = async (id, status, updated_by) => {
  const result = await pool.query(
    `update products
     set status = $1,
         updated_by = $2,
         updated_at = CURRENT_TIMESTAMP
     where id = $3
     returning *`,
    [status, updated_by, id],
  );
  return result.rows;
};
