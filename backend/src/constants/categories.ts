// Startkategorien: Werden jeder neuen Person bei der Registrierung angelegt
// (siehe routes/auth.ts) und beim einmaligen Umstellen bestehender
// Installationen verwendet (siehe db/migrateCategories.ts).
//
// Das ist bewusst nur eine Vorbelegung, keine feste Liste mehr: Kategorie ist
// jetzt eine eigene Datenbank-Entität (Tabelle `categories`, siehe
// docs/spec/D1-datenmodell.md, D1.3). Nutzer:innen legen eigene Kategorien
// über POST /api/categories an, ganz ohne Code-Änderung — siehe N1,
// NFR-14c-01 "Erweiterbarkeit der Kategorien".
export const DEFAULT_CATEGORIES: { label: string; color: string }[] = [
  { label: "Meilenstein", color: "#38BDF8" },
  { label: "Karriere", color: "#FB923C" },
  { label: "Bildung", color: "#8B5CF6" },
  { label: "Beziehung", color: "#EC4899" },
  { label: "Reise", color: "#14B8A6" },
  { label: "Gesundheit", color: "#F43F5E" },
  { label: "Sonstiges", color: "#94A3B8" },
];

const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

export function isValidColor(value: unknown): value is string {
  return typeof value === "string" && COLOR_PATTERN.test(value);
}

export function isValidLabel(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= 40;
}
