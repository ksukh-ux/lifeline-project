import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Passwort-Hashing über Node's eingebautes crypto-Modul (scrypt), damit keine
// zusätzliche native Abhängigkeit (z. B. bcrypt) installiert werden muss.
// scrypt ist wie bcrypt ein für Passwort-Hashing empfohlenes, absichtlich
// langsames Verfahren (schützt gegen Brute-Force). Siehe ADR-004.

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = scryptSync(password, salt, hashBuffer.length);

  if (candidateBuffer.length !== hashBuffer.length) return false;
  return timingSafeEqual(candidateBuffer, hashBuffer);
}
