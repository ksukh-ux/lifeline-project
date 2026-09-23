import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const statsRouter = Router();

statsRouter.use(requireAuth);

// GET /api/stats — aggregierte Auswertung der eigenen Einträge.
statsRouter.get("/", (req, res) => {
  const summary = db
    .prepare(
      `SELECT COUNT(*) AS total_count,
              MIN(date) AS oldest_date,
              MAX(date) AS newest_date
       FROM events
       WHERE user_id = ?`
    )
    .get(req.userId!) as {
      total_count: number;
      oldest_date: string | null;
      newest_date: string | null;
    };

  const categories = db
    .prepare(
      `SELECT c.id AS category_id, c.label AS category_label, c.color AS category_color,
              COUNT(*) AS count, AVG(e.significance) AS avg_significance
       FROM events e
       JOIN categories c ON c.id = e.category_id
       WHERE e.user_id = ?
       GROUP BY c.id`
    )
    .all(req.userId!);
  const spanDays = summary.oldest_date && summary.newest_date
    ? Math.round(
        (Date.parse(summary.newest_date) - Date.parse(summary.oldest_date)) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  res.json({
    totalCount: summary.total_count,
    oldestDate: summary.oldest_date,
    newestDate: summary.newest_date,
    spanDays,
    categories,
  });
});
