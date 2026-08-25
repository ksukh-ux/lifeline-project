import { isValidCategory } from "../constants/categories.js";

export interface EventInput {
  category?: unknown;
  title?: unknown;
  description?: unknown;
  date?: unknown;
  time?: unknown;
  significance?: unknown;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

// Zentrale Validierung für POST/PUT /api/events, gemäß D1/D2/A08.2.
export function validateEventInput(body: EventInput): string | null {
  if (!isValidCategory(body.category)) {
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
