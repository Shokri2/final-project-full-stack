import { pool } from "../config/db.js";
import { createWhereBuilder, getOffset, toSearchPattern } from "../utils/pagination.js";

const categorySortColumns = {
  name: "LOWER(c.name)",
  created_at: "c.created_at",
  crops_count: "crops_count",
};

export const createCategories = async ({ name, description, image, created_by }) => {
  const result = await pool.query(
    `INSERT INTO categories (name, description, image, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description ?? null, image ?? null, created_by],
  );

  return result.rows[0];
};

export const getAllCategories = async (filters) => {
  const builder = createWhereBuilder();

  if (filters.search) {
    builder.add(
      "(c.name ILIKE ? OR c.description ILIKE ?)",
      toSearchPattern(filters.search),
    );
  }

  const values = [...builder.values, filters.limit, getOffset(filters)];

  const result = await pool.query(
    `SELECT
       c.*,
       COUNT(cr.id)::int AS crops_count,
       COUNT(cr.id) FILTER (WHERE cr.is_active)::int AS active_crops_count,
       COUNT(*) OVER() AS total_count
     FROM categories c
     LEFT JOIN crops cr ON cr.category_id = c.id
     ${builder.where()}
     GROUP BY c.id
     ORDER BY ${categorySortColumns[filters.sort]} ${filters.order === "asc" ? "ASC" : "DESC"}, c.id
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values,
  );

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const categories = result.rows.map(({ total_count, ...category }) => category);

  return { categories, total };
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

export const getCategoryDetails = async (id) => {
  const result = await pool.query(
    `SELECT
       c.*,
       creator.name AS created_by_name,
       updater.name AS updated_by_name,
       COALESCE(
         (SELECT json_agg(json_build_object(
                   'id', cr.id, 'name', cr.name, 'name_ar', cr.name_ar,
                   'image', cr.image, 'is_active', cr.is_active
                 ) ORDER BY cr.name)
          FROM crops cr WHERE cr.category_id = c.id),
         '[]'::json
       ) AS crops,
       COALESCE(
         (SELECT json_agg(json_build_object('id', u.id, 'name', u.name, 'email', u.email) ORDER BY u.name)
          FROM agronomist_specialties s
          JOIN users u ON u.id = s.agronomist_id
          WHERE s.category_id = c.id),
         '[]'::json
       ) AS agronomists,
       (SELECT COUNT(*)::int
        FROM consultation_requests r
        JOIN crops cr ON cr.id = r.crop_id
        WHERE cr.category_id = c.id) AS requests_count
     FROM categories c
     LEFT JOIN users creator ON creator.id = c.created_by
     LEFT JOIN users updater ON updater.id = c.updated_by
     WHERE c.id = $1`,
    [id],
  );

  return result.rows[0];
};

export const deleteCategory = async (id) => {
  const result = await pool.query(
    `DELETE FROM categories WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows;
};

export const updateCategory = async (id, updated_by, name, description, image) => {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1,
         description = $2,
         image = $3,
         updated_by = $4
     WHERE id = $5
     RETURNING *`,
    [name, description, image, updated_by, id],
  );

  return result.rows;
};

export const countExistingCategories = async (ids) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count FROM categories WHERE id = ANY($1::int[])`,
    [ids],
  );

  return result.rows[0].count;
};
