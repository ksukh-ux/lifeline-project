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
const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 2000;

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidTime(value: string): boolean {
  if (!TIME_PATTERN.test(value)) return false;
  const [hours, minutes] = value.split(":").map(Number);
  return hours <= 23 && minutes <= 59;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Zentrale Validierung für POST/PUT /api/events, gemäß D1/D2/A08.1.
// Die Meldungen werden direkt in der Oberfläche angezeigt und enthalten
// deshalb keine Feldnamen oder Formatangaben aus dem Code (NFR-11c-01).
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
    return "Bitte gib einen Titel ein.";
  }
  if (body.title.trim().length > MAX_TITLE_LENGTH) {
    return `Der Titel darf höchstens ${MAX_TITLE_LENGTH} Zeichen lang sein.`;
  }
  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== "string") {
      return "Die Beschreibung ist ungültig.";
    }
    if (body.description.length > MAX_DESCRIPTION_LENGTH) {
      return `Die Beschreibung darf höchstens ${MAX_DESCRIPTION_LENGTH} Zeichen lang sein.`;
    }
  }
  if (typeof body.date !== "string" || !isValidDate(body.date)) {
    return "Bitte gib ein gültiges Datum ein.";
  }
  if (body.time !== undefined && body.time !== null && body.time !== "") {
    if (typeof body.time !== "string" || !isValidTime(body.time)) {
      return "Bitte gib eine gültige Uhrzeit ein.";
    }
  }
  if (body.significance !== undefined && body.significance !== null) {
    // D2.2: ganzzahliger Wertebereich 0–100.
    const significance = body.significance;
    if (
      typeof significance !== "number" ||
      !Number.isInteger(significance) ||
      significance < 0 ||
      significance > 100
    ) {
      return "Die Bedeutung muss eine ganze Zahl zwischen 0 und 100 sein.";
    }
  }
  return null;
}
