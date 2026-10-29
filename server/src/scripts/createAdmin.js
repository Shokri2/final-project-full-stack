import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

const createAdmin = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      "Please set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env",
    );
  }

  if (password.length < 8) {
    throw new Error("Admin password must be at least 8 characters.");
  }

  const hashed_password = await bcrypt.hash(password, 12);

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (existing.rowCount > 0) {
    await pool.query(
      `UPDATE users
       SET name = $1,
           hashed_password = $2,
           role = 'admin',
           status = 'approved',
           updated_at = CURRENT_TIMESTAMP
       WHERE email = $3`,
      [name.trim(), hashed_password, email],
    );

    console.log("Admin account updated successfully.");
  } else {
    await pool.query(
      `INSERT INTO users
         (name, email, hashed_password, role, status)
       VALUES ($1, $2, $3, 'admin', 'approved')`,
      [name.trim(), email, hashed_password],
    );

    console.log("Admin account created successfully.");
  }
};

createAdmin()
  .catch((error) => {
    console.error("Failed to create admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
