import type { NextFunction, Request, Response } from "express";

// Schützt Routen, die eine angemeldete Person voraussetzen (z. B. alle
// /api/events- und /api/stats-Endpunkte). Setzt voraus, dass
// sessionMiddleware bereits gelaufen ist und req.userId gesetzt hat.
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.userId) {
    res.status(401).json({ error: "Nicht angemeldet." });
    return;
  }
  next();
}
