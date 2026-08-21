import { Router } from "express";
import { db } from "../db/index.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateEventInput } from "../utils/validateEvent.js";
import { deleteImage, parseDataUri, saveImage } from "../utils/image.js";

export const eventsRouter = Router();

interface EventRow {
  id: number;
  user_id: number;
  category: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  tags: string | null;
  significance: number | null;
  image_path: string | null;
  created_at: string;
}

const IMAGE_ERROR = "Ungültiges Bildformat (erlaubt: JPEG, PNG, WEBP, max. 5 MB).";

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

// POST /api/events — neuen Eintrag anlegen. Optionales Feld "image": ein
// Base64-Data-URI-String (z. B. "data:image/png;base64,..."), wird als
// Datei unter backend/uploads/ gespeichert; in der DB steht nur der Pfad.
eventsRouter.post("/", (req, res) => {
  const body = req.body ?? {};
  const validationError = validateEventInput(body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  let imagePath: string | null = null;
  if (body.image !== undefined && body.image !== null) {
    if (typeof body.image !== "string") {
      res.status(400).json({ error: IMAGE_ERROR });
      return;
    }
    const parsed = parseDataUri(body.image);
    if (!parsed) {
      res.status(400).json({ error: IMAGE_ERROR });
      return;
    }
    imagePath = saveImage(parsed);
  }

  const result = db
    .prepare(
      `INSERT INTO events (user_id, category, title, description, start_date, end_date, location, tags, significance, image_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      body.significance ?? null,
      imagePath
    );

  const created = db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/events/:id — bestehenden Eintrag ändern. Das Feld "image" ist
// optional: fehlt es im Body, bleibt das vorhandene Bild unverändert; ist es
// explizit null, wird ein vorhandenes Bild entfernt; ist es ein neuer
// Data-URI-String, ersetzt es das vorhandene Bild (altes wird gelöscht).
eventsRouter.put("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT * FROM events WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId) as EventRow | undefined;

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

  let imagePath = existing.image_path;
  if (body.image !== undefined) {
    if (body.image === null) {
      deleteImage(existing.image_path);
      imagePath = null;
    } else if (typeof body.image === "string") {
      const parsed = parseDataUri(body.image);
      if (!parsed) {
        res.status(400).json({ error: IMAGE_ERROR });
        return;
      }
      deleteImage(existing.image_path);
      imagePath = saveImage(parsed);
    } else {
      res.status(400).json({ error: IMAGE_ERROR });
      return;
    }
  }

  db.prepare(
    `UPDATE events SET category = ?, title = ?, description = ?, start_date = ?, end_date = ?, location = ?, tags = ?, significance = ?, image_path = ?
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
    imagePath,
    req.params.id,
    req.userId
  );

  const updated = db.prepare("SELECT * FROM events WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/events/:id — Eintrag löschen (inkl. zugehöriger Bilddatei).
eventsRouter.delete("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT image_path FROM events WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId) as { image_path: string | null } | undefined;

  if (!existing) {
    res.status(404).json({ error: "Ereignis nicht gefunden." });
    return;
  }

  db.prepare("DELETE FROM events WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  deleteImage(existing.image_path);
  res.status(204).send();
});
