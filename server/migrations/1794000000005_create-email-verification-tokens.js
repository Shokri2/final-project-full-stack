export const up = (pgm) => {
  pgm.createTable("email_verification_tokens", {
    id: "id",
    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    token_hash: { type: "varchar(64)", notNull: true, unique: true },
    expires_at: { type: "timestamptz", notNull: true },
    used_at: { type: "timestamptz" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });
  pgm.createIndex("email_verification_tokens", "user_id");
};

export const down = (pgm) => {
  pgm.dropTable("email_verification_tokens");
};
