import assert from "node:assert/strict";
import test from "node:test";
import { validateEventInput } from "./validateEvent.js";

const validEvent = {
  category_id: 1,
  title: "Testereignis",
  date: "2026-09-23",
  time: "10:30",
};

test("akzeptiert ein gültiges Datum und eine gültige Uhrzeit", () => {
  assert.equal(validateEventInput(validEvent), null);
});

test("weist nicht existente Kalendertage zurück", () => {
  assert.match(
    validateEventInput({ ...validEvent, date: "2026-02-30" }) ?? "",
    /gültiges Datum/,
  );
});

test("weist ungültige Uhrzeiten zurück", () => {
  assert.match(
    validateEventInput({ ...validEvent, time: "25:99" }) ?? "",
    /gültige Uhrzeit/,
  );
});

test("akzeptiert ein Event ohne Uhrzeit", () => {
  assert.equal(validateEventInput({ ...validEvent, time: null }), null);
});

test("weist einen leeren Titel zurück", () => {
  assert.match(validateEventInput({ ...validEvent, title: "   " }) ?? "", /Titel/);
});

test("weist eine fehlende Kategorie zurück", () => {
  assert.match(
    validateEventInput({ ...validEvent, category_id: undefined }) ?? "",
    /Kategorie/,
  );
});

test("weist eine Bedeutung außerhalb von 0–100 oder mit Nachkommastellen zurück (D2.2)", () => {
  assert.match(validateEventInput({ ...validEvent, significance: 101 }) ?? "", /Bedeutung/);
  assert.match(validateEventInput({ ...validEvent, significance: 50.5 }) ?? "", /Bedeutung/);
  assert.match(validateEventInput({ ...validEvent, significance: "50" }) ?? "", /Bedeutung/);
  assert.equal(validateEventInput({ ...validEvent, significance: 0 }), null);
});

test("weist eine Beschreibung zurück, die kein Text ist", () => {
  assert.match(
    validateEventInput({ ...validEvent, description: { text: "x" } }) ?? "",
    /Beschreibung/,
  );
});