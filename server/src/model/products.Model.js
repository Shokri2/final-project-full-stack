import { pool } from "../config/db.js";

// Create a product
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
    `INSERT INTO products
      (name, description, price, stock, image, catid, created_by, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      name,
      description ?? "",
      price,
      stock,
      image ?? "",
      catid,
      created_by,
      status,
    ],
  );

  return result.rows[0];
};

// Get all approved products for public display
export const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT *
     FROM products
     WHERE status = $1
     ORDER BY id DESC`,
    ["approved"],
  );

  return result.rows;
};

// Get a product by name, case-insensitive
export const getProductByName = async (name) => {
  const result = await pool.query(
    `SELECT *
     FROM products
     WHERE LOWER(name) = LOWER($1)`,
    [name],
  );

  return result.rows;
};

// Get a product by ID
export const getProductById = async ({ id }) => {
  const result = await pool.query(
    `SELECT *
     FROM products
     WHERE id = $1`,
    [id],
  );

  return result.rows;
};

// Delete a product
export const deleteProduct = async (id) => {
  const result = await pool.query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING *`,
    [id],
  );

  return result.rows;
};

// Update a product
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
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         stock = $4,
         image = $5,
         catid = $6,
         updated_by = $7,
         status = $8,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING *`,
    [name, description, price, stock, image, catid, updated_by, status, id],
  );

  return result.rows;
};

// Update product approval status
export const updateProductStatus = async (id, status, updated_by) => {
  const result = await pool.query(
    `UPDATE products
     SET status = $1,
         updated_by = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [status, updated_by, id],
  );

  return result.rows;
};
