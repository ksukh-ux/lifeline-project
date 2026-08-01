# Lifeline-Projekt – Spezifikation

Die Spezifikation des Lifeline-Projekts ist nach dem Bausteinmodell von **Johannes Siedersleben** strukturiert. Jeder Baustein beschreibt eine klar abgegrenzte Sicht auf das System und wird in einer eigenen Datei dokumentiert.

Dieses Dokument dient als zentrale Übersicht: Es erläutert das verwendete Modell, verweist auf alle Spezifikationsbausteine und dokumentiert, welche Bausteine für das Lifeline-Projekt nicht relevant sind.

Eine Beschreibung des Bausteinmodells befindet sich in der
[Siedersleben-Vorlage von Herrn Lucke](https://github.com/carstenlucke/herold/blob/main/docs/spec/SIEDERSLEBEN.md).

Quelle: SIEDERSLEBEN, J. (Hrsg.) 2003. *Softwaretechnik – Praxiswissen für Softwareingenieure.* München: Carl Hanser Verlag.

---

## E1 – Leseleitfaden

### Zielgruppen

Die Spezifikation richtet sich insbesondere an:

* die Mitglieder des Projektteams, die an der Entwicklung von Lifeline beteiligt sind,
* zukünftige Entwicklerinnen und Entwickler, die das Projekt weiterentwickeln oder warten,
* den Projektbetreuer und weitere Personen, die den Projektumfang, die Anforderungen und die getroffenen fachlichen Entscheidungen nachvollziehen möchten.

### Empfohlene Lesereihenfolge

1. Mit **P1** beginnen: Ziele, Projektumfang, Rahmenbedingungen und Erfolgskriterien.
2. Anschließend **P2** lesen: fachlicher Überblick über das System und seine Bestandteile.
3. Die Bausteine **F1 bis F3** beschreiben die Geschäftsprozesse, Anwendungsfälle und Anwendungsfunktionen.
4. Die Bausteine **D1 und D2** dienen als Referenz für das Datenmodell und die verwendeten Datentypen.
5. **B1** beschreibt die Benutzeroberfläche und die Interaktion mit dem System.
6. **S1 und S3** behandeln Schnittstellen zu anderen Systemen sowie die Inbetriebnahme der Anwendung.
7. **N1 und N2** enthalten nichtfunktionale Anforderungen und übergreifende Konzepte.
8. **E2** enthält das Glossar mit den wichtigsten Begriffen des Lifeline-Projekts.

### Konventionen

* Die Bausteine werden anhand der von Siedersleben vorgegebenen Kürzel bezeichnet, beispielsweise `P1`, `F2` oder `D1`.
* Jeder Baustein wird in einer eigenen Datei dokumentiert.
* Die Dateien werden nach dem Schema `<Kürzel>-<Thema>.md` benannt.
* Die Spezifikation beschreibt, **was** Lifeline leisten soll und **warum** diese Anforderungen bestehen.
* Technische Entscheidungen zur konkreten Umsetzung werden im Verzeichnis [`docs/arch/`](../arch/) dokumentiert.
* Die Dokumentation wird in deutscher Sprache verfasst.
* Die ursprünglichen Bausteinbezeichnungen nach Siedersleben werden zur eindeutigen Zuordnung beibehalten.

### Statusangaben

| Symbol | Bedeutung                                                                                             |
| ------ | ----------------------------------------------------------------------------------------------------- |
| ✅      | Der Baustein wurde erstellt und inhaltlich ausgearbeitet.                                             |
| 🛠     | Der Baustein ist vorgesehen, wurde aber noch nicht vollständig ausgearbeitet.                         |
| ⛔      | Der Baustein ist für das Lifeline-Projekt nicht relevant. Eine Begründung befindet sich weiter unten. |

---

## Übersicht der Bausteine

### 1. Projektgrundlagen

| Baustein | Bezeichnung                 | Status | Datei                                                            |
| -------- | --------------------------- | -----: | ---------------------------------------------------------------- |
| P1       | Ziele und Rahmenbedingungen |     🛠 | [`P1-ziele-rahmenbedingungen.md`](P1-ziele-rahmenbedingungen.md) |
| P2       | Architekturüberblick        |     🛠 | [`P2-architekturueberblick.md`](P2-architekturueberblick.md)     |

### 2. Prozesse und Funktionen

| Baustein | Bezeichnung          | Status | Datei                                                      |
| -------- | -------------------- | -----: | ---------------------------------------------------------- |
| F1       | Geschäftsprozesse    |     🛠 | [`F1-geschaeftsprozesse.md`](F1-geschaeftsprozesse.md)     |
| F2       | Anwendungsfälle      |     🛠 | [`F2-anwendungsfaelle.md`](F2-anwendungsfaelle.md)         |
| F3       | Anwendungsfunktionen |     🛠 | [`F3-anwendungsfunktionen.md`](F3-anwendungsfunktionen.md) |

### 3. Daten

| Baustein | Bezeichnung     | Status | Datei                                    |
| -------- | --------------- | -----: | ---------------------------------------- |
| D1       | Datenmodell     |     🛠 | [`D1-datenmodell.md`](D1-datenmodell.md) |
| D2       | Datentypkatalog |     🛠 | [`D2-datentypen.md`](D2-datentypen.md)   |

### 4. Benutzeroberfläche

| Baustein | Bezeichnung         | Status | Datei                                                    |
| -------- | ------------------- | -----: | -------------------------------------------------------- |
| B1       | Dialogspezifikation |     🛠 | [`B1-dialogspezifikation.md`](B1-dialogspezifikation.md) |
| B2       | Batchverarbeitung   |      ⛔ | –                                                        |
| B3       | Druckausgabe        |      ⛔ | –                                                        |

### 5. Schnittstellen zu Nachbar- und Altsystemen

| Baustein | Bezeichnung                       | Status | Datei                                          |
| -------- | --------------------------------- | -----: | ---------------------------------------------- |
| S1       | Schnittstellen zu Nachbarsystemen |     🛠 | [`S1-nachbarsysteme.md`](S1-nachbarsysteme.md) |
| S2       | Datenmigration                    |      ⛔ | –                                              |
| S3       | Inbetriebnahme und Bereitstellung |     🛠 | [`S3-inbetriebnahme.md`](S3-inbetriebnahme.md) |

### 6. Übergreifende Aspekte

| Baustein | Bezeichnung                    | Status | Datei                                                      |
| -------- | ------------------------------ | -----: | ---------------------------------------------------------- |
| N1       | Nichtfunktionale Anforderungen |     🛠 | [`N1-nichtfunktional.md`](N1-nichtfunktional.md)           |
| N2       | Querschnittskonzepte           |     🛠 | [`N2-querschnittskonzepte.md`](N2-querschnittskonzepte.md) |

### 7. Ergänzende Bausteine

| Baustein | Bezeichnung   | Status | Datei                            |
| -------- | ------------- | -----: | -------------------------------- |
| E1       | Leseleitfaden |      ✅ | Dieses Dokument                  |
| E2       | Glossar       |     🛠 | [`E2-glossar.md`](E2-glossar.md) |

---

## Nicht relevante Bausteine

Die folgenden Bausteine des Bausteinmodells nach Siedersleben werden für das Lifeline-Projekt nicht ausgearbeitet. Die Gründe werden dokumentiert, damit nachvollziehbar ist, dass diese Bausteine bewusst ausgeschlossen wurden.

### B2 – Batchverarbeitung

Lifeline ist als interaktive Anwendung vorgesehen. Die Benutzerinnen und Benutzer führen Aktionen wie das Anlegen, Bearbeiten und Anzeigen von Ereignissen, Meilensteinen, Zielen und Erinnerungen unmittelbar über die Benutzeroberfläche aus.

Eine Verarbeitung großer Datenmengen in automatisierten, zeitlich gebündelten Stapelläufen ist im derzeit vorgesehenen Funktionsumfang nicht erforderlich.

Die konkrete technische Umsetzung zeitabhängiger Erinnerungen wird im Architekturdokument beschrieben. Erinnerungen allein stellen nicht automatisch eine Batchverarbeitung dar.

### B3 – Druckausgabe

Für Lifeline sind derzeit keine speziell für den Druck erzeugten Berichte, PDF-Dokumente oder sonstigen Druckausgaben vorgesehen.

Die Inhalte werden innerhalb der Anwendung dargestellt. Sollte später eine Export- oder Druckfunktion ergänzt werden, muss dieser Baustein erneut geprüft und gegebenenfalls aufgenommen werden.

### S2 – Datenmigration

Lifeline wird als neues System ohne ein bestehendes Vorgängersystem entwickelt. Daher müssen keine vorhandenen Daten aus einem Altsystem übernommen oder in ein neues Datenformat migriert werden.

Die Anwendung startet bei der ersten Verwendung mit einer neuen beziehungsweise leeren Datenbank. Beispieldaten, die möglicherweise für Entwicklung, Vorführung oder Tests angelegt werden, gelten nicht als Migration aus einem Altsystem.
