import { pool } from "../config/db.js";

export const getRequestDetails = async (id) => {
  const result = await pool.query(
    `SELECT
       r.*,
       json_build_object(
         'id', c.id, 'name', c.name, 'name_ar', c.name_ar, 'image', c.image,
         'category_id', c.category_id, 'category_name', cat.name
       ) AS crop,
       json_build_object(
         'id', owner.id, 'name', owner.name, 'email', owner.email, 'phone', owner.phone
       ) AS farmer,
       CASE WHEN agronomist.id IS NULL THEN NULL ELSE json_build_object(
         'id', agronomist.id, 'name', agronomist.name, 'email', agronomist.email
       ) END AS agronomist,
       COALESCE(
         (SELECT json_agg(json_build_object(
                   'id', a.id, 'file_url', a.file_url, 'original_name', a.original_name,
                   'mime_type', a.mime_type, 'size_bytes', a.size_bytes, 'created_at', a.created_at
                 ) ORDER BY a.id)
          FROM request_attachments a WHERE a.request_id = r.id),
         '[]'::json
       ) AS attachments,
       COALESCE(
         (SELECT json_agg(json_build_object(
                   'id', h.id, 'from_status', h.from_status, 'to_status', h.to_status,
                   'note', h.note, 'created_at', h.created_at,
                   'changed_by', json_build_object('id', u.id, 'name', u.name, 'role', u.role)
                 ) ORDER BY h.created_at, h.id)
          FROM request_status_history h
          LEFT JOIN users u ON u.id = h.changed_by
          WHERE h.request_id = r.id),
         '[]'::json
       ) AS history,
       (SELECT json_build_object(
                 'id', f.id, 'rating', f.rating, 'comment', f.comment, 'status', f.status
               )
        FROM feedback f WHERE f.request_id = r.id) AS feedback
     FROM consultation_requests r
     JOIN crops c ON c.id = r.crop_id
     JOIN categories cat ON cat.id = c.category_id
     JOIN users owner ON owner.id = r.user_id
     LEFT JOIN users agronomist ON agronomist.id = r.agronomist_id
     WHERE r.id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
};
