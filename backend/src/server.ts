import "dotenv/config";
import express from "express";
import { applySchema, db } from "./db/index.js";
import { sessionMiddleware } from "./middleware/session.js";
import { authRouter } from "./routes/auth.js";
import { eventsRouter } from "./routes/events.js";
import { statsRouter } from "./routes/stats.js";

applySchema();

const app = express();
app.use(express.json());
app.use(sessionMiddleware);

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
