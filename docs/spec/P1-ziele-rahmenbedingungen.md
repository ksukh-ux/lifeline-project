# P1 – Ziele und Rahmenbedingungen

## 1. Dokumentzweck

Dieses Dokument beschreibt die Ziele, den vorgesehenen Nutzen und die wesentlichen Rahmenbedingungen des Softwareprojekts **Lifeline**. Es bildet die fachliche Grundlage für die nachfolgenden Spezifikationsbausteine und grenzt den geplanten Projektumfang ab.

## 2. Ausgangssituation und Problemstellung

Persönliche Ziele, wichtige Ereignisse, Meilensteine und Erinnerungen werden häufig in unterschiedlichen Anwendungen oder Dokumenten festgehalten. Dadurch fehlt eine zentrale und übersichtliche Darstellung, aus der zeitliche Zusammenhänge und persönliche Fortschritte unmittelbar hervorgehen.

Lifeline soll diese Informationen in einer gemeinsamen, chronologisch aufgebauten Timeline zusammenführen. Nutzerinnen und Nutzer sollen dadurch vergangene Ereignisse, aktuelle Vorhaben und zukünftige Ziele übersichtlich erfassen und betrachten können.

## 3. Projektziel

Ziel des Projekts ist die Entwicklung einer webbasierten Anwendung, mit der persönliche Einträge auf einer interaktiven Timeline angelegt, dargestellt und verwaltet werden können.

Die Anwendung soll insbesondere:

- zeitbezogene Informationen übersichtlich visualisieren,
- persönliche Meilensteine, Ziele und Erinnerungen an einer zentralen Stelle bündeln,
- eine intuitive Navigation entlang der Timeline ermöglichen,
- Einträge mit den zugehörigen Informationen verständlich darstellen und
- als technisch nachvollziehbarer und erweiterbarer Prototyp umgesetzt werden.

## 4. Nutzen

Lifeline unterstützt Nutzerinnen und Nutzer dabei, ihre persönliche Entwicklung und Planung strukturiert nachzuvollziehen. Der zentrale Nutzen liegt in der visuellen Verbindung einzelner Einträge mit ihrem zeitlichen Kontext. Dadurch können Zusammenhänge schneller erkannt und wichtige Ereignisse leichter wiedergefunden werden.

## 5. Zielgruppe und Benutzerrollen

### 5.1 Zielgruppe

Die Anwendung richtet sich an Personen, die persönliche Ereignisse, Ziele, Meilensteine oder Erinnerungen chronologisch dokumentieren und übersichtlich betrachten möchten.

### 5.2 Benutzerrollen

Für den ersten Projektumfang wird zunächst folgende Rolle angenommen:

| Rolle | Beschreibung |
| --- | --- |
| Nutzerin/Nutzer | Erstellt, betrachtet und verwaltet eigene Timeline-Einträge. |

Eine Anmeldung mit getrennten Benutzerkonten ist erforderlich.

## 6. Vorgesehener Funktionsumfang

Zum grundlegenden Funktionsumfang gehören:

- Darstellung einer chronologisch aufgebauten Timeline,
- Anzeige persönlicher Einträge auf der Timeline,
- Anlegen neuer Einträge,
- Bearbeiten vorhandener Einträge,
- Löschen vorhandener Einträge,
- Zuordnung eines Datums oder Zeitraums zu einem Eintrag,
- Erfassung eines Titels und einer Beschreibung sowie
- interaktive Anzeige zusätzlicher Informationen zu einem Eintrag, beispielsweise beim Anklicken oder Überfahren,
- Zuordnung einer Kategorie zu einem Eintrag sowie Filterung der Timeline nach Kategorie,
- Benutzerkonten mit Registrierung und Login, sodass jede Person nur die eigenen Einträge sieht,
- aggregierte statistische Auswertung der Einträge nach Kategorie.

Folgende Funktionen sind weiterhin als mögliche Erweiterungen anzusehen und gehören nur nach ausdrücklicher Abstimmung zum verbindlichen Umfang:

- separate Detailseiten für einzelne Ereignisse,
- Erinnerungs- oder Benachrichtigungsfunktionen,
- Medienanhänge,
- Export der Timeline als Bild (bereits im Frontend umgesetzt),
- gemeinsame oder öffentlich teilbare Timelines.

## 7. Abgrenzung

Lifeline ist im Rahmen des Projekts als funktionsfähiger Webanwendungs-Prototyp vorgesehen. Die Anwendung erhebt zunächst nicht den Anspruch, ein vollständiges Kalender-, Aufgabenmanagement- oder soziales Netzwerk zu ersetzen.

Ohne zusätzliche Vereinbarung sind insbesondere nicht Bestandteil des ersten Projektumfangs:

- native Apps für iOS oder Android,
- komplexe soziale Funktionen,
- externe Kalender-Synchronisation,
- automatische KI-gestützte Auswertung persönlicher Inhalte,
- produktiver Betrieb für eine große Anzahl gleichzeitiger Nutzerinnen und Nutzer sowie
- kostenpflichtige Dienste oder kommerzielle Vermarktung.

## 8. Rahmenbedingungen

### 8.1 Organisatorische Rahmenbedingungen

- Das Projekt wird im Modul **Wirtschaftsinformatik Projekt 1** durchgeführt.
- Das Projektteam besteht aus vier Personen.
- Die fachliche Betreuung erfolgt durch **Prof. Carsten Lucke**.
- Die Projektarbeit und Aufgabenverteilung werden innerhalb des Teams abgestimmt.
- Änderungen am vereinbarten Umfang sollen dokumentiert und gemeinsam beschlossen werden.

### 8.2 Technische Rahmenbedingungen

- Umsetzung als Webanwendung,
- Frontend mit React, TypeScript und Vite,
- Backend mit Node.js, TypeScript und Express,
- SQLite als eingebettete Datenbank ohne separaten Datenbankserver,
- Versionsverwaltung mit Git und GitHub,
- Entwicklung unter anderem mit Visual Studio Code,
- nachvollziehbare Versionshistorie durch Conventional Commits,
- Bereitstellung als ein gemeinsames Deployment bei Railway und
- Dokumentation der Anforderungen und technischen Entscheidungen im Repository.

### 8.3 Qualitätsbezogene Rahmenbedingungen

Die Anwendung soll:

- verständlich und möglichst intuitiv bedienbar sein,
- Daten korrekt und nachvollziehbar verarbeiten,
- eine konsistente Benutzeroberfläche besitzen,
- modular und erweiterbar aufgebaut sein und
- durch geeignete Tests überprüfbar sein.

## 9. Annahmen und Abhängigkeiten

Für die derzeitige Planung gelten folgende Annahmen:

- Die Anwendung wird über einen modernen Webbrowser verwendet.
- Einträge werden durch die Nutzerinnen und Nutzer selbst erfasst.
- Die für die Entwicklung notwendigen Werkzeuge stehen dem Projektteam zur Verfügung.
- Der genaue Funktionsumfang wird anhand der offiziellen Aufgabenstellung und der Abstimmung mit dem Betreuer verbindlich festgelegt.
- Die rechtzeitige Fertigstellung hängt von einer klaren Aufgabenverteilung und regelmäßigen Abstimmungen innerhalb des Teams ab.

## 10. Erfolgskriterien

Das Projekt gilt fachlich als erfolgreich, wenn mindestens folgende Kriterien erfüllt sind:

1. Die Webanwendung kann gestartet und über einen Browser verwendet werden.
2. Timeline-Einträge können angelegt, angezeigt, bearbeitet und gelöscht werden.
3. Jeder Eintrag wird dem vorgesehenen Datum beziehungsweise Zeitraum korrekt zugeordnet.
4. Die Einträge werden in einer verständlichen chronologischen Darstellung angezeigt.
5. Die zentralen Nutzungsvorgänge sind anhand definierter Testfälle erfolgreich überprüft.
6. Quellcode und Projektdokumentation sind im Repository nachvollziehbar versioniert.
7. Die Muss-Anforderungen aus der noch abzugleichenden offiziellen Aufgabenstellung sind erfüllt.

## 11. Offene Abstimmungspunkte

Vor der Freigabe dieses Bausteins sind folgende Punkte zu klären:

- Abgleich aller Inhalte mit dem Ticket- beziehungsweise Aufgabenstellungsdokument und
- Bestätigung der messbaren Erfolgskriterien durch das Projektteam.

## 12. Freigabe

| Version | Datum | Status | Verantwortlich |
| --- | --- | --- | --- |
| 0.1 | 01.08.2026 | Entwurf – noch mit Aufgabenstellung abzugleichen | Projektteam Lifeline |

