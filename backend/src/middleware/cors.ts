import type { NextFunction, Request, Response } from "express";

// Erlaubt dem lokal laufenden Frontend (anderer Port = andere "Origin"),
// das Backend per fetch() anzusprechen. Ohne diese Header blockiert der
// Browser die Anfragen (CORS), selbst wenn beide auf "localhost" laufen.
// Für Sessions per Cookie ist zusätzlich "Allow-Credentials" nötig, und
// "Allow-Origin" darf dafür kein "*" sein, sondern muss die konkrete
// Frontend-Adresse sein (siehe FRONTEND_ORIGIN in .env).

const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
}
