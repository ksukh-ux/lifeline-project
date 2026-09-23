import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applySchema, db } from "./db/index.js";
import { runDataMigrations } from "./db/migrateCategories.js";
import { corsMiddleware } from "./middleware/cors.js";
import { sessionMiddleware } from "./middleware/session.js";
import { authRouter } from "./routes/auth.js";
import { categoriesRouter } from "./routes/categories.js";
import { eventsRouter } from "./routes/events.js";
import { holidaysRouter } from "./routes/holidays.js";
import { statsRouter } from "./routes/stats.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

applySchema();
runDataMigrations(db);

const app = express();
// Limit erhöht (Standard 100kb), da hochgeladene Bilder als Base64 im
// JSON-Body übertragen werden (siehe utils/image.ts, max. 5 MB Bild).
app.use(express.json({ limit: "10mb" }));
app.use(corsMiddleware);
app.use(sessionMiddleware);

// Liefert hochgeladene Event-Bilder aus (siehe utils/image.ts).
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) {
      next();
      return;
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Einfacher Health-Check: zeigt, dass die DB-Verbindung funktioniert, ohne
// Angaben über gespeicherte Daten preiszugeben.
app.get("/api/health", (_req, res) => {
  db.prepare("SELECT 1").get();
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/events", eventsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/holidays", holidaysRouter);

// Zentraler Fehler-Handler (N2.4): unerwartete Fehler werden protokolliert,
// die Antwort enthält aber nie Stapelspuren oder interne Meldungen
// (NFR-11c-01). Ein zu großer Request-Body (z. B. ein sehr großes Bild)
// wird als verständlicher 413 beantwortet.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if ((err as { type?: string })?.type === "entity.too.large") {
    res.status(413).json({ error: "Die Anfrage ist zu groß. Bitte ein kleineres Bild wählen." });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Ein interner Fehler ist aufgetreten. Bitte später erneut versuchen." });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`);
});
