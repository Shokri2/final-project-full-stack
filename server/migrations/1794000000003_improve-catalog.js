/**
 * Links crops to categories and tidies the catalog tables.
 *
 *  categories 1 ──< crops 1 ──< crop_growth_stages
 *
 *  - crops.category_id (NOT NULL, RESTRICT: a category that still has crops cannot be deleted).
 *    Existing crops without a category are put in a "General" category, which the seed later
 *    replaces with the real category of each crop.
 *  - crops.is_active: crops that have consultation requests are deactivated, not deleted.
 *  - crops.created_by / updated_by, unique crop names, search/filter indexes, timestamptz.
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  // ---- categories ----
  pgm.alterColumn("categories", "description", { type: "varchar(500)" });
  pgm.alterColumn("categories", "image", { type: "varchar(500)" });

  // ---- crops: new columns ----
  pgm.addColumns("crops", {
    category_id: { type: "integer", references: "categories", onDelete: "RESTRICT" },
    is_active: { type: "boolean", notNull: true, default: true },
    created_by: { type: "integer", references: "users", onDelete: "SET NULL" },
    updated_by: { type: "integer", references: "users", onDelete: "SET NULL" },
  });

  // Backfill: only runs when crops without a category exist (i.e. the old local database).
  pgm.sql(`
    DO $$
    DECLARE
      owner_id INTEGER;
      general_id INTEGER;
    BEGIN
      IF EXISTS (SELECT 1 FROM crops WHERE category_id IS NULL) THEN
        SELECT id INTO owner_id FROM users ORDER BY (role = 'admin') DESC, id LIMIT 1;

        INSERT INTO categories (name, description, created_by)
        VALUES ('General', 'Crops that have not been categorised yet.', owner_id)
        ON CONFLICT (name) DO NOTHING;

        SELECT id INTO general_id FROM categories WHERE name = 'General';
        UPDATE crops SET category_id = general_id WHERE category_id IS NULL;
      END IF;
    END $$;
  `);
  pgm.alterColumn("crops", "category_id", { notNull: true });

  pgm.addConstraint("crops", "crops_name_key", { unique: "name" });
  pgm.createIndex("crops", "category_id");
  pgm.createIndex("crops", "is_active");
  pgm.createIndex("crops", [{ name: "LOWER(name)" }], { name: "crops_name_lower_idx" });

  // ---- crop_growth_stages ----
  pgm.addConstraint("crop_growth_stages", "valid_stage_order", {
    check: "stage_order > 0",
  });
  // unique_crop_stage_order (crop_id, stage_order) already indexes crop_id first.
  pgm.dropIndex("crop_growth_stages", "crop_id", { name: "idx_crop_growth_stages_crop_id" });

  // ---- timestamps + triggers ----
  for (const table of ["categories", "crops"]) {
    pgm.sql(`
      UPDATE ${table} SET created_at = NOW() WHERE created_at IS NULL;
      UPDATE ${table} SET updated_at = NOW() WHERE updated_at IS NULL;
      ALTER TABLE ${table}
        ALTER COLUMN created_at TYPE timestamptz, ALTER COLUMN created_at SET NOT NULL,
        ALTER COLUMN created_at SET DEFAULT NOW(),
        ALTER COLUMN updated_at TYPE timestamptz, ALTER COLUMN updated_at SET NOT NULL,
        ALTER COLUMN updated_at SET DEFAULT NOW();

      CREATE TRIGGER ${table}_set_updated_at
      BEFORE UPDATE ON ${table}
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `);
  }
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export const down = (pgm) => {
  for (const table of ["categories", "crops"]) {
    pgm.sql(`
      DROP TRIGGER IF EXISTS ${table}_set_updated_at ON ${table};
      ALTER TABLE ${table}
        ALTER COLUMN created_at TYPE timestamp, ALTER COLUMN created_at DROP NOT NULL,
        ALTER COLUMN updated_at TYPE timestamp, ALTER COLUMN updated_at DROP NOT NULL;
    `);
  }
  pgm.createIndex("crop_growth_stages", "crop_id", { name: "idx_crop_growth_stages_crop_id" });
  pgm.dropConstraint("crop_growth_stages", "valid_stage_order");
  pgm.dropIndex("crops", [], { name: "crops_name_lower_idx" });
  pgm.dropConstraint("crops", "crops_name_key");
  pgm.dropColumns("crops", ["category_id", "is_active", "created_by", "updated_by"]);
  pgm.alterColumn("categories", "image", { type: "varchar(200)" });
  pgm.alterColumn("categories", "description", { type: "varchar(200)" });
};
