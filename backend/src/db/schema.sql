-- Lifeline database schema
-- Must stay in sync with docs/spec/D1-datenmodell.md, docs/spec/D2-datentypenverzeichnis.md
-- and docs/arch/A08-Querschnittskonzepte.md (8.1 Datenmodell und Persistenz).

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category     TEXT NOT NULL CHECK (category IN
                 ('meilenstein', 'karriere', 'bildung', 'beziehung', 'reise', 'gesundheit', 'sonstiges')),
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

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
