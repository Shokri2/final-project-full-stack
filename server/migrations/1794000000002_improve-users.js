/**
 * Improves the users table for the final project.
 *
 *  - Roles become user / agronomist / admin (the old unused 'employee' role is mapped to agronomist).
 *  - The admin-approval `status` column is replaced by:
 *        email_verified_at -> set when the user clicks the verification link
 *        is_active         -> admin can deactivate an account instead of deleting it
 *    Existing rows keep the same login behaviour:
 *        approved -> verified + active   (could log in before, still can)
 *        pending  -> not verified        (could not log in before, still cannot until verified)
 *        rejected -> deactivated
 *  - "phoneNumber" -> phone (snake_case like every other column), name up to 100 chars,
 *    timestamps become timestamptz and are kept current by a trigger.
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  // Shared trigger function: every table with updated_at uses it.
  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // ---- roles ----
  pgm.dropConstraint("users", "users_role_check");
  pgm.sql(`UPDATE users SET role = 'agronomist' WHERE role = 'employee';`);
  pgm.addConstraint("users", "users_role_check", {
    check: "role IN ('user', 'agronomist', 'admin')",
  });

  // ---- status -> is_active + email_verified_at ----
  pgm.addColumns("users", {
    is_active: { type: "boolean", notNull: true, default: true },
    email_verified_at: { type: "timestamptz" },
    last_login_at: { type: "timestamptz" },
  });
  pgm.sql(`
    UPDATE users SET email_verified_at = COALESCE(created_at, NOW()) WHERE status = 'approved';
    UPDATE users SET is_active = FALSE WHERE status = 'rejected';
  `);
  pgm.dropConstraint("users", "users_status_check");
  pgm.dropColumn("users", "status");

  // ---- columns ----
  pgm.renameColumn("users", "phoneNumber", "phone");
  pgm.alterColumn("users", "name", { type: "varchar(100)" });
  pgm.sql(`UPDATE users SET email = LOWER(email) WHERE email <> LOWER(email);`);
  pgm.addConstraint("users", "users_email_lowercase_check", {
    check: "email = LOWER(email)",
  });

  // ---- timestamps ----
  pgm.sql(`
    UPDATE users SET created_at = NOW() WHERE created_at IS NULL;
    UPDATE users SET updated_at = NOW() WHERE updated_at IS NULL;
    ALTER TABLE users
      ALTER COLUMN created_at TYPE timestamptz, ALTER COLUMN created_at SET NOT NULL,
      ALTER COLUMN created_at SET DEFAULT NOW(),
      ALTER COLUMN updated_at TYPE timestamptz, ALTER COLUMN updated_at SET NOT NULL,
      ALTER COLUMN updated_at SET DEFAULT NOW();

    CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);

  pgm.createIndex("users", "role");
  pgm.createIndex("users", "created_at");
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export const down = (pgm) => {
  pgm.dropIndex("users", "created_at");
  pgm.dropIndex("users", "role");
  pgm.sql(`
    DROP TRIGGER IF EXISTS users_set_updated_at ON users;
    ALTER TABLE users
      ALTER COLUMN created_at TYPE timestamp, ALTER COLUMN created_at DROP NOT NULL,
      ALTER COLUMN updated_at TYPE timestamp, ALTER COLUMN updated_at DROP NOT NULL;
  `);
  pgm.dropConstraint("users", "users_email_lowercase_check");
  pgm.alterColumn("users", "name", { type: "varchar(30)" });
  pgm.renameColumn("users", "phone", "phoneNumber");

  pgm.addColumn("users", { status: { type: "text", notNull: true, default: "pending" } });
  pgm.sql(`
    UPDATE users SET status = CASE
      WHEN NOT is_active THEN 'rejected'
      WHEN email_verified_at IS NOT NULL THEN 'approved'
      ELSE 'pending' END;
  `);
  pgm.addConstraint("users", "users_status_check", {
    check: "status IN ('pending', 'approved', 'rejected')",
  });
  pgm.dropColumns("users", ["is_active", "email_verified_at", "last_login_at"]);

  pgm.dropConstraint("users", "users_role_check");
  pgm.sql(`UPDATE users SET role = 'employee' WHERE role = 'agronomist';`);
  pgm.addConstraint("users", "users_role_check", {
    check: "role IN ('admin', 'user', 'employee')",
  });
  pgm.sql("DROP FUNCTION IF EXISTS set_updated_at();");
};
