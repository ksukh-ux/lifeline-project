-- Lifeline database schema
-- Must stay in sync with docs/spec/D1-datenmodell.md, docs/spec/D2-datentypenverzeichnis.md
-- and docs/arch/A08-Querschnittskonzepte.md (8.1 Datenmodell und Persistenz).
--
-- Kategorien sind eine eigene Entität (siehe D1.3 / N1 NFR-14c-01
-- "Erweiterbarkeit der Kategorien"): jede Person verwaltet ihre eigene Liste,
-- kann neue Kategorien über POST /api/categories anlegen, ohne dass dafür
-- Code geändert oder neu deployed werden muss. Bestehende Installationen mit
-- der alten, fest codierten Kategorie-Liste werden beim Serverstart einmalig
-- automatisch umgestellt (siehe db/migrateCategories.ts).

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  color      TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, label)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id  INTEGER NOT NULL REFERENCES categories(id),
  title        TEXT NOT NULL,
  description  TEXT,
  date         TEXT NOT NULL,
  time         TEXT,
  significance INTEGER CHECK (significance BETWEEN 0 AND 100),
  image_path   TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
