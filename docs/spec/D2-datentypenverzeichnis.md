# D2 – Datentypenverzeichnis

D2 erklärt **fachliche, domänenspezifische Datentypen** — Wertebereiche und Formatregeln, die einem sonst trivialen Typ (`integer`, `string`) eine über die Technik hinausgehende Bedeutung geben. Ein klassisches Beispiel für diese Art von Datentyp wäre eine ISBN: technisch eine Zeichenkette, fachlich aber ein Format mit Prüfsumme und Bedeutung.

D2 dokumentiert **nicht**:

- **Entitäten und ihre Attributlisten.** Das steht in [D1](D1-datenmodell.md). Eine Aufzählung „Attribut / Datentyp / Beschreibung" für eine ganze Entität ist keine Erklärung eines Datentyps, sondern eine Wiederholung von D1.
- **Allgemeine technische Typen** wie `int`, `string`, `date`, `datetime` ohne zusätzliche fachliche Bedeutung. Diese werden in D1 direkt verwendet und nicht gesondert definiert.
- **Aufzählungen, die eine eigene Lebensdauer und Pflege haben** (z. B. die Event-Kategorien) — diese sind als eigene Entität in [D1.2](D1-datenmodell.md#d12-entität-categories) modelliert, nicht als Datentyp hier. Ein Datentyp beschreibt eine *Form von Werten*; die Kategorienliste ist dagegen *veränderlicher Dateninhalt* und gehört damit ins Datenmodell.

Was bleibt, sind zwei Wertebereiche, die tatsächlich eine fachliche Regel auf einem sonst trivialen Typ ausdrücken.

---

## D2.1 Übersicht

| ID | Datentyp | Art | Verwendet in |
|----|----------|-----|--------------|
| [D2.2](#d22-wertebereich-von-significance) | Wertebereich `significance` | Ganzzahliger Wertebereich (0–100) | `EVENTS.significance` |
| [D2.3](#d23-bild-image_path) | Bild (`image_path`) | Formatregel für Datei-Upload | `EVENTS.image_path` |

---

## D2.2 Wertebereich von significance

`EVENTS.significance` ist eine Ganzzahl zwischen 0 und 100 (0 = geringste, 100 = höchste Bedeutung für die Nutzer:in). Der Wert wird für die visuelle Gewichtung des Events in der Timeline verwendet (z. B. Größe oder Hervorhebung des Eintrags) und fließt in die Durchschnittsbildung von [F3.AF-02](F3-anwendungsfunktionen.md#af-02--statistik-aggregation) ein. Werte außerhalb von 0–100 werden vom Backend abgelehnt.

---

## D2.3 Bild (image_path)

Ein Event kann optional genau ein Bild besitzen. Das Bild wird nicht in der Datenbank gespeichert, sondern als Datei im Backend abgelegt; `EVENTS.image_path` enthält lediglich den Pfad, unter dem das Bild ausgeliefert wird.

| Regel | Wert |
|---|---|
| Erlaubte Formate | JPEG, PNG, WEBP |
| Maximale Dateigröße | 5 MB |
| Verhalten bei Verstoß | Backend lehnt Upload ab, `image_path` bleibt leer. |

---

## D2.4 Notationskonventionen

Die folgende Notation wird im ER-Diagramm und in den Attributtabellen von [D1](D1-datenmodell.md) verwendet.

| Notation | Wo | Bedeutung |
|---|---|---|
| `●` vor dem Attributnamen | ER-Diagramm (D1) | Pflichtfeld — muss beim Anlegen gesetzt sein bzw. ist nie `null`. Kein `●`: optionales Attribut. |
| `[0..1]` nach dem Typ | Attributtabellen (D1, D2) | Optionales Attribut, höchstens ein Wert vorhanden. Fehlt die Angabe, ist das Attribut Pflicht (siehe erklärender Text in der Spalte „Hinweise"). |
| `1 -- n` / `n -- 1` bei Assoziationen | D1-Text | Kardinalität einer Beziehung, gelesen von links nach rechts (z. B. `USERS 1 -- n EVENTS`: eine Nutzer:in besitzt n Events). |
| `<<PK>>` / `<<FK>>` | ER-Diagramm | Primär- bzw. Fremdschlüssel. |

`●` und `[0..1]` drücken dieselbe Optionalität aus, einmal im Diagramm, einmal in der Tabelle — sie werden bewusst konsistent gehalten, damit Diagramm und Text nicht widersprechen.

---

## D2.5 Querverweise

| Baustein | Bezug zu D2 |
|---|---|
| [D1](D1-datenmodell.md) | `EVENTS.significance`, `EVENTS.image_path` referenzieren D2.2–D2.3. Die Event-Kategorien selbst sind als Entität `CATEGORIES` in D1.2 modelliert, nicht hier. D2.4 definiert die in D1 verwendete Notation. |
| [F3](F3-anwendungsfunktionen.md) | AF-02 mittelt `significance`. |
| [B1](B1-dialogspezifikation.md) | Der Bedeutung-Slider und der Bildupload in `EventForm` ([DLG-04](B1-dialogspezifikation.md#dlg-04--eventform)) setzen D2.2 bzw. D2.3 um. |
| [N2](N2-querschnittskonzepte.md) | N2.2 *Validierung* prüft Bild-Uploads gegen D2.3 und den Wertebereich von `significance` gegen D2.2. |

