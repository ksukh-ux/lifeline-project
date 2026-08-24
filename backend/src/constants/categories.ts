// Zentrale, einzige Quelle für die zulässigen Kategorie-Werte.
// Wird sowohl von der Validierung (routes/events.ts) als auch indirekt vom
// Datenbank-Schema (schema.sql CHECK-Constraint) referenziert.
// Siehe docs/spec N1.3 (Umsetzungshinweis) und docs/arch A08.2 ("Erweiterbarkeit der Kategorien").
export const CATEGORIES = [
  "meilenstein",
  "karriere",
  "bildung",
  "beziehung",
  "reise",
  "gesundheit",
  "sonstiges",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isValidCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
