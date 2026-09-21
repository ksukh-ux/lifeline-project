import { Router } from "express";
import { db } from "../db/index.js";
import { DEFAULT_CATEGORIES } from "../constants/categories.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { createSession, destroySession } from "../middleware/session.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

export const authRouter = Router();

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

// POST /api/auth/register — legt ein neues Benutzerkonto an (siehe UC-Registrierung, F1).
authRouter.post("/register", (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || !email.includes("@") || typeof password !== "string" || password.length < 8) {
    res.status(422).json({ error: "Gültige E-Mail-Adresse und Passwort (mind. 8 Zeichen) erforderlich." });
    return;
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    res.status(409).json({ error: "Diese E-Mail-Adresse ist bereits registriert." });
    return;
  }

  const passwordHash = hashPassword(password);
  const result = db
    .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
    .run(email, passwordHash);

  const userId = Number(result.lastInsertRowid);

  // Startkategorien anlegen (siehe N1, NFR-14c-01 "Erweiterbarkeit der
  // Kategorien"): jede Person bekommt eine eigene, veränderliche Liste statt
  // einer fest im Code hinterlegten — kann danach über POST /api/categories
  // beliebig eigene Kategorien ergänzen.
  const insertCategory = db.prepare(
    "INSERT INTO categories (user_id, label, color) VALUES (?, ?, ?)"
  );
  for (const category of DEFAULT_CATEGORIES) {
    insertCategory.run(userId, category.label, category.color);
  }

  createSession(userId, res);
  res.status(201).json({ id: result.lastInsertRowid, email });
});

// POST /api/auth/login — meldet eine Person per Session-Cookie an (ADR-004).
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(422).json({ error: "E-Mail und Passwort erforderlich." });
    return;
  }

  const user = db
    .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
    .get(email) as UserRow | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: "E-Mail oder Passwort falsch." });
    return;
  }

  createSession(user.id, res);
  res.json({ id: user.id, email: user.email });
});

// POST /api/auth/logout — beendet die aktuelle Session.
authRouter.post("/logout", (req, res) => {
  destroySession(req, res);
  res.status(204).send();
});

// GET /api/auth/me — liefert die aktuell angemeldete Person (für das Frontend,
// um z. B. nach einem Seiten-Reload zu prüfen, ob noch eine Session besteht).
authRouter.get("/me", requireAuth, (req, res) => {
  const user = db
    .prepare("SELECT id, email, created_at FROM users WHERE id = ?")
    .get(req.userId);
  res.json(user);
});
