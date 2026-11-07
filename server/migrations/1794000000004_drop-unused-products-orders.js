/**
 * The final project focuses on crops + consultation requests, so the unused
 * midterm `products` and `orders` tables are removed.
 * Safety: the migration stops if either table still contains data.
 *
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.sql(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM products) OR EXISTS (SELECT 1 FROM orders) THEN
        RAISE EXCEPTION 'products/orders still contain data; move it before dropping these tables.';
      END IF;
    END $$;
  `);
  pgm.dropTable("orders");
  pgm.dropTable("products");
};

/** Recreates both tables exactly as they were in the baseline. */
export const down = (pgm) => {
  pgm.sql(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      description VARCHAR(200),
      price INTEGER,
      stock INTEGER,
      image VARCHAR(200),
      catid INTEGER NOT NULL REFERENCES categories(id),
      created_by INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER REFERENCES users(id),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status TEXT NOT NULL DEFAULT 'pending',
      CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected'))
    );
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total_price NUMERIC(10,2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      shipping_address VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'cancelled'))
    );
  `);
};
