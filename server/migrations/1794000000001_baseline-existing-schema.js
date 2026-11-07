export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      hashed_password VARCHAR(200) NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      avatar TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "phoneNumber" VARCHAR(20),
      status TEXT NOT NULL DEFAULT 'pending',
      CONSTRAINT users_role_check CHECK (role IN ('admin', 'user', 'employee')),
      CONSTRAINT users_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      description VARCHAR(200),
      created_by INTEGER NOT NULL REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER REFERENCES users(id),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      image VARCHAR(200)
    );

    CREATE TABLE IF NOT EXISTS products (
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

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      total_price NUMERIC(10,2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      shipping_address VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT orders_status_check CHECK (status IN ('pending', 'paid', 'cancelled'))
    );

    CREATE TABLE IF NOT EXISTS crops (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      name_ar VARCHAR(100) NOT NULL,
      image TEXT,
      description TEXT,
      water_needs TEXT,
      temperature_min NUMERIC(5,2),
      temperature_max NUMERIC(5,2),
      sunlight VARCHAR(100),
      soil_type VARCHAR(150),
      growth_duration_days INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT valid_growth_duration CHECK (growth_duration_days IS NULL OR growth_duration_days > 0),
      CONSTRAINT valid_temperature_range CHECK (
        temperature_min IS NULL OR temperature_max IS NULL OR temperature_min <= temperature_max
      )
    );

    CREATE TABLE IF NOT EXISTS crop_growth_stages (
      id SERIAL PRIMARY KEY,
      crop_id INTEGER NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      name_ar VARCHAR(100) NOT NULL,
      stage_order INTEGER NOT NULL,
      duration_days INTEGER,
      tips TEXT,
      CONSTRAINT unique_crop_stage_order UNIQUE (crop_id, stage_order),
      CONSTRAINT valid_stage_duration CHECK (duration_days IS NULL OR duration_days > 0)
    );
    CREATE INDEX IF NOT EXISTS idx_crop_growth_stages_crop_id ON crop_growth_stages (crop_id);

    CREATE TABLE IF NOT EXISTS refresh_token_sessions (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(64) NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ,
      replaced_by_token_hash VARCHAR(64),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS refresh_token_sessions_user_id_index ON refresh_token_sessions (user_id);
    CREATE INDEX IF NOT EXISTS refresh_token_sessions_expires_at_index ON refresh_token_sessions (expires_at);
  `);
};

export const down = false;
