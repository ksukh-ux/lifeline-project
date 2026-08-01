# P2 – Architekturüberblick

## 1. Zweck

Dieses Dokument beschreibt die geplante technische Grundstruktur der Webanwendung **Lifeline**. Es gibt einen Überblick über die zentralen Systembestandteile, deren Aufgaben und ihr Zusammenspiel. Detaillierte Architekturdiagramme und technische Einzelentscheidungen werden bei Bedarf separat unter `docs/arch/` dokumentiert.

## 2. Systemüberblick

Lifeline wird als browserbasierte Webanwendung umgesetzt. Nutzerinnen und Nutzer können persönliche Ziele, Ereignisse und Meilensteine in einer interaktiven Timeline erfassen, anzeigen und verwalten.

Die Anwendung wird in drei Hauptbereiche gegliedert:

1. **Frontend** für Darstellung und Bedienung,
2. **Backend** für Anwendungslogik und Datenzugriff,
3. **Datenbank** für die dauerhafte Speicherung der Daten.

## 3. Systemkontext

Die Nutzerinnen und Nutzer greifen über einen Webbrowser auf Lifeline zu. Die Bedienung erfolgt über das Frontend. Das Frontend sendet Anfragen an das Backend, welches die Eingaben verarbeitet und die benötigten Daten in der Datenbank speichert oder daraus abruft.

In der ersten Projektphase sind keine zwingend erforderlichen externen Systeme vorgesehen. Mögliche spätere Schnittstellen, beispielsweise für Benachrichtigungen oder Kalenderfunktionen, werden erst nach einer Abstimmung im Team berücksichtigt.

## 4. Hauptbestandteile

### 4.1 Frontend

Das Frontend bildet die sichtbare und bedienbare Oberfläche der Anwendung. Es stellt insbesondere die Timeline, Meilensteine, Ziele, Detailansichten und Eingabeformulare dar.

Für das Frontend sind folgende Technologien vorgesehen:

- **React** zur komponentenbasierten Entwicklung der Benutzeroberfläche,
- **TypeScript** zur typisierten und besser wartbaren Programmierung,
- **Vite** als Entwicklungs- und Build-Werkzeug,
- **CSS** für die Gestaltung der Oberfläche,
- **Visual Studio Code** als Entwicklungsumgebung.

Der Einsatz von Claude beziehungsweise Claude Artifacts kann während der Entwurfsphase zur Erstellung und Erprobung visueller Prototypen geprüft werden. Die eigentliche Implementierung und Verwaltung des Quellcodes erfolgt im gemeinsamen Git-Projekt.

### 4.2 Backend

Das Backend stellt die Verbindung zwischen Frontend und Datenbank her. Es verarbeitet die vom Frontend gesendeten Anfragen, prüft Eingaben und führt die erforderlichen Datenbankoperationen aus.

Für das Backend sind folgende Technologien vorgesehen:

- **Node.js** als Laufzeitumgebung,
- **TypeScript** als Programmiersprache,
- **Express** zur Bereitstellung einer Programmierschnittstelle (API).

Zu den vorgesehenen Aufgaben des Backends gehören:

- Timeline-Einträge abrufen,
- neue Einträge anlegen,
- vorhandene Einträge bearbeiten,
- Einträge löschen,
- Eingaben validieren,
- Daten für das Frontend bereitstellen.

### 4.3 Datenbank

Für die dauerhafte Speicherung der Anwendungsdaten ist **SQLite** vorgesehen. SQLite eignet sich für den geplanten Projektumfang, da die Datenbank ohne separaten Datenbankserver betrieben und in die Anwendung eingebunden werden kann.

Voraussichtlich werden unter anderem folgende Informationen gespeichert:

- Timeline-Einträge,
- Titel und Beschreibungen,
- Datums- und Zeitangaben,
- Kategorien oder Arten von Einträgen,
- Ziele und Meilensteine,
- gegebenenfalls Benutzerinformationen.

Das endgültige Datenmodell wird im weiteren Projektverlauf festgelegt.

## 5. Zusammenspiel der Bestandteile

Der grundlegende Ablauf ist wie folgt vorgesehen:

1. Eine Nutzerin oder ein Nutzer führt im Browser eine Aktion aus, beispielsweise das Anlegen eines Meilensteins.
2. Das React-Frontend erfasst die Eingabe und sendet eine Anfrage an die API des Backends.
3. Das Express-Backend prüft und verarbeitet die übermittelten Daten.
4. Das Backend speichert die Daten in SQLite oder liest vorhandene Daten daraus aus.
5. Das Backend sendet das Ergebnis an das Frontend zurück.
6. Das Frontend aktualisiert die angezeigte Timeline.

Die Kommunikation zwischen Frontend und Backend soll über eine HTTP-basierte API erfolgen. Das genaue API-Design wird später festgelegt.

## 6. Projekt- und Codeorganisation

Frontend und Backend sollen klar voneinander getrennt, aber im gemeinsamen Git-Repository verwaltet werden. Eine mögliche Projektstruktur ist:

```text
lifeline/
├── frontend/
├── backend/
├── docs/
│   ├── spec/
│   └── arch/
└── README.md
```

Die endgültige Ordnerstruktur wird vor Beginn der Implementierung gemeinsam festgelegt.

## 7. Sicherheit und Datenschutz

Da Lifeline persönliche Ziele und Lebensereignisse enthalten kann, müssen Datenschutz und ein angemessener Schutz der gespeicherten Daten berücksichtigt werden.

Vorgesehen sind insbesondere:

- Prüfung und Validierung von Eingaben im Backend,
- kontrollierter Zugriff auf die Datenbank ausschließlich über das Backend,
- Vermeidung unnötiger personenbezogener Daten,
- sichere Behandlung möglicher Anmeldedaten,
- keine Speicherung sensibler Daten ohne fachliche Notwendigkeit.

Ob eine Benutzeranmeldung und die Trennung der Daten mehrerer Nutzer erforderlich sind, ist noch abzustimmen.

## 8. Externe Systeme und Schnittstellen

Für die erste Version sind zunächst keine externen Systeme zwingend vorgesehen. Folgende Erweiterungen sind denkbar, aber noch nicht Bestandteil des verbindlichen Umfangs:

- Kalenderanbindung,
- E-Mail- oder Push-Benachrichtigungen,
- Export oder Import von Timeline-Daten,
- externe Authentifizierungsdienste.

Solche Erweiterungen werden nur umgesetzt, wenn sie mit der Aufgabenstellung, dem verfügbaren Zeitrahmen und dem Team abgestimmt wurden.

## 9. Offene Architekturentscheidungen

Folgende Punkte müssen noch im Team und gegebenenfalls mit dem Betreuer abgestimmt werden:

- genaue API-Struktur und Benennung der Endpunkte,
- endgültiges Datenmodell der SQLite-Datenbank,
- Notwendigkeit einer Benutzerregistrierung und Anmeldung,
- Umfang der Unterstützung mehrerer Nutzer,
- konkrete Gestaltung und Responsivität der Benutzeroberfläche,
- Einsatz zusätzlicher CSS-Bibliotheken wie Tailwind CSS,
- Hosting und Bereitstellung der Anwendung,
- erforderliche externe Schnittstellen,
- endgültige Ordnerstruktur des Projekts.

## 10. Vorläufig festgelegter Technologiestack

| Bereich | Vorgesehene Technologie | Status |
|---|---|---|
| Frontend | React, TypeScript und Vite | vorläufig festgelegt |
| Gestaltung | CSS | vorläufig festgelegt |
| Backend | Node.js, TypeScript und Express | vorläufig festgelegt |
| Datenbank | SQLite | vorläufig festgelegt |
| Entwicklungsumgebung | Visual Studio Code | festgelegt |
| Versionsverwaltung | Git und GitHub | festgelegt |
| UI-Prototyping | möglicherweise Claude/Artifacts | optional, noch zu prüfen |

## 11. Abgrenzung

Dieser Architekturüberblick beschreibt den gegenwärtig geplanten technischen Aufbau auf einer groben Ebene. Er ersetzt weder ein detailliertes Datenmodell noch eine vollständige Beschreibung der API oder der einzelnen Komponenten. Änderungen können sich durch die weitere Anforderungsanalyse und die Abstimmung im Projektteam ergeben.
