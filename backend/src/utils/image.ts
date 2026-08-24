import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Bilder werden als Datei im Backend gespeichert (nicht als BLOB in der
// Datenbank) — die events-Tabelle enthält nur den Pfad (image_path).
// Der Upload läuft als Base64-Data-URI im JSON-Body, damit kein
// zusätzliches npm-Paket (z. B. multer für multipart/form-data) nötig ist.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

const DATA_URI_PATTERN = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/;

export interface ParsedImage {
  buffer: Buffer;
  extension: string;
}

// Erwartet einen Data-URI-String, z. B. "data:image/png;base64,iVBORw0KG...".
// Gibt null zurück, wenn Format, Typ oder Größe ungültig sind.
export function parseDataUri(dataUri: string): ParsedImage | null {
  const match = DATA_URI_PATTERN.exec(dataUri);
  if (!match) return null;

  const [, mimeType, base64Data] = match;
  const extension = ALLOWED_MIME_TYPES[mimeType];
  if (!extension) return null;

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, "base64");
  } catch {
    return null;
  }

  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) return null;

  return { buffer, extension };
}

// Speichert das Bild unter einem zufälligen Dateinamen und gibt den
// relativen Pfad zurück, unter dem es später ausgeliefert wird (siehe
// server.ts, statische Route "/uploads").
export function saveImage(parsed: ParsedImage): string {
  const filename = `${randomUUID()}.${parsed.extension}`;
  fs.writeFileSync(path.join(UPLOADS_DIR, filename), parsed.buffer);
  return `/uploads/${filename}`;
}

// Löscht eine zuvor gespeicherte Bilddatei (z. B. beim Ersetzen oder
// Löschen eines Events). Kein Fehler, falls die Datei nicht mehr existiert.
export function deleteImage(imagePath: string | null | undefined): void {
  if (!imagePath) return;
  const filename = path.basename(imagePath);
  const fullPath = path.join(UPLOADS_DIR, filename);
  try {
    fs.rmSync(fullPath, { force: true });
  } catch {
    // Datei existierte nicht mehr — kein Problem.
  }
}
