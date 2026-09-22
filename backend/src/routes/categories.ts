import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isValidColor, isValidLabel } from "../constants/categories.js";

export const categoriesRouter = Router();

interface CategoryRow {
  id: number;
  user_id: number;
  label: string;
  color: string;
  created_at: string;
}

// Alle Kategorie-Routen setzen eine angemeldete Person voraus; jede Abfrage
// ist zusätzlich auf req.userId eingeschränkt (siehe N2, "jede Person sieht
// nur eigene Einträge") — Kategorien sind genau wie Events pro Person.
categoriesRouter.use(requireAuth);

// GET /api/categories — alle Kategorien der angemeldeten Person.
categoriesRouter.get("/", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY id ASC")
    .all(req.userId!);
  res.json(rows);
});

// POST /api/categories — neue Kategorie anlegen (siehe N1, NFR-14c-01
// "Erweiterbarkeit der Kategorien"): läuft komplett über die Oberfläche,
// ohne Code-Änderung oder Neu-Deployment.
categoriesRouter.post("/", (req, res) => {
  const body = req.body ?? {};

  if (!isValidLabel(body.label)) {
    res.status(422).json({ error: "Name ist erforderlich (max. 40 Zeichen)." });
    return;
  }
  if (!isValidColor(body.color)) {
    res.status(422).json({ error: "Farbe muss ein Hex-Code sein, z. B. #38BDF8." });
    return;
  }

  const label = (body.label as string).trim();

  const existing = db
    .prepare("SELECT id FROM categories WHERE user_id = ? AND label = ?")
    .get(req.userId!, label);
  if (existing) {
    res.status(409).json({ error: "Eine Kategorie mit diesem Namen existiert bereits." });
    return;
  }

  const result = db
    .prepare("INSERT INTO categories (user_id, label, color) VALUES (?, ?, ?)")
    .run(req.userId!, label, body.color);

  const created = db
    .prepare("SELECT * FROM categories WHERE id = ?")
    .get(result.lastInsertRowid) as unknown as CategoryRow;
  res.status(201).json(created);
});
