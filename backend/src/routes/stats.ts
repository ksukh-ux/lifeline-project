import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const statsRouter = Router();

statsRouter.use(requireAuth);

// GET /api/stats — aggregierte Auswertung der eigenen Einträge nach
// Kategorie (Anzahl + durchschnittliche Bedeutung), siehe P1 §6 / F1-F3.
statsRouter.get("/", (req, res) => {
  const rows = db
    .prepare(
      `SELECT category, COUNT(*) AS count, AVG(significance) AS avg_significance
       FROM events WHERE user_id = ? GROUP BY category`
    )
    .all(req.userId);
  res.json(rows);
});
