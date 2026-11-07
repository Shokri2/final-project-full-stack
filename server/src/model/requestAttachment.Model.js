import { pool } from "../config/db.js";

export const addAttachments = async (client, { requestId, userId, files }) => {
  for (const file of files) {
    await client.query(
      `INSERT INTO request_attachments
         (request_id, uploaded_by, file_url, storage_key, original_name, mime_type, size_bytes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        requestId,
        userId,
        file.url,
        file.filename,
        file.originalname.slice(0, 255),
        file.mimetype,
        file.size,
      ],
    );
  }
};

export const countAttachments = async (client, requestId) => {
  const result = await client.query(
    `SELECT COUNT(*)::int AS count FROM request_attachments WHERE request_id = $1`,
    [requestId],
  );

  return result.rows[0].count;
};

export const getAttachment = async (requestId, attachmentId) => {
  const result = await pool.query(
    `SELECT id, request_id, file_url
     FROM request_attachments
     WHERE id = $1 AND request_id = $2`,
    [attachmentId, requestId],
  );

  return result.rows[0] ?? null;
};

export const deleteAttachment = async (attachmentId) => {
  await pool.query(`DELETE FROM request_attachments WHERE id = $1`, [attachmentId]);
};
