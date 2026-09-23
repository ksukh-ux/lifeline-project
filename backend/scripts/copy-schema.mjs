// tsc übersetzt nur TypeScript-Dateien. db/index.ts liest schema.sql zur
// Laufzeit aus demselben Ordner ein, deshalb wird die Datei nach dem Build
// nach dist/db/ kopiert (sonst startet "npm start" nicht).
import fs from "node:fs";

fs.mkdirSync("dist/db", { recursive: true });
fs.copyFileSync("src/db/schema.sql", "dist/db/schema.sql");
console.log("schema.sql nach dist/db/ kopiert.");
