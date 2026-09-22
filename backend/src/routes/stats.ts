import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const statsRouter = Router();

statsRouter.use(requireAuth);

// GET /api/stats — aggregierte Auswertung der eigenen Einträge nach
// Kategorie (Anzahl + durchschnittliche Bedeutung), siehe P1 §6 / F1-F3.
// Kategorie ist eine eigene Entität (siehe D1.3) — hier per JOIN aufgelöst,
// damit die Antwort weiterhin Name und Farbe der Kategorie enthält.
statsRouter.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id AS category_id, c.label AS category_label, c.color AS category_color,
              COUNT(*) AS count, AVG(e.significance) AS avg_significance
       FROM events e
       JOIN categories c ON c.id = e.category_id
       WHERE e.user_id = ?
       GROUP BY c.id`
    )
    .all(req.userId!);
  res.json(rows);
});
