import { pool } from "../config/db.js";

export const getAllCrops = async () => {
  const query = `
        SELECT
            id,
            name,
            image,
            description,
            water_needs,
            temperature_min,
            temperature_max,
            sunlight,
            soil_type,
            growth_duration_days
        FROM crops
        ORDER BY id ASC;
    `;

  const result = await pool.query(query);

  return result.rows;
};

export const getCropById = async (id) => {
  const cropQuery = `
        SELECT
            id,
            name,
            image,
            description,
            water_needs,
            temperature_min,
            temperature_max,
            sunlight,
            soil_type,
            growth_duration_days
        FROM crops
        WHERE id = $1;
    `;

  const cropResult = await pool.query(cropQuery, [id]);

  if (cropResult.rows.length === 0) {
    return null;
  }

  const stagesQuery = `
        SELECT
            id,
            name,
            stage_order,
            duration_days,
            tips
        FROM crop_growth_stages
        WHERE crop_id = $1
        ORDER BY stage_order ASC;
    `;

  const stagesResult = await pool.query(stagesQuery, [id]);

  return {
    ...cropResult.rows[0],
    growth_stages: stagesResult.rows,
  };
};
