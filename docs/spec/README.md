# Lifeline-Projekt – Spezifikation

Die Spezifikation des Lifeline-Projekts ist nach dem Bausteinmodell von **Johannes Siedersleben** strukturiert. Jeder Baustein beschreibt eine klar abgegrenzte Sicht auf das System und wird in einer eigenen Datei dokumentiert.

Dieses Dokument dient als zentrale Übersicht: Es erläutert das verwendete Modell und verweist auf alle Spezifikationsbausteine.

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

---

## Übersicht der Bausteine

### 1. Projektgrundlagen

| Baustein | Bezeichnung                 | Status | Datei                                                            |
| -------- | ---------------------------- | -----: | ----------------------------------------------------------------- |
| P1       | Ziele und Rahmenbedingungen |     🛠 | [`P1-ziele-rahmenbedingungen.md`](P1-ziele-rahmenbedingungen.md) |
| P2       | Architekturüberblick        |     🛠 | [`P2-architekturüberblick.md`](P2-architekturüberblick.md)     |

### 2. Prozesse und Funktionen

| Baustein | Bezeichnung          | Status | Datei                                                      |
| -------- | --------------------- | -----: | ------------------------------------------------------------ |
| F1       | Geschäftsprozesse    |      — | Entfällt nach Abstimmung mit dem Betreuer; die fachlichen Abläufe sind in F2 beschrieben. |
| F2       | Anwendungsfälle      |     🛠 | [`F2-anwendungsfaelle.md`](F2-anwendungsfaelle.md)         |
| F3       | Anwendungsfunktionen |     🛠 | [`F3-anwendungsfunktionen.md`](F3-anwendungsfunktionen.md) |

### 3. Daten

| Baustein | Bezeichnung     | Status | Datei                                    |
| -------- | ---------------- | -----: | ------------------------------------------ |
| D1       | Datenmodell     |     🛠 | [`D1-datenmodell.md`](D1-datenmodell.md) |
| D2       | Datentypenverzeichnis |     🛠 | [`D2-datentypenverzeichnis.md`](D2-datentypenverzeichnis.md)   |

### 4. Benutzeroberfläche

| Baustein | Bezeichnung         | Status | Datei                                                    |
| -------- | -------------------- | -----: | ----------------------------------------------------------- |
| B1       | Dialogspezifikation |     🛠 | [`B1-dialogspezifikation.md`](B1-dialogspezifikation.md) |

### 5. Schnittstellen zu Nachbar- und Altsystemen

| Baustein | Bezeichnung                       | Status | Datei                                          |
| -------- | ----------------------------------- | -----: | ------------------------------------------------- |
| S1       | Schnittstellen zu Nachbarsystemen |     🛠 | [`S1-nachbarsysteme.md`](S1-nachbarsysteme.md) |
| S3       | Inbetriebnahme und Bereitstellung |     🛠 | [`S3-inbetriebnahme.md`](../betrieb/S3-inbetriebnahme.md) |

### 6. Übergreifende Aspekte

| Baustein | Bezeichnung                    | Status | Datei                                                      |
| -------- | -------------------------------- | -----: | ------------------------------------------------------------ |
| N1       | Nichtfunktionale Anforderungen |     🛠 | [`N1-nichtfunktional.md`](N1-nichtfunktional.md)           |
| N2       | Querschnittskonzepte           |     🛠 | [`N2-querschnittskonzepte.md`](N2-querschnittskonzepte.md) |

### 7. Ergänzende Bausteine

| Baustein | Bezeichnung   | Status | Datei                            |
| -------- | -------------- | -----: | ----------------------------------- |
| E1       | Leseleitfaden |      ✅ | Dieses Dokument                  |
| E2       | Glossar       |     🛠 | [`E2-glossar.md`](E2-glossar.md) |
