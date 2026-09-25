# Lifeline – Architektur (arc42)

Architekturdokumentation von Lifeline, gegliedert nach dem **arc42**-Template
(<https://arc42.org/>). Jedes Kapitel liegt in einer eigenen Datei; dieses Dokument
führt in die Struktur ein und verweist auf alle Kapitel.

Die Architektur baut auf der Spezifikation in [`../spec/`](../spec/) auf: Die
Anwendungsfälle aus F2 finden sich als Bausteine in Kapitel 5 und als Abläufe in
Kapitel 6 wieder; die Bausteine aus Kapitel 5 entsprechen den Modulen im Code
unter `frontend/src/` und `backend/src/`.

---

## Konventionen

- Eine Datei pro arc42-Kapitel, benannt nach dem Schema `A<NN>-<Titel>.md`. Das
  Präfix `A` unterscheidet die Kapitel von den Spezifikationsbausteinen (`P1`, `F2`, …).
- Innerhalb der Dateien wird die arc42-Nummerierung verwendet (`## 5.`, `### 5.1`, …).
- Die Architektur beschreibt, **wie** Lifeline umgesetzt ist. Dateipfade,
  Komponentennamen, Endpunkte und Konfigurationsvariablen gehören hierher; die
  Spezifikation bleibt dagegen frei von Implementierungsdetails.
- Diagramme werden als Mermaid direkt im Markdown gepflegt und von GitHub gerendert;
  der Quelltext ist damit immer Teil des Dokuments.
- Sprache: Deutsch.

## Statusangaben

| Symbol | Bedeutung |
|---|---|
| ✅ | Kapitel ausgearbeitet |
| 🛠 | Kapitel vorgesehen, noch nicht vollständig |
| — | Kapitel entfällt |

---

## Kapitelübersicht

| Nr. | Kapitel | Status | Datei |
|---|---|:--:|---|
| 1 | Einführung und Ziele | ✅ | [`A01-Einleitung-und-Ziele.md`](A01-Einleitung-und-Ziele.md) |
| 2 | Randbedingungen | ✅ | [`A02-Architekturbeschränkungen.md`](A02-Architekturbeschränkungen.md) |
| 3 | Kontextabgrenzung | ✅ | [`A03-Kontext-und-Umfang.md`](A03-Kontext-und-Umfang.md) |
| 4 | Lösungsstrategie | ✅ | [`A04-Lösungsstrategie.md`](A04-Lösungsstrategie.md) |
| 5 | Bausteinsicht | ✅ | [`A05-Bausteinansicht.md`](A05-Bausteinansicht.md) |
| 6 | Laufzeitsicht | ✅ | [`A06-Laufzeitansicht.md`](A06-Laufzeitansicht.md) |
| 7 | Verteilungssicht | ✅ | [`A07-Bereitstellungsansicht.md`](A07-Bereitstellungsansicht.md) |
| 8 | Querschnittliche Konzepte | ✅ | [`A08-Querschnittskonzepte.md`](A08-Querschnittskonzepte.md) |
| 9 | Architekturentscheidungen (ADRs) | ✅ | [`A09-Architekturentscheidungen.md`](A09-Architekturentscheidungen.md) |
| 10 | Qualitätsanforderungen | — | Entfällt laut Modulvorgabe (WK_1106, Abschnitt 6.2). Die Qualitätsziele stehen in Kapitel 1, die messbaren Anforderungen in [N1](../spec/N1-nichtfunktional.md). |
| 11 | Risiken und technische Schulden | — | Entfällt laut Modulvorgabe (WK_1106, Abschnitt 6.2). Bewusst akzeptierte Einschränkungen des Prototyps sind in Kapitel 8 und in [`OFFENE-PUNKTE.md`](../OFFENE-PUNKTE.md) festgehalten. |
| 12 | Glossar | ✅ | [`A12-Glossar.md`](A12-Glossar.md) |

## Empfohlene Lesereihenfolge

1. **Kapitel 1–4** geben den Rahmen: Ziele, Randbedingungen, Systemgrenze und die
   grundlegende Lösungsstrategie.
2. **Kapitel 5** zeigt die Zerlegung in Bausteine und ihre Zuordnung zu Dateien und
   Anwendungsfällen.
3. **Kapitel 6 und 7** zeigen das Zusammenspiel zur Laufzeit und die Bereitstellung.
4. **Kapitel 8 und 9** erklären übergreifende Konzepte und begründen die wesentlichen
   Entscheidungen.

---

## Quellen

- STARKE, G.; HRUSCHKA, P. *arc42 – Template zur Dokumentation von Software- und
  Systemarchitekturen.* <https://arc42.org/>. Grundlage der Kapitelgliederung.
- LUCKE, C. *Herold.* <https://github.com/carstenlucke/herold>. Beispielprojekt des Moduls.
- Modulvorgaben WK_1106 SS 2026. <https://github.com/carstenlucke/thm_wkb_wk-1106>; daraus
  auch der Aufbau der ADRs in Kapitel 9 (Kontext, Alternativen, Entscheidung, Begründung,
  Konsequenzen).
- Offizielle Dokumentation der eingesetzten Technologien: Node.js (`node:sqlite`,
  `crypto.scrypt`), Express, React, Vite und Mermaid.

## Eingesetzte KI-Werkzeuge

Offenlegung gemäß Abschnitt 9.1 der Modulvorgaben (WK_1106). Alle Inhalte wurden
vom Team gelesen, am Code geprüft und bei Bedarf überarbeitet; jedes Teammitglied
kann die Architektur und die zugehörigen Codestellen erläutern.

| Werkzeug | Wofür | Wie wurde geprüft |
|---|---|---|
| ChatGPT | Formulierungshilfe und Strukturvorschläge für Dokumentationsentwürfe; Erklärungen zu Konzepten (z. B. Siedersleben-Bausteine, arc42, Sessions) und Hilfe bei Fehlermeldungen. | Vorschläge wurden im Team gelesen, an den Projektstand angepasst und gegen Code und Modulvorgaben abgeglichen; nichts wurde ungeprüft übernommen. |
| Google Gemini | Recherche und Zweitmeinung zu Technologie- und Gestaltungsfragen, z. B. beim Vergleich von Alternativen für die ADRs. | Aussagen wurden mit der offiziellen Dokumentation der jeweiligen Technologie abgeglichen. |
| GitHub Copilot | Code-Vervollständigung in Visual Studio Code während der Implementierung von Frontend und Backend. | Jeder Vorschlag wurde vor dem Übernehmen gelesen; der Code wird durch die automatisierten Tests, TypeScript im strikten Modus und Code-Reviews in Pull Requests geprüft. |
| Claude Code | Abschluss-Review von Architektur und Code gegen Spezifikation und Modulvorgaben; Korrektur gefundener Fehler im Code (u. a. Bildlöschung vor dem Datenbank-Update, zentraler Fehler-Handler, Passwortbestätigung, Barrierefreiheit), Erweiterung der automatisierten Tests, Angleichung der Architekturkapitel an den umgesetzten Code; optische Überarbeitung der Timeline (animierter Ansichtswechsel, kräftigerer Zeitstrahl, dezenter Hintergrund mit Sternschnuppen) und Ringdiagramm in der Statistik, jeweils nach Vorgaben des Teams und nach einem vom Team freigegebenen Mockup. | Änderungen wurden in kleinen, thematisch getrennten Commits per Pull Request eingebracht und vom Team geprüft; die Backend-Tests (`npm --prefix backend test`) und ein Durchlauf der Oberfläche im Browser mussten vor dem Merge bestehen. |
