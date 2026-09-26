
---------------table1 
create table user(
id,fname,lname, email, role, createdat, updatedat, hashed_password, avatar
)
---------------table2
CREATE TABLE categories (
    id serial primary key,
    name varchar(100) not null unique,
    description varchar(200),
    -- created_by integer NOT NULL REFERENCES users(id),
    created_by integer NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
---------------table3
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    description VARCHAR(200),
    price INTEGER,
    stock INTEGER,
    image VARCHAR(200),
    catId INTEGER NOT NULL,
    FOREIGN KEY (catId) REFERENCES categories(id),
    created_by INTEGER NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    FOREIGN KEY (updated_by) REFERENCES users(id),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT status_check CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))
);