# P1 – Ziele und Rahmenbedingungen

## P1.1 Mission

**Lifeline** ist eine webbasierte Anwendung zur zentralen Erfassung, Verwaltung und chronologischen Darstellung persönlicher Lebensereignisse.

Die Anwendung ermöglicht es Nutzerinnen und Nutzern, wichtige Ereignisse, Ziele, Meilensteine und Erinnerungen an einem zentralen Ort zu dokumentieren und deren zeitlichen Zusammenhang über eine interaktive Timeline nachvollziehbar darzustellen.

Lifeline soll damit eine übersichtliche und intuitive Möglichkeit schaffen, persönliche Ereignisse strukturiert entlang einer Zeitachse zu erfassen und wiederzufinden.

---

## P1.2 Projektziele

| ID   | Ziel                                                                                    |
| ---- | --------------------------------------------------------------------------------------- |
| G-01 | Persönliche Ereignisse zentral und strukturiert erfassen.                               |
| G-02 | Ereignisse chronologisch und übersichtlich auf einer interaktiven Timeline darstellen.  |
| G-03 | Nutzerinnen und Nutzern die Verwaltung ihrer eigenen Timeline-Einträge ermöglichen.     |
| G-04 | Zeitliche Zusammenhänge zwischen persönlichen Ereignissen verständlich sichtbar machen. |
| G-05 | Eine intuitive und nachvollziehbare Bedienung der Anwendung ermöglichen.                |
| G-06 | Eine technisch erweiterbare Grundlage für zukünftige Funktionen schaffen.               |

---

## P1.3 Zielgruppe und Benutzerrollen

Die Anwendung richtet sich an Personen, die persönliche Ereignisse, Ziele, Meilensteine oder Erinnerungen chronologisch dokumentieren und übersichtlich betrachten möchten.

Für den aktuellen Projektumfang ist eine Benutzerrolle vorgesehen:

| Rolle     | Beschreibung                                                                  |
| --------- | ----------------------------------------------------------------------------- |
| Nutzer/in | Registriert sich, meldet sich an und verwaltet die eigenen Timeline-Einträge. |

Jeder Timeline-Eintrag wird einem Benutzerkonto zugeordnet. Nutzerinnen und Nutzer dürfen ausschließlich auf ihre eigenen Einträge zugreifen.

---

## P1.4 Projektumfang

### Im Umfang

Zum verbindlichen Projektumfang gehören die fachlichen Anwendungsfälle, die in **F2 – Anwendungsfälle** beschrieben sind.

Der dort definierte MVP bildet den verbindlichen funktionalen Umfang von Lifeline. P1 beschreibt bewusst nicht nochmals die einzelnen Funktionen der Anwendung; deren detaillierte Beschreibung erfolgt in F2.

### Außerhalb des verbindlichen MVP

Funktionen, die nicht Bestandteil der in F2 definierten MVP-Anwendungsfälle sind, gelten nicht automatisch als verbindlicher Bestandteil des Projekts.

Mögliche Erweiterungen können beispielsweise statistische Auswertungen, zusätzliche Medien, Erinnerungen, Im- und Exportfunktionen oder eine gemeinsame Nutzung von Timelines umfassen. Solche Erweiterungen werden getrennt betrachtet und verändern den verbindlichen MVP-Umfang nicht automatisch.

---

## P1.5 Constraints

Die verbindlichen Rahmenbedingungen des Projekts werden durch eindeutig vergebene Constraint-IDs beschrieben.

| ID     | Constraint                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------------- |
| CON-01 | Lifeline wird als webbasierte Anwendung umgesetzt.                                                                      |
| CON-02 | Die Anwendung verwendet eine zentrale persistente Datenhaltung für die persönlichen Timeline-Daten.                     |
| CON-03 | Timeline-Einträge werden eindeutig einem Benutzerkonto zugeordnet.                                                      |
| CON-04 | Nutzerinnen und Nutzer dürfen ausschließlich auf ihre eigenen Timeline-Einträge zugreifen.                              |
| CON-05 | Die Anwendung wird über einen modernen Webbrowser verwendet.                                                            |
| CON-06 | Die Anwendung wird als Full-Stack-Anwendung mit getrenntem Frontend und Backend umgesetzt.                              |
| CON-07 | Die Entwicklung und Dokumentation erfolgen innerhalb der vorgegebenen Projektbedingungen und im gemeinsamen Repository. |

Die ausführliche Beschreibung und Begründung der Constraints befindet sich in **P1-constraints.md**.

Technische Detailentscheidungen wie konkrete Framework-Versionen, Bibliotheken oder Implementierungsdetails gehören nicht in P1, sondern werden in der Architektur dokumentiert.

---

## P1.6 Erfolgskriterien

| ID    | Erfolgskriterium                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------- |
| SC-01 | Nutzerinnen und Nutzer können die Anwendung über einen Webbrowser verwenden.                        |
| SC-02 | Die im MVP definierten Anwendungsfälle können vollständig durchgeführt werden.                      |
| SC-03 | Persönliche Timeline-Einträge werden korrekt dem jeweiligen Benutzerkonto zugeordnet.               |
| SC-04 | Die gespeicherten Ereignisse werden chronologisch und nachvollziehbar auf der Timeline dargestellt. |
| SC-05 | Die zentralen Nutzungsvorgänge werden durch geeignete Tests überprüft.                              |
| SC-06 | Spezifikation und Architektur sind konsistent mit den im MVP definierten Anwendungsfällen.          |

---

## P1.7 Annahmen

| ID    | Annahme                                                                                              |
| ----- | ---------------------------------------------------------------------------------------------------- |
| AS-01 | Die Anwendung wird über einen modernen Webbrowser genutzt.                                           |
| AS-02 | Nutzerinnen und Nutzer erfassen ihre persönlichen Ereignisse selbst.                                 |
| AS-03 | Die für die Nutzung und Entwicklung erforderlichen technischen Voraussetzungen stehen zur Verfügung. |
| AS-04 | Die in F2 definierten MVP-Anwendungsfälle bilden den verbindlichen funktionalen Umfang des Projekts. |

---

## P1.8 Risiken

| ID   | Risiko                                                                                    | Gegenmaßnahme                                                                                 |
| ---- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| R-01 | Änderungen am MVP können zu Inkonsistenzen zwischen Spezifikation und Architektur führen. | Änderungen werden in den betroffenen Spezifikations- und Architekturbausteinen nachvollzogen. |
| R-02 | Unterschiedliche Beschreibungen derselben Funktion können zu Widersprüchen führen.        | Use Cases, Daten, Dialoge und Architektur werden regelmäßig auf Konsistenz geprüft.           |
| R-03 | Zusätzliche Funktionen können den verbindlichen MVP unnötig erweitern.                    | Erweiterungen werden vom verbindlichen MVP getrennt dokumentiert.                             |

---

## P1.9 Freigabe und Versionierung

Änderungen an den Zielen, dem Umfang oder den verbindlichen Rahmenbedingungen werden versioniert dokumentiert.

| Version | Status                                |
| ------- | ------------------------------------- |
| 0.1     | Entwurf                               |
| 0.2     | Überarbeitet nach Review und Feedback |
| 1.0     | Freigegebene Version                  |
