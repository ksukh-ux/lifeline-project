import { randomBytes } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

// Session-basierte Authentifizierung per httpOnly-Cookie, gemäß ADR-004
// (Session-Cookie statt JWT/Token). Der Session-Store ist bewusst ein
// einfacher In-Memory-Map (dokumentierte technische Schuld D-02, siehe
// A09-Architekturentscheidungen.md) — für den Projektumfang ausreichend,
// geht aber bei einem Server-Neustart verloren und skaliert nicht über
// mehrere Prozesse. Kein zusätzliches npm-Paket (z. B. express-session)
// nötig.

interface SessionRecord {
  userId: number;
  createdAt: number;
}

const sessions = new Map<string, SessionRecord>();

const SESSION_COOKIE_NAME = "sid";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24 Stunden

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  for (const part of header.split(";")) {
    const separatorIndex = part.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = part.slice(0, separatorIndex).trim();
    const value = part.slice(separatorIndex + 1).trim();
    if (!key) continue;
    cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

export function createSession(userId: number, res: Response): void {
  const id = randomBytes(32).toString("hex");
  sessions.set(id, { userId, createdAt: Date.now() });

  const maxAgeSeconds = SESSION_TTL_MS / 1000;
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${id}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`
  );
}

export function destroySession(req: Request, res: Response): void {
  const cookies = parseCookies(req.headers.cookie);
  const id = cookies[SESSION_COOKIE_NAME];
  if (id) sessions.delete(id);

  res.setHeader("Set-Cookie", `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`);
}

export function sessionMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const cookies = parseCookies(req.headers.cookie);
  const id = cookies[SESSION_COOKIE_NAME];

  if (id) {
    const session = sessions.get(id);
    if (session && Date.now() - session.createdAt < SESSION_TTL_MS) {
      req.userId = session.userId;
    } else if (session) {
      sessions.delete(id);
    }
  }

  next();
}
