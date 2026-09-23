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
    /date ist erforderlich/,
  );
});

test("weist ungültige Uhrzeiten zurück", () => {
  assert.match(
    validateEventInput({ ...validEvent, time: "25:99" }) ?? "",
    /time muss im Format HH:MM/,
  );
});