import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applySchema, db } from "./db/index.js";
import { sessionMiddleware } from "./middleware/session.js";
import { authRouter } from "./routes/auth.js";
import { eventsRouter } from "./routes/events.js";
import { statsRouter } from "./routes/stats.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

applySchema();

const app = express();
// Limit erhöht (Standard 100kb), da hochgeladene Bilder als Base64 im
// JSON-Body übertragen werden (siehe utils/image.ts, max. 5 MB Bild).
app.use(express.json({ limit: "10mb" }));
app.use(sessionMiddleware);

// Liefert hochgeladene Event-Bilder aus (siehe utils/image.ts).
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Einfacher Health-Check: zeigt, dass die DB-Verbindung funktioniert.
app.get("/api/health", (_req, res) => {
  const row = db.prepare("SELECT COUNT(*) AS count FROM events").get();
  res.json({ status: "ok", events: row });
});

app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);
app.use("/api/stats", statsRouter);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`);
});
