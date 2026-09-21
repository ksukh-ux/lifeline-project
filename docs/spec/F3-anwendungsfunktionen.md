# F3 – Anwendungsfunktionen

Anwendungsfunktionen im Sinne von Siedersleben (Kap. 4.4): in sich geschlossene, wiederverwendbare Verhaltensbausteine, die von einem oder mehreren Anwendungsfällen (F2) aufgerufen werden und aus fachlicher Sicht **genug algorithmische Substanz** besitzen, um eine eigene Beschreibung außerhalb des Anwendungsfalls zu rechtfertigen. F3 beschreibt bewusst **keine** Bildschirme, Controller oder Persistenz – das ist Aufgabe von [B1](B1-dialogspezifikation.md), [F2](F2-anwendungsfaelle.md) und der Architekturdokumentation.

Reines CRUD (Event anlegen/bearbeiten/löschen), die Registrierung/Anmeldung und das bloße Laden und Anzeigen von Events sind **keine** Anwendungsfunktionen in diesem Sinne – es sind Anwendungsfälle (siehe [F2](F2-anwendungsfaelle.md)) ohne eigenständigen Berechnungs- oder Transformationsschritt. Inhalte, die **nicht** nach F3 gehören, sind an ihrem eigentlichen Baustein dokumentiert:

- **Benutzerzugang, Event-CRUD, Timeline ansehen.** Reine Interaktionsschritte ohne Algorithmus – siehe [F2](F2-anwendungsfaelle.md) UC-01 bis UC-04, UC-07.
- **Validierungsregeln.** Querschnittskonzept – siehe [N2.2](N2-querschnittskonzepte.md#n22-validierung), abgesichert durch [D2](D2-datentypenverzeichnis.md).
- **Persistenz (SQLite-Zugriff).** Implementierung, nicht Spezifikation.

Was bleibt, sind die Funktionen, die tatsächlich etwas *berechnen* oder *transformieren*: die Aufbereitung der Timeline-Daten, die Statistik-Aggregation und die clientseitige Filterung.

---

## F3.1 Funktionsübersicht

| ID | Funktion | Zweck |
|----|----------|-------|
| [AF-01](#af-01--ereignisdauer-berechnen) | Ereignisdauer berechnen | Berechnet die Anzahl Tage zwischen zwei Zeitpunkten eines Events bzw. zwischen zwei Events, als Grundlage für Timeline-Darstellung und Statistik. |
| [AF-02](#af-02--statistik-aggregation) | Statistik-Aggregation | Verdichtet die vorhandenen Events zu aggregierten Kennzahlen (Anzahl je Kategorie, Zeitspannen, Durchschnittswerte). |
| [AF-03](#af-03--timeline-filterung) | Timeline-Filterung | Reduziert die bereits geladenen Events clientseitig auf die zu einer ausgewählten Kategorie passende Teilmenge. |
| [AF-04](#af-04--timeline-export) | Timeline-Export | Wandelt die aktuell dargestellte Timeline clientseitig in eine PNG-Bilddatei um. |

---

## F3.2 Funktionsbeschreibungen

### AF-01 — Ereignisdauer berechnen

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Berechnet aus zwei Datumswerten die Anzahl der dazwischenliegenden Tage — z. B. die Dauer eines Events (`start_date` bis `end_date`) oder den zeitlichen Abstand zwischen zwei Events. |
| **Eingaben** | Zwei Datumswerte (`Date`), z. B. `EVENTS.start_date` und `EVENTS.end_date`, oder die `start_date`-Werte zweier verschiedener Events. |
| **Ausgaben** | Ganzzahlige Anzahl Tage zwischen den beiden Datumswerten. |
| **Regeln** | - Liegt das zweite Datum vor dem ersten, wird der Betrag der Differenz zurückgegeben (keine negative Tagesanzahl).<br>- Ergebnis ist deterministisch und hängt ausschließlich von den beiden Eingabewerten ab. |
| **Verwendet von** | [B1.1 Timeline](B1-dialogspezifikation.md) (Anzeige der Event-Dauer bzw. des Abstands zum vorherigen Event); [AF-02](#af-02--statistik-aggregation) (Zeitspannen-Kennzahlen). |

### AF-02 — Statistik-Aggregation

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Verdichtet die Events einer Nutzerin bzw. eines Nutzers zu aggregierten Kennzahlen für die Statistikansicht. |
| **Eingaben** | Menge der `EVENTS`-Datensätze einer Nutzer:in. |
| **Ausgaben** | Aggregierte Kennzahlen: Anzahl Events je `category` (D2.4), Anzahl Events insgesamt, Zeitspanne vom ältesten bis zum jüngsten Event (unter Nutzung von [AF-01](#af-01--ereignisdauer-berechnen)), durchschnittliche `significance` je Kategorie. |
| **Regeln** | - Sind keine Events vorhanden, liefert die Funktion leere bzw. neutrale Kennzahlen (0), statt einen Fehler auszulösen.<br>- Die Berechnung erfolgt serverseitig im `statsService` auf Basis der aus der Datenbank geladenen Events. |
| **Verwendet von** | [UC-06](F2-anwendungsfaelle.md#uc-06--statistik-berechnen) *Statistik berechnen* (liefert die im `StatsDashboard` dargestellten Werte). |

### AF-03 — Timeline-Filterung

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Reduziert die bereits vom Backend geladenen Events auf die Teilmenge, die zu einer ausgewählten Kategorie passt, ohne eine erneute Anfrage an das Backend zu stellen. |
| **Eingaben** | Bereits geladene Events (Menge); ausgewählte `category` (D2.4) oder „kein Filter“. |
| **Ausgaben** | Gefilterte Teilmenge der Events. |
| **Regeln** | - Läuft vollständig clientseitig im Frontend.<br>- Bei „kein Filter“ wird die vollständige, bereits geladene Menge zurückgegeben.<br>- Ist die Ergebnismenge leer, wird dies als leerer Zustand an die Timeline zurückgegeben (siehe [B1.1](B1-dialogspezifikation.md)), nicht als Fehler. |
| **Verwendet von** | [UC-05](F2-anwendungsfaelle.md#uc-05--timeline-filtern) *Timeline filtern*, ausgelöst über die `FilterBar` ([B1.3](B1-dialogspezifikation.md)). |

### AF-04 — Timeline-Export

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Wandelt die aktuell sichtbare Timeline-Darstellung in eine PNG-Bilddatei um, die die Nutzer:in herunterladen kann. |
| **Eingaben** | Aktueller Darstellungszustand der Timeline (sichtbarer Zeitbereich, Zoomstufe, ggf. aktiver Filter). |
| **Ausgaben** | PNG-Bilddatei der aktuell sichtbaren Timeline. |
| **Regeln** | - Läuft vollständig clientseitig; es wird keine zusätzliche Anfrage an das Backend gestellt.<br>- Das Bild entspricht exakt dem, was zum Zeitpunkt des Exports auf dem Bildschirm dargestellt wird (inkl. aktivem Filter, falls gesetzt). |
| **Verwendet von** | [B1.1 Timeline](B1-dialogspezifikation.md) (Export-Aktion). |

---

## F3.3 Nicht Teil von F3

- **Registrierung und Login.** Reiner Interaktions- und Prüfschritt ohne eigenständige Berechnung — siehe [F2](F2-anwendungsfaelle.md) UC-07.
- **Event anlegen, bearbeiten, löschen.** CRUD-Operationen — siehe [F2](F2-anwendungsfaelle.md) UC-01 bis UC-03.
- **Timeline ansehen (Laden und Anzeigen).** Interaktionsschritt ohne eigenständigen Algorithmus — siehe [F2](F2-anwendungsfaelle.md) UC-04.
- **Eingabevalidierung.** Querschnittskonzept — siehe [N2.2](N2-querschnittskonzepte.md#n22-validierung), Wertebereiche in [D2](D2-datentypenverzeichnis.md).
- **Persistenzoperationen.** Laden und Speichern über die Models in der SQLite-Datenbank sind Implementierungsdetails.

---

## F3.4 Querverweise

| Baustein | Bezug zu F3 |
|---|---|
| [F1](F1-geschaeftsprozesse.md) | F1.4 *Statistiken auswerten* motiviert AF-02; F1.3 *Timeline filtern* motiviert AF-03. |
| [F2](F2-anwendungsfaelle.md) | UC-05 nutzt AF-03; UC-06 nutzt AF-01 und AF-02. |
| [D1](D1-datenmodell.md) | AF-01 und AF-02 rechnen auf den Attributen von `EVENTS` (`start_date`, `end_date`, `category`, `significance`). |
| [D2](D2-datentypenverzeichnis.md) | Wertebereich von `category` bestimmt die Gruppierung in AF-02 und AF-03. |
| [B1](B1-dialogspezifikation.md) | AF-01 speist die Anzeige in der Timeline; AF-04 realisiert die Export-Aktion dort. |

