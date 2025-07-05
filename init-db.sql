CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

CREATE TABLE proxy (
    id SERIAL PRIMARY KEY,
    value TEXT NOT NULL,
    status TEXT
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    group_id TEXT UNIQUE NOT NULL
);

