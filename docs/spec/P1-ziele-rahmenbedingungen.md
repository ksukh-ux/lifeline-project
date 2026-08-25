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

Für den aktuellen Projektumfang wird folgende Benutzerrolle vorgesehen:

| Rolle | Beschreibung |
| --- | --- |
| Nutzerin/Nutzer | Registriert sich, meldet sich an und erstellt, betrachtet und verwaltet eigene Timeline-Einträge. |

Alle Events werden einem Benutzerkonto zugeordnet. Nutzer:innen dürfen ausschließlich auf ihre eigenen Events zugreifen.

## 6. Vorgesehener Funktionsumfang

Der vorgesehene Funktionsumfang der Lifeline-Anwendung konzentriert sich auf die
Erfassung, Verwaltung und chronologische Darstellung persönlicher Ereignisse.

Nutzerinnen und Nutzer sollen Ereignisse über die Benutzeroberfläche anlegen,
betrachten, bearbeiten und löschen können. Die Ereignisse werden chronologisch
auf einer horizontalen Zeitleiste dargestellt und können anhand ihrer Kategorie
gefiltert werden.

Zum grundlegenden Funktionsumfang gehören:

- Darstellung einer chronologisch aufgebauten horizontalen Zeitleiste,
- Anzeige persönlicher Ereignisse auf der Zeitleiste,
- Anlegen neuer Ereignisse,
- Bearbeiten vorhandener Ereignisse,
- Löschen einzelner Ereignisse,
- Löschen aller Ereignisse nach einer vorherigen Bestätigung,
- Zuordnung eines Datums oder Zeitraums zu einem Ereignis,
- Erfassung eines Titels und einer Beschreibung,
- Zuordnung einer Kategorie zu einem Ereignis,
- Filterung der Zeitleiste nach Kategorien,
- Festlegung und Anzeige der persönlichen Bedeutung eines Ereignisses,
- interaktive Anzeige zusätzlicher Informationen zu einem Ereignis,
- horizontale Navigation innerhalb der Zeitleiste,
- Validierung verpflichtender Eingabefelder,
- Übertragung der Ereignisdaten zwischen Frontend und Backend über eine
  REST-Schnittstelle sowie
- dauerhafte Speicherung der Ereignisse in einer SQLite-Datenbank.

Weiterführende Funktionen können im Projektverlauf als Erweiterungen umgesetzt
werden. Dazu gehören insbesondere:

- aggregierte statistische Auswertungen der Ereignisse,
- Zuordnung eines oder mehrerer Bilder zu einem Ereignis,
- separate Detailseiten für einzelne Ereignisse,
- Erinnerungs- und Benachrichtigungsfunktionen,
- Import und Export einer Datensicherung,
- Export der Zeitleiste als Bild,
- weitere Medienanhänge wie Videos oder Audiodateien sowie
- gemeinsame oder öffentlich teilbare Timelines.

Die konkrete Abgrenzung zwischen dem verbindlichen MVP und den optionalen
Erweiterungen wird in Abschnitt 7 beschrieben. Bereits umgesetzte
Zusatzfunktionen können Bestandteil der Anwendung bleiben, ohne dadurch
automatisch zu Muss-Funktionen des MVP zu werden.

## 7. Abgrenzung des Minimum Viable Product (MVP)

Das Minimum Viable Product (MVP) der Lifeline-Anwendung beschreibt den kleinsten
verbindlichen und funktionsfähigen Projektumfang. Mit diesem Umfang können
persönliche Lebensereignisse erfasst, verwaltet und chronologisch auf einer
interaktiven Zeitleiste dargestellt werden.

Ziel des MVP ist die Umsetzung eines durchgängigen Full-Stack-Prozesses.
Ereignisse werden über die Benutzeroberfläche erfasst, über eine
REST-Schnittstelle an das Backend übertragen und dauerhaft in einer
SQLite-Datenbank gespeichert. Gespeicherte Ereignisse werden anschließend über
die REST-Schnittstelle abgerufen und im Frontend auf der Zeitleiste dargestellt.

### 7.1 Verbindlicher Funktionsumfang

Das MVP umfasst folgende Muss-Funktionen:

- chronologische Darstellung persönlicher Ereignisse auf einer horizontalen
  Zeitleiste,
- Erstellen neuer Ereignisse,
- Anzeigen und Bearbeiten vorhandener Ereignisse,
- Löschen einzelner Ereignisse,
- Löschen aller Ereignisse nach einer vorherigen Bestätigung,
- Erfassung eines Titels, eines Datums oder Zeitraums, einer Beschreibung und
  einer Kategorie,
- Festlegung und Anzeige der persönlichen Bedeutung eines Ereignisses,
- Filterung der Ereignisse nach Kategorien,
- horizontale Navigation innerhalb der Zeitleiste,
- Validierung verpflichtender Eingabefelder,
- Registrierung und Anmeldung von Nutzerinnen und Nutzern,
- Zuordnung der Ereignisse zu einem Benutzerkonto,
- Übertragung der Ereignisdaten zwischen Frontend und Backend über eine
  REST-Schnittstelle sowie
- dauerhafte Speicherung der Ereignisse in einer SQLite-Datenbank.

Das Frontend wird mit React und TypeScript umgesetzt. Das Backend wird mit
Node.js, TypeScript und Express entwickelt. Die derzeitige Speicherung im
`localStorage` dient ausschließlich als Zwischenlösung für den
UI-Prototyp und wird im vollständigen MVP durch die Anbindung an das Backend und
die SQLite-Datenbank ersetzt.

### 7.2 Abgrenzung zu Erweiterungen

Folgende Funktionen können den Funktionsumfang der Anwendung erweitern, sind
jedoch nicht erforderlich, um den beschriebenen MVP-Kern zu erfüllen:

- statistische Auswertungen der Ereignisse,
- Hochladen und Anzeigen von Bildern,
- Import und Export einer Datensicherung,
- Export der Zeitleiste als Bild,
- Erinnerungen und Benachrichtigungen,
- Synchronisation zwischen mehreren Geräten,
- individuelle Kategorien sowie
- öffentliche oder gemeinsam verwendete Timelines.

Bereits implementierte Zusatzfunktionen können Bestandteil der Anwendung
bleiben, gelten jedoch nicht automatisch als Voraussetzung für die Erfüllung
des MVP.

Der dargestellte MVP-Umfang bildet den verbindlichen funktionalen Kern der
Lifeline-Anwendung. Im weiteren Projektverlauf können zusätzliche Funktionen
und gestalterische Verbesserungen umgesetzt werden. Diese Erweiterungen
verändern den definierten MVP-Umfang nicht automatisch, sondern werden
gesondert dokumentiert und hinsichtlich ihrer Auswirkungen auf Spezifikation
und Architektur geprüft.

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

Die Spezifikation wurde zunächst als fachlicher Entwurf erstellt. Auf dieser
Grundlage wurde ein erster MVP-Prototyp der Lifeline-Anwendung entwickelt.

Im weiteren Projektverlauf wurden die Anforderungen anhand der Erkenntnisse aus
der Implementierung konkretisiert. Dabei wurde zwischen dem verbindlichen
Funktionsumfang des MVP und weiterführenden Erweiterungen unterschieden.
Änderungen am Funktionsumfang werden weiterhin im Projektteam abgestimmt und im
Repository nachvollziehbar dokumentiert.

| Version | Datum | Status | Verantwortlich |
| --- | --- | --- | --- |
| 0.1 | 01.08.2026 | Entwurf – noch mit Aufgabenstellung abzugleichen | Projektteam Lifeline |
| 0.2 | 21.08.2026 | Überarbeitet – MVP-Abgrenzung ergänzt und an den aktuellen Entwicklungsstand angepasst | Sukhmani Kaur |

