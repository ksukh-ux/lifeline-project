-- Lifeline database schema
-- Categories are stored as data and are no longer hardcoded.

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  label         TEXT NOT NULL UNIQUE,
  color         TEXT NOT NULL,
  is_default    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   INTEGER NOT NULL REFERENCES categories(id),
  title        TEXT NOT NULL,
  description  TEXT,
  start_date   TEXT NOT NULL,
  end_date     TEXT NOT NULL CHECK (end_date >= start_date),
  location     TEXT,
  tags         TEXT,
  significance INTEGER CHECK (significance BETWEEN 0 AND 100),
  image_path   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_user_id
  ON events(user_id);

CREATE INDEX IF NOT EXISTS idx_events_category_id
  ON events(category_id);
