/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  
    pgm.createTable("orders", {
      id: "id",
      user_id: {
        type: "integer",
        notNull: true,
        references: "users",
        onDelete: "CASCADE",
      },
      total_price: {
        type: "numeric(10, 2)",
        notNull: true,
      },
      status: {
        type: "varchar(20)",
        notNull: true,
        default: "pending",
        check: "status IN ('pending', 'paid', 'cancelled')",
      },
      shipping_address: {
        type: "varchar(255)",
        notNull: true,
      },
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("CURRENT_TIMESTAMP"),
      },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable("orders");
};
