import "dotenv/config";
import express from "express";
import { applySchema, db } from "./db/index.js";

applySchema();

const app = express();
app.use(express.json());

// Einfacher Health-Check: zeigt, dass die DB-Verbindung funktioniert.
app.get("/api/health", (_req, res) => {
  const row = db.prepare("SELECT COUNT(*) AS count FROM events").get();
  res.json({ status: "ok", events: row });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`);
});
