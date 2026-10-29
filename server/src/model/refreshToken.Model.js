import { pool } from "../config/db.js";
import crypto from "crypto";

export const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createRefreshTokenSession = async ({
  userId,
  refreshToken,
  expiresAt,
}) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const result = await pool.query(
    `INSERT INTO refresh_token_sessions
       (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at, created_at`,
    [userId, tokenHash, expiresAt],
  );

  return result.rows[0];
};

export const findRefreshTokenSession = async (refreshToken) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const result = await pool.query(
    `SELECT
       r.id,
       r.user_id,
       r.token_hash,
       r.expires_at,
       r.revoked_at,
       u.role,
       u.status
     FROM refresh_token_sessions r
     JOIN users u ON u.id = r.user_id
     WHERE r.token_hash = $1
       AND r.revoked_at IS NULL
       AND r.expires_at > CURRENT_TIMESTAMP`,
    [tokenHash],
  );

  return result.rows[0] ?? null;
};

export const revokeRefreshTokenSession = async (refreshToken) => {
  const tokenHash = hashRefreshToken(refreshToken);

  const result = await pool.query(
    `UPDATE refresh_token_sessions
     SET revoked_at = CURRENT_TIMESTAMP
     WHERE token_hash = $1
       AND revoked_at IS NULL
     RETURNING id`,
    [tokenHash],
  );

  return result.rowCount > 0;
};

export const rotateRefreshTokenSession = async ({
  oldRefreshToken,
  newRefreshToken,
  expiresAt,
}) => {
  const oldHash = hashRefreshToken(oldRefreshToken);
  const newHash = hashRefreshToken(newRefreshToken);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const oldSession = await client.query(
      `SELECT id, user_id
       FROM refresh_token_sessions
       WHERE token_hash = $1
         AND revoked_at IS NULL
         AND expires_at > CURRENT_TIMESTAMP
       FOR UPDATE`,
      [oldHash],
    );

    if (oldSession.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }

    const { id, user_id: userId } = oldSession.rows[0];

    await client.query(
      `UPDATE refresh_token_sessions
       SET revoked_at = CURRENT_TIMESTAMP,
           replaced_by_token_hash = $1
       WHERE id = $2`,
      [newHash, id],
    );

    await client.query(
      `INSERT INTO refresh_token_sessions
         (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, newHash, expiresAt],
    );

    await client.query("COMMIT");

    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
