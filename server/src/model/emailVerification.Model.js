import { pool } from "../config/db.js";
import { hashToken } from "../utils/token.js";

export const createEmailVerificationToken = async (
  { userId, token, expiresAt },
  client = pool,
) => {
  await client.query(
    `UPDATE email_verification_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE user_id = $1
       AND used_at IS NULL`,
    [userId],
  );

  const result = await client.query(
    `INSERT INTO email_verification_tokens
       (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, expires_at, created_at`,
    [userId, hashToken(token), expiresAt],
  );

  return result.rows[0];
};

export const useEmailVerificationToken = async (token, client = pool) => {
  const result = await client.query(
    `UPDATE email_verification_tokens
     SET used_at = CURRENT_TIMESTAMP
     WHERE token_hash = $1
       AND used_at IS NULL
       AND expires_at > CURRENT_TIMESTAMP
     RETURNING user_id`,
    [hashToken(token)],
  );

  return result.rows[0] ?? null;
};
