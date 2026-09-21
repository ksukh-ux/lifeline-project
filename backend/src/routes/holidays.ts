import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

// S1.3 NB-02 — Feiertagsdienst: speicherfreie Anreicherung der Timeline mit
// gesetzlichen Feiertagen. Der Ländercode ist fest aus der Hostkonfiguration
// (S1.1: "Fester Ländercode aus der Hostkonfiguration"), keine Nutzereingabe.
const HOLIDAY_COUNTRY = process.env.HOLIDAY_COUNTRY ?? "DE";

// Öffentliche, schlüssellose API (siehe CON-3g-01 in P1-constraints.md und
// die Auswahlbegründung in docs/OFFENE-PUNKTE.md, OP-04).
const HOLIDAY_API_BASE = "https://date.nager.at/api/v3/PublicHolidays";

export interface Holiday {
  date: string;
  name: string;
}

interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
}

// Ergebnis wird für die Laufzeit des Backend-Prozesses je Land und Jahr
// zwischengespeichert (S1.3.1: "wird ... zwischengespeichert, um
// wiederholte Aufrufe zu vermeiden"). Kein Scheduler, kein Hintergrund-
// Refresh nötig — Feiertage eines vergangenen oder laufenden Jahres ändern
// sich nicht (CON-3b-02).
const cache = new Map<string, Holiday[]>();

// S1.3.2 Bindende Regel: der Ausfall dieses Nachbarsystems darf niemals eine
// Anfrage der Nutzer:in zum Scheitern bringen. "Nicht erreichbar, langsame
// Antwort, ungültige Daten und unbekanntes Jahr/Land werden alle wie 'keine
// Feiertage für diesen Zeitraum' behandelt" (S1.3.1) — deshalb wirft diese
// Funktion nie, sondern liefert im Fehlerfall stets eine leere Liste.
async function getHolidays(country: string, year: number): Promise<Holiday[]> {
  const cacheKey = `${country}:${year}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(`${HOLIDAY_API_BASE}/${year}/${country}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      return [];
    }

    const raw = (await response.json()) as unknown;
    if (!Array.isArray(raw)) {
      return [];
    }

    const holidays: Holiday[] = raw
      .filter(
        (entry): entry is NagerHoliday =>
          !!entry &&
          typeof entry === "object" &&
          typeof (entry as NagerHoliday).date === "string",
      )
      .map((entry) => ({
        date: entry.date,
        name: entry.localName || entry.name || "Feiertag",
      }));

    cache.set(cacheKey, holidays);
    return holidays;
  } catch {
    // Nicht erreichbar, Timeout oder ungültige Antwort — siehe S1.3.1.
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export const holidaysRouter = Router();

// Alle Routen dieses Bausteins laufen über NB-01 (Browser -> Lifeline) und
// setzen daher wie jede andere eigene Route eine gültige Session voraus.
// Das ist unabhängig von NB-02 (Lifeline -> Feiertagsdienst), das S1.1
// beschreibt.
holidaysRouter.use(requireAuth);

// GET /api/holidays?year=YYYY — liefert die gesetzlichen Feiertage des
// angegebenen Jahres für den konfigurierten Ländercode. Antwortet
// grundsätzlich mit 200 und ggf. leerer Liste (siehe getHolidays oben);
// ein 422 entsteht ausschließlich bei einem fachlich sinnlosen `year`-Wert
// von der Nutzer:innen-Seite (NB-01), nicht bei einem Problem mit NB-02.
holidaysRouter.get("/", async (req, res) => {
  const yearParam = req.query.year;
  const year = Number(yearParam);

  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    res.status(422).json({ error: "Ungültiges Jahr." });
    return;
  }

  const holidays = await getHolidays(HOLIDAY_COUNTRY, year);
  res.json(holidays);
});
