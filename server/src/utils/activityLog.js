import { pool } from "../config/db.js";

export const logActivity = async (
  {
    userId = null,
    action,
    entityType = null,
    entityId = null,
    details = null,
    ip = null,
  },
  client = pool,
) => {
  await client.query(
    `INSERT INTO activity_logs
       (user_id, action, entity_type, entity_id, details, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      userId,
      action,
      entityType,
      entityId,
      details ? JSON.stringify(details) : null,
      ip,
    ],
  );
};
