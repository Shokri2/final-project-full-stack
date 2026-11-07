/**
 * Many-to-many: agronomists <-> categories they specialise in.
 * When assigning a consultation request, the admin is offered only agronomists
 * who specialise in the requested crop's category.
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable("agronomist_specialties", {
    agronomist_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    category_id: {
      type: "integer",
      notNull: true,
      references: "categories",
      onDelete: "CASCADE",
    },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });

  pgm.addConstraint("agronomist_specialties", "agronomist_specialties_pkey", {
    primaryKey: ["agronomist_id", "category_id"],
  });
  // The primary key covers lookups by agronomist; this one covers lookups by category.
  pgm.createIndex("agronomist_specialties", "category_id");
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
export const down = (pgm) => {
  pgm.dropTable("agronomist_specialties");
};
