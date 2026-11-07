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
  pgm.createIndex("agronomist_specialties", "category_id");
};

export const down = (pgm) => {
  pgm.dropTable("agronomist_specialties");
};
