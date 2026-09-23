# D2 – Datentypenverzeichnis

D2 erklärt **fachliche, domänenspezifische Datentypen** — Wertebereiche und Formatregeln, die einem sonst trivialen Typ (`integer`, `string`) eine über die Technik hinausgehende Bedeutung geben. Ein klassisches Beispiel für diese Art von Datentyp wäre eine ISBN: technisch eine Zeichenkette, fachlich aber ein Format mit Prüfsumme und Bedeutung.

D2 dokumentiert **nicht**:

- **Entitäten und ihre Attributlisten.** Das steht in [D1](D1-datenmodell.md). Eine Aufzählung „Attribut / Datentyp / Beschreibung" für eine ganze Entität ist keine Erklärung eines Datentyps, sondern eine Wiederholung von D1.
- **Allgemeine technische Typen** wie `int`, `string`, `date`, `datetime` ohne zusätzliche fachliche Bedeutung. Diese werden in D1 direkt verwendet und nicht gesondert definiert.
- **Aufzählungen, die eine eigene Lebensdauer und Pflege haben** (z. B. die Event-Kategorien) — diese sind als eigene Entität in [D1.3](D1-datenmodell.md#d13-categories) modelliert, nicht als Datentyp hier. Ein Datentyp beschreibt eine *Form von Werten*; die Kategorienliste ist dagegen *veränderlicher Dateninhalt* und gehört damit ins Datenmodell.

Was bleibt, sind Wertebereiche und Formatregeln, die tatsächlich eine fachliche Regel auf einem sonst trivialen Typ ausdrücken. Die Regeln werden in der Anwendungslogik verbindlich geprüft ([N2.2](N2-querschnittskonzepte.md#n22-validierung)); die Invarianten des Datenbestands stehen in [D1.7](D1-datenmodell.md#d17-invarianten).

---

## D2.1 Übersicht

| ID | Datentyp | Art | Verwendet in |
|----|----------|-----|--------------|
| [D2.2](#d22-wertebereich-von-significance) | Bedeutung (`significance`) | Ganzzahliger Wertebereich 0–100 | `EVENTS.significance` |
| [D2.3](#d23-bild-image_path) | Bild (`image_path`) | Formatregel für Datei-Upload | `EVENTS.image_path` |
| [D2.5](#d25-kalenderdatum) | Kalenderdatum | Formatregel `YYYY-MM-DD` | `EVENTS.date` |
| [D2.6](#d26-uhrzeit) | Uhrzeit | Formatregel `HH:MM` | `EVENTS.time` |
| [D2.7](#d27-titel-und-beschreibung) | Titel und Beschreibung | Längenbegrenzter Text | `EVENTS.title`, `EVENTS.description` |
| [D2.8](#d28-kategoriename-und-farbcode) | Kategoriename und Farbcode | Längenregel bzw. Formatregel `#RRGGBB` | `CATEGORIES.label`, `CATEGORIES.color` |
| [D2.9](#d29-e-mail-adresse-und-passwort) | E-Mail-Adresse und Passwort | Formatregel bzw. Mindestlänge | `USERS.email`, Registrierung |

---

## D2.2 Wertebereich von significance

`EVENTS.significance` ist eine **ganze Zahl** zwischen 0 und 100 (0 = geringste, 100 = höchste Bedeutung für die Nutzer:in). Ohne Angabe gilt 50. Der Wert bestimmt die visuelle Gewichtung des Events in der Timeline (Größe des Markers) und fließt in die Tendenz je Kategorie in [F3.AF-02](F3-anwendungsfunktionen.md#af-02--statistik-aggregation) ein.

Die Skala ist **ordinal**: 80 bedeutet „wichtiger als 40“, aber nicht „doppelt so wichtig“. Die Oberfläche zeigt den Wert deshalb als „95 / 100“ und nicht als Prozentangabe, und der Mittelwert je Kategorie wird nur als Tendenz ausgewiesen.

Werte außerhalb von 0–100 und Werte mit Nachkommastellen werden abgewiesen.

---

## D2.3 Bild (image_path)

Ein Event kann optional genau ein Bild besitzen. Das Bild wird nicht in der Datenbank gespeichert, sondern als Datei in der Bildablage; `EVENTS.image_path` enthält lediglich den Pfad, unter dem das Bild ausgeliefert wird.

| Regel | Wert |
|---|---|
| Erlaubte Formate | JPEG, PNG, WEBP |
| Maximale Dateigröße | 5 MB |
| Inhaltsprüfung | Der tatsächliche Dateiinhalt muss zum angegebenen Format passen (Dateisignatur); die Angabe des Browsers allein genügt nicht. |
| Verhalten bei Verstoß | Das Bild wird abgewiesen, das Event wird nicht gespeichert, `image_path` bleibt unverändert. |

---

## D2.4 Notationskonventionen

Die folgende Notation wird im ER-Diagramm und in den Attributtabellen von [D1](D1-datenmodell.md) verwendet.

| Notation | Wo | Bedeutung |
|---|---|---|
| `●` hinter Typ und Name | ER-Diagramm (D1.1) | Pflichtfeld — ist nie leer. |
| `[0..1]` | ER-Diagramm und Spalte „Datentyp“ der Attributtabellen (D1) | Optionales Attribut, höchstens ein Wert. Attribute ohne `[0..1]` sind Pflicht. |
| `PK` / `FK` | ER-Diagramm (D1.1) | Primär- bzw. Fremdschlüssel. |
| `1 -- n` | D1-Text | Kardinalität einer Beziehung, gelesen von links nach rechts (z. B. `USERS 1 -- n EVENTS`: eine Nutzer:in besitzt n Events). |

`●` und `[0..1]` drücken dieselbe Optionalität aus, einmal im Diagramm, einmal in der Tabelle — sie werden bewusst konsistent gehalten, damit Diagramm und Text nicht widersprechen.

---

## D2.5 Kalenderdatum

`EVENTS.date` ist ein Kalendertag im Format `YYYY-MM-DD` (z. B. `2026-03-10`). Der Tag muss existieren: `2026-02-30` wird abgewiesen. Das Datum bestimmt die Position des Events in der Timeline.

## D2.6 Uhrzeit

`EVENTS.time` ist optional. Falls gesetzt, ist es eine Uhrzeit im Format `HH:MM` mit Stunden 00–23 und Minuten 00–59. Die Uhrzeit dient nur der Reihenfolge innerhalb eines Tages ([NFR-12c-01](N1-nichtfunktional.md)); ein Event ohne Uhrzeit wird am Ende des Tages einsortiert.

## D2.7 Titel und Beschreibung

| Attribut | Regel |
|---|---|
| `EVENTS.title` | Pflicht; nach Entfernen führender und folgender Leerzeichen 1 bis 120 Zeichen. |
| `EVENTS.description` | Optional; höchstens 2000 Zeichen. |

Beide werden bei der Darstellung als reiner Text behandelt ([NFR-15b-03](N1-nichtfunktional.md)).

## D2.8 Kategoriename und Farbcode

| Attribut | Regel |
|---|---|
| `CATEGORIES.label` | Pflicht; 1 bis 40 Zeichen; innerhalb der Kategorien einer Person eindeutig (`INV-C1`). |
| `CATEGORIES.color` | Pflicht; Farbcode im Format `#RRGGBB` mit hexadezimalen Ziffern, z. B. `#38BDF8`. |

## D2.9 E-Mail-Adresse und Passwort

| Attribut | Regel |
|---|---|
| `USERS.email` | Pflicht; Form `name@domain.tld`; wird kleingeschrieben gespeichert und ist ohne Unterschied von Groß-/Kleinschreibung eindeutig (`INV-U1`). |
| Passwort (nur bei Registrierung und Anmeldung) | Mindestens 8 Zeichen; wird nie gespeichert, sondern nur als Hash in `USERS.password_hash` (`INV-U2`). |

---

## D2.10 Querverweise

| Baustein | Bezug zu D2 |
|---|---|
| [D1](D1-datenmodell.md) | Die Attribute in D1 verwenden die hier definierten Datentypen; D2.4 definiert die in D1 verwendete Notation. Die Kategorien selbst sind als Entität `CATEGORIES` in D1.3 modelliert. |
| [F3](F3-anwendungsfunktionen.md) | AF-02 bildet die Tendenz von `significance`. |
| [B1](B1-dialogspezifikation.md) | Die Formulare in DLG-02, DLG-05 und DLG-06 setzen die Regeln aus D2.2, D2.3 und D2.5 bis D2.9 um. |
| [N2](N2-querschnittskonzepte.md) | N2.2 *Validierung* prüft alle Eingaben gegen die hier definierten Regeln. |
