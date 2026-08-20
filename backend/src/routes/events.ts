import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateEventInput } from "../utils/validateEvent.js";

export const eventsRouter = Router();

// Alle Event-Routen setzen eine angemeldete Person voraus; jede Abfrage ist
// zusätzlich auf req.userId eingeschränkt, sodass niemand fremde Einträge
// sehen oder verändern kann (siehe N2, "jede Person sieht nur eigene Einträge").
eventsRouter.use(requireAuth);

// GET /api/events — alle Einträge der angemeldeten Person.
eventsRouter.get("/", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM events WHERE user_id = ? ORDER BY start_date DESC")
    .all(req.userId);
  res.json(rows);
});

// GET /api/events/:id — ein einzelner Eintrag.
eventsRouter.get("/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM events WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);

  if (!row) {
    res.status(404).json({ error: "Ereignis nicht gefunden." });
    return;
  }
  res.json(row);
});

// POST /api/events — neuen Eintrag anlegen.
eventsRouter.post("/", (req, res) => {
  const body = req.body ?? {};
  const validationError = validateEventInput(body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const result = db
    .prepare(
      `INSERT INTO events (user_id, category, title, description, start_date, end_date, location, tags, significance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.userId,
      body.category,
      body.title,
      body.description ?? null,
      body.start_date,
      body.end_date,
      body.location ?? null,
      body.tags ?? null,
      body.significance ?? null
    );

  const created = db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/events/:id — bestehenden Eintrag ändern.
eventsRouter.put("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT id FROM events WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);

  if (!existing) {
    res.status(404).json({ error: "Ereignis nicht gefunden." });
    return;
  }

  const body = req.body ?? {};
  const validationError = validateEventInput(body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  db.prepare(
    `UPDATE events SET category = ?, title = ?, description = ?, start_date = ?, end_date = ?, location = ?, tags = ?, significance = ?
     WHERE id = ? AND user_id = ?`
  ).run(
    body.category,
    body.title,
    body.description ?? null,
    body.start_date,
    body.end_date,
    body.location ?? null,
    body.tags ?? null,
    body.significance ?? null,
    req.params.id,
    req.userId
  );

  const updated = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/events/:id — Eintrag löschen.
eventsRouter.delete("/:id", (req, res) => {
  const result = db
    .prepare("DELETE FROM events WHERE id = ? AND user_id = ?")
    .run(req.params.id, req.userId);

  if (result.changes === 0) {
    res.status(404).json({ error: "Ereignis nicht gefunden." });
    return;
  }
  res.status(204).send();
});
