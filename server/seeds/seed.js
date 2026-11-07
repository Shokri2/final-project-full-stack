import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../src/config/db.js";
import { categories, crops, growthStages } from "./data/catalog.js";
import { users, requests, feedback, contactMessages } from "./data/people.js";

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n, extraHours = 0) => new Date(Date.now() - n * DAY + extraHours * 60 * 60 * 1000);

const idOf = async (client, sql, params) => (await client.query(sql, params)).rows[0]?.id;

const seed = async () => {
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("Set SEED_PASSWORD (min 8 chars) in .env before seeding.");
  }

  const client = await pool.connect();
  const added = { users: 0, categories: 0, crops: 0, stages: 0, requests: 0 };

  try {
    await client.query("BEGIN");

    const hashed = await bcrypt.hash(password, 12);
    const userIds = {};
    for (const u of users) {
      const inserted = await client.query(
        `INSERT INTO users (name, email, phone, hashed_password, role, is_active, email_verified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO NOTHING RETURNING id`,
        [
          u.name,
          u.email,
          u.phone ?? null,
          hashed,
          u.role,
          u.active ?? true,
          u.verified === false ? null : new Date(),
        ],
      );
      added.users += inserted.rowCount;
      userIds[u.key] = await idOf(client, "SELECT id FROM users WHERE email = $1", [u.email]);
    }
    const adminId = userIds.admin;

    const categoryIds = {};
    for (const c of categories) {
      const inserted = await client.query(
        `INSERT INTO categories (name, description, image, created_by)
         VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING`,
        [c.name, c.description, c.image_url, adminId],
      );
      added.categories += inserted.rowCount;
      categoryIds[c.name] = await idOf(client, "SELECT id FROM categories WHERE name = $1", [c.name]);
    }

    const cropIds = {};
    for (const c of crops) {
      const { rows } = await client.query(
        `INSERT INTO crops (category_id, name, name_ar, description, image, water_needs,
                            temperature_min, temperature_max, sunlight, soil_type,
                            growth_duration_days, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (name) DO UPDATE SET
           category_id = CASE
             WHEN crops.category_id = (SELECT id FROM categories WHERE name = 'General')
             THEN EXCLUDED.category_id ELSE crops.category_id END,
           name_ar = CASE WHEN crops.name_ar = crops.name THEN EXCLUDED.name_ar ELSE crops.name_ar END
         RETURNING id, (xmax = 0) AS inserted`,
        [
          categoryIds[c.category],
          c.name,
          c.name_ar,
          c.description,
          c.image_url,
          c.water_needs,
          c.temperature_min,
          c.temperature_max,
          c.sunlight,
          c.soil_type,
          c.growth_duration_days,
          adminId,
        ],
      );
      if (rows[0].inserted) added.crops += 1;
      cropIds[c.name] = rows[0].id;
    }

    await client.query(
      `DELETE FROM categories c WHERE c.name = 'General'
         AND NOT EXISTS (SELECT 1 FROM crops WHERE category_id = c.id)`,
    );

    for (const [cropName, stages] of Object.entries(growthStages)) {
      for (const [index, s] of stages.entries()) {
        const inserted = await client.query(
          `INSERT INTO crop_growth_stages (crop_id, name, name_ar, stage_order, duration_days, tips)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (crop_id, stage_order) DO UPDATE SET
             name_ar = CASE WHEN crop_growth_stages.name_ar = crop_growth_stages.name
                            THEN EXCLUDED.name_ar ELSE crop_growth_stages.name_ar END
           RETURNING (xmax = 0) AS inserted`,
          [cropIds[cropName], s.name, s.name_ar, index + 1, s.duration_days, s.tips],
        );
        if (inserted.rows[0].inserted) added.stages += 1;
      }
    }

    for (const u of users.filter((x) => x.specialties)) {
      for (const categoryName of u.specialties) {
        await client.query(
          `INSERT INTO agronomist_specialties (agronomist_id, category_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [userIds[u.key], categoryIds[categoryName]],
        );
      }
    }

    const { rows: existing } = await client.query("SELECT COUNT(*)::int AS n FROM consultation_requests");
    if (existing[0].n === 0) {
      await seedWorkflow(client, { userIds, cropIds });
      added.requests = requests.length;
    } else {
      console.log("Consultation requests already exist; demo workflow data skipped.");
    }

    await client.query("COMMIT");
    console.log("Seed complete. Added:", added);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const seedWorkflow = async (client, { userIds, cropIds }) => {
  const log = (userId, action, entityType, entityId, details, at) =>
    client.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, action, entityType, entityId, details ? JSON.stringify(details) : null, at],
    );

  const requestIds = {};
  for (const r of requests) {
    const createdAt = daysAgo(r.daysAgo);
    const requestId = await idOf(
      client,
      `INSERT INTO consultation_requests
         (user_id, crop_id, title, description, farm_location, field_area_m2, priority, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        userIds[r.user],
        cropIds[r.crop],
        r.title,
        r.description,
        r.farm_location ?? null,
        r.field_area_m2 ?? null,
        r.priority,
        createdAt,
      ],
    );
    requestIds[r.title] = requestId;

    await client.query(
      `INSERT INTO request_status_history (request_id, from_status, to_status, changed_by, note, created_at)
       VALUES ($1, NULL, 'pending', $2, 'Request submitted.', $3)`,
      [requestId, userIds[r.user], createdAt],
    );
    await log(userIds[r.user], "REQUEST_CREATED", "request", requestId, { title: r.title }, createdAt);

    let status = "pending";
    for (const [i, step] of r.steps.entries()) {
      const at = daysAgo(r.daysAgo, (i + 1) * 6);
      const changedBy = userIds[step.by];

      await client.query(
        `UPDATE consultation_requests SET
           status = $2::varchar,
           agronomist_id       = COALESCE($3::int, agronomist_id),
           agronomist_response = COALESCE($4::text, agronomist_response),
           rejection_reason    = COALESCE($5::text, rejection_reason),
           assigned_at = CASE WHEN $2::varchar = 'assigned' THEN $6::timestamptz ELSE assigned_at END,
           answered_at = CASE WHEN $2::varchar = 'answered' THEN $6::timestamptz ELSE answered_at END,
           closed_at   = CASE WHEN $2::varchar IN ('closed', 'rejected', 'cancelled')
                              THEN $6::timestamptz ELSE closed_at END
         WHERE id = $1`,
        [
          requestId,
          step.to,
          step.agronomist ? userIds[step.agronomist] : null,
          step.response ?? null,
          step.reason ?? null,
          at,
        ],
      );
      await client.query(
        `INSERT INTO request_status_history (request_id, from_status, to_status, changed_by, note, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [requestId, status, step.to, changedBy, step.note ?? step.reason ?? null, at],
      );
      await log(changedBy, "REQUEST_STATUS_CHANGED", "request", requestId, { from: status, to: step.to }, at);
      status = step.to;
    }
  }

  for (const f of feedback) {
    const reviewed = f.status !== "pending";
    await client.query(
      `INSERT INTO feedback (user_id, crop_id, request_id, rating, comment, status,
                             reviewed_by, reviewed_at, rejection_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userIds[f.user],
        f.crop ? cropIds[f.crop] : null,
        f.request ? requestIds[f.request] : null,
        f.rating,
        f.comment,
        f.status,
        reviewed ? userIds[f.reviewer] : null,
        reviewed ? daysAgo(1) : null,
        f.reason ?? null,
      ],
    );
  }

  for (const m of contactMessages) {
    await client.query(
      `INSERT INTO contact_messages (name, email, subject, message, status) VALUES ($1, $2, $3, $4, $5)`,
      [m.name, m.email, m.subject, m.message, m.status],
    );
  }
};

seed()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
