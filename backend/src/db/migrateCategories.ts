import type { DatabaseSync } from "node:sqlite";
import { DEFAULT_CATEGORIES } from "../constants/categories.js";

// Bildet die alten, fest codierten Kategorie-Schlüssel (vor dieser Änderung)
// auf die neuen Anzeigenamen ab, damit bestehende Events beim Umstellen der
// richtigen neuen Kategorie-Zeile zugeordnet werden können.
const LEGACY_KEY_TO_LABEL: Record<string, string> = {
  meilenstein: "Meilenstein",
  karriere: "Karriere",
  bildung: "Bildung",
  beziehung: "Beziehung",
  reise: "Reise",
  gesundheit: "Gesundheit",
  sonstiges: "Sonstiges",
};

// Deckt mehrere historische Fassungen der `events`-Tabelle ab, nicht nur die
// unmittelbar vor der category_id-Umstellung (Commit 64942ef):
// - vor Commit 7ce58c3 gab es statt `date`/`time` die Felder `start_date`,
//   `end_date`, `location` und `tags` (Einzeltermin-Umstellung).
// - vor Commit 69dd067 gab es noch kein `image_path` (Bild-Upload-Feature).
// `SELECT *` liefert für nicht (mehr) existierende Spalten schlicht keinen
// Schlüssel im Ergebnis-Objekt, daher sind hier alle Felder, die nicht seit
// der allerersten Fassung existieren, optional.
interface LegacyEventRow {
  id: number;
  user_id: number;
  category: string;
  title: string;
  description: string | null;
  date?: string;
  time?: string | null;
  start_date?: string;
  end_date?: string;
  location?: string | null;
  tags?: string | null;
  significance: number | null;
  image_path?: string | null;
  created_at: string;
}

// Ermittelt das Datum für ein Alt-Event unabhängig davon, ob die Tabelle
// schon die heutige Einzeldatum-Spalte `date` hat oder noch die ältere
// Start-/End-Datum-Fassung (vor Commit 7ce58c3) — dort dient `start_date`
// als das neue `date`, da das neue Schema keinen Zeitraum mehr kennt.
function resolveLegacyDate(ev: LegacyEventRow): string {
  const date = ev.date ?? ev.start_date;
  if (!date) {
    throw new Error(
      `Migration: Event ${ev.id} hat weder eine "date"- noch eine "start_date"-Spalte — unbekanntes Alt-Schema, Migration abgebrochen, um keine Daten zu verlieren.`,
    );
  }
  return date;
}

// Felder aus noch älteren Schema-Fassungen (`location`, `tags`, ein vom
// Einzeldatum abweichendes `end_date`), für die es im heutigen Schema keine
// eigene Spalte mehr gibt, gehen NICHT verloren, sondern werden — damit
// bestehende Daten erhalten bleiben — lesbar an die Beschreibung angehängt.
function resolveLegacyDescription(ev: LegacyEventRow): string | null {
  const parts: string[] = [];
  if (ev.description) {
    parts.push(ev.description);
  }
  const date = resolveLegacyDate(ev);
  if (ev.end_date && ev.end_date !== date) {
    parts.push(`Ursprünglicher Zeitraum: ${date} bis ${ev.end_date}`);
  }
  if (ev.location) {
    parts.push(`Ort: ${ev.location}`);
  }
  if (ev.tags) {
    parts.push(`Tags: ${ev.tags}`);
  }
  return parts.length > 0 ? parts.join("\n\n") : null;
}

function seedDefaultCategoriesForUser(db: DatabaseSync, userId: number): Map<string, number> {
  const map = new Map<string, number>();
  const insert = db.prepare("INSERT INTO categories (user_id, label, color) VALUES (?, ?, ?)");
  for (const def of DEFAULT_CATEGORIES) {
    const result = insert.run(userId, def.label, def.color);
    map.set(def.label, Number(result.lastInsertRowid));
  }
  return map;
}

// Behebt einen Fehler in einer früheren Fassung dieser Migration: Beim
// Neuaufbau von `events` fehlte der Standardwert (`DEFAULT`) für
// `created_at`, wodurch das Anlegen neuer Events mit
// "NOT NULL constraint failed: events.created_at" fehlschlug, sobald eine
// Installation den Umstellungs-Schritt oben bereits einmal durchlaufen hatte.
// Baut die Tabelle nötigenfalls ein zweites Mal um, diesmal mit korrektem
// Standardwert; wirkt sich nicht aus, wenn der Standardwert schon passt
// (frische Installationen, oder nachdem dieser Schritt schon einmal lief).
function repairEventsCreatedAtDefault(db: DatabaseSync): void {
  const columns = db.prepare("PRAGMA table_info(events)").all() as {
    name: string;
    dflt_value: string | null;
  }[];
  const createdAtColumn = columns.find((col) => col.name === "created_at");

  if (!createdAtColumn || createdAtColumn.dflt_value != null) {
    return;
  }

  db.exec("BEGIN");
  try {
    db.exec(`
      CREATE TABLE events_fixed (
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
    `);
    db.exec(`
      INSERT INTO events_fixed
        (id, user_id, category_id, title, description, date, time, significance, image_path, created_at)
      SELECT id, user_id, category_id, title, description, date, time, significance, image_path, created_at
      FROM events;
    `);
    db.exec("DROP TABLE events;");
    db.exec("ALTER TABLE events_fixed RENAME TO events;");
    db.exec("CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);");
    db.exec("COMMIT");
    console.log("Migration: fehlenden Standardwert für events.created_at nachgetragen.");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

// Wird bei jedem Serverstart nach applySchema() aufgerufen (siehe server.ts,
// db/migrate.ts). Drei voneinander unabhängige, jeweils für sich
// wiederholbare Schritte:
//
// 1. Jede Person ohne eigene Kategorien bekommt die sieben Standardkategorien
//    angelegt (deckt sowohl gerade migrierte als auch — zur Sicherheit —
//    versehentlich leere Konten ab).
// 2. Falls die `events`-Tabelle noch die alte Spalte `category` (Text,
//    feste Werteliste) hat: auf `category_id` umstellen. Klassischer
//    SQLite-Umbau (neue Tabelle, Daten kopieren, alte ersetzen), damit das
//    unabhängig von der genutzten SQLite-Version funktioniert.
// 3. Reparatur eines fehlenden DEFAULT-Werts auf `created_at`, siehe
//    repairEventsCreatedAtDefault() oben.
export function runDataMigrations(db: DatabaseSync): void {
  const categoryMapsByUser = new Map<number, Map<string, number>>();

  const usersWithoutCategories = db
    .prepare(
      `SELECT id FROM users WHERE id NOT IN (SELECT DISTINCT user_id FROM categories)`,
    )
    .all() as { id: number }[];

  for (const user of usersWithoutCategories) {
    categoryMapsByUser.set(user.id, seedDefaultCategoriesForUser(db, user.id));
  }

  const eventsColumns = db.prepare("PRAGMA table_info(events)").all() as { name: string }[];
  const hasLegacyCategoryColumn = eventsColumns.some((col) => col.name === "category");

  if (!hasLegacyCategoryColumn) {
    repairEventsCreatedAtDefault(db);
    return;
  }

  const getCategoryIdFor = (userId: number, legacyKey: string): number => {
    let map = categoryMapsByUser.get(userId);
    if (!map) {
      const rows = db
        .prepare("SELECT id, label FROM categories WHERE user_id = ?")
        .all(userId) as { id: number; label: string }[];
      map = new Map(rows.map((row) => [row.label, row.id]));
      categoryMapsByUser.set(userId, map);
    }
    const label = LEGACY_KEY_TO_LABEL[legacyKey] ?? "Sonstiges";
    return map.get(label) ?? map.get("Sonstiges") ?? [...map.values()][0];
  };

  db.exec("BEGIN");
  try {
    db.exec(`
      CREATE TABLE events_new (
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
    `);

    const legacyEvents = db.prepare("SELECT * FROM events").all() as unknown as LegacyEventRow[];

    const insertNew = db.prepare(
      `INSERT INTO events_new
       (id, user_id, category_id, title, description, date, time, significance, image_path, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    for (const ev of legacyEvents) {
      insertNew.run(
        ev.id,
        ev.user_id,
        getCategoryIdFor(ev.user_id, ev.category),
        ev.title,
        resolveLegacyDescription(ev),
        resolveLegacyDate(ev),
        ev.time ?? null,
        ev.significance,
        ev.image_path ?? null,
        ev.created_at,
      );
    }

    db.exec("DROP TABLE events;");
    db.exec("ALTER TABLE events_new RENAME TO events;");
    db.exec("CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);");
    db.exec("COMMIT");

    console.log(
      `Migration: ${legacyEvents.length} bestehende(s) Event(s) auf category_id umgestellt (Kategorie ist jetzt eine eigene Entität, siehe N1 NFR-14c-01).`,
    );
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
