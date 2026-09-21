export interface EventInput {
  category_id?: unknown;
  title?: unknown;
  description?: unknown;
  date?: unknown;
  time?: unknown;
  significance?: unknown;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Zentrale Validierung für POST/PUT /api/events, gemäß D1/D2/A08.2.
//
// Prüft hier nur die Form von category_id (positive Ganzzahl) — ob die ID
// wirklich zu einer Kategorie der angemeldeten Person gehört, wird in
// routes/events.ts geprüft (dort ist req.userId bekannt; category_id ist
// jetzt ein Fremdschlüssel auf die eigene Entität `categories`, siehe D1.3
// und N1 NFR-14c-01, nicht mehr eine feste Werteliste).
export function validateEventInput(body: EventInput): string | null {
  if (!isPositiveInteger(body.category_id)) {
    return "Ungültige Kategorie.";
  }
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return "Titel ist erforderlich.";
  }
  if (typeof body.date !== "string" || !DATE_PATTERN.test(body.date)) {
    return "date ist erforderlich (Format: YYYY-MM-DD).";
  }
  if (body.time !== undefined && body.time !== null) {
    if (typeof body.time !== "string" || !TIME_PATTERN.test(body.time)) {
      return "time muss im Format HH:MM angegeben werden.";
    }
  }
  if (body.significance !== undefined && body.significance !== null) {
    const significance = Number(body.significance);
    if (Number.isNaN(significance) || significance < 0 || significance > 100) {
      return "significance muss eine Zahl zwischen 0 und 100 sein.";
    }
  }
  return null;
}
