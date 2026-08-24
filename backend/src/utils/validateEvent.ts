import { isValidCategory } from "../constants/categories.js";

export interface EventInput {
  category?: unknown;
  title?: unknown;
  description?: unknown;
  start_date?: unknown;
  end_date?: unknown;
  location?: unknown;
  tags?: unknown;
  significance?: unknown;
}

// Zentrale Validierung für POST/PUT /api/events, gemäß D1/D2/A08.2 und der
// Regel end_date >= start_date aus N2.2 / UC-01.
export function validateEventInput(body: EventInput): string | null {
  if (!isValidCategory(body.category)) {
    return "Ungültige Kategorie.";
  }
  if (typeof body.title !== "string" || body.title.trim().length === 0) {
    return "Titel ist erforderlich.";
  }
  if (typeof body.start_date !== "string" || typeof body.end_date !== "string") {
    return "start_date und end_date sind erforderlich (Format: YYYY-MM-DD).";
  }
  if (body.end_date < body.start_date) {
    return "end_date darf nicht vor start_date liegen.";
  }
  if (body.significance !== undefined && body.significance !== null) {
    const significance = Number(body.significance);
    if (Number.isNaN(significance) || significance < 0 || significance > 100) {
      return "significance muss eine Zahl zwischen 0 und 100 sein.";
    }
  }
  return null;
}
