/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * Create refresh token sessions.
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable("refresh_token_sessions", {
    id: {
      type: "bigserial",
      primaryKey: true,
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },

    token_hash: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    expires_at: {
      type: "timestamp with time zone",
      notNull: true,
    },

    revoked_at: {
      type: "timestamp with time zone",
      notNull: false,
    },

    replaced_by_token_hash: {
      type: "varchar(64)",
      notNull: false,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("refresh_token_sessions", "user_id");
  pgm.createIndex("refresh_token_sessions", "expires_at");
};

/**
 * Rollback the migration.
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropTable("refresh_token_sessions");
};
