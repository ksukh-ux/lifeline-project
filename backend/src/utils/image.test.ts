import assert from "node:assert/strict";
import test from "node:test";
import { parseDataUri } from "./image.js";

const validPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

test("akzeptiert ein PNG mit passender Dateisignatur", () => {
  const parsed = parseDataUri(validPng);

  assert.ok(parsed);
  assert.equal(parsed.extension, "png");
  assert.equal(parsed.buffer.length, 68);
});

test("weist Base64-Inhalt mit falscher PNG-Signatur zurück", () => {
  const spoofedPng = `data:image/png;base64,${Buffer.from("kein PNG").toString("base64")}`;

  assert.equal(parseDataUri(spoofedPng), null);
});

test("weist nicht erlaubte Bildtypen zurück", () => {
  const svg = `data:image/svg+xml;base64,${Buffer.from("<svg />").toString("base64")}`;

  assert.equal(parseDataUri(svg), null);
});