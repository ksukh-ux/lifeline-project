# P2 – Architekturüberblick

## 1. Zweck

Dieses Dokument beschreibt die geplante technische Grundstruktur der Webanwendung **Lifeline**. Es gibt einen Überblick über die zentralen Systembestandteile, deren Aufgaben und ihr Zusammenspiel. Detaillierte Architekturdiagramme und technische Einzelentscheidungen werden bei Bedarf separat unter `docs/arch/` dokumentiert.

## 2. Systemüberblick

Lifeline wird als browserbasierte Webanwendung umgesetzt. Nutzerinnen und Nutzer können persönliche Ziele, Ereignisse und Meilensteine in einer interaktiven Timeline erfassen, anzeigen und verwalten.

Die Anwendung wird in drei Hauptbereiche gegliedert:

1. **Frontend** für Darstellung und Bedienung,
2. **Backend** für Anwendungslogik und Datenzugriff,
3. **Datenbank** für die dauerhafte Speicherung der Daten.

Die konkrete Realisierung dieser drei Bausteine (Technologiewahl, Verantwortlichkeiten, Schnittstellen) ist Teil der Architekturdokumentation und dort in ADR-001 bis ADR-003 sowie in der Bausteinsicht beschrieben (`docs/arch/A05-Bausteinansicht.md`, `docs/arch/A09-Architekturentscheidungen.md`).

## 3. Systemkontext

Die Nutzerinnen und Nutzer greifen über einen Webbrowser auf Lifeline zu. Die Bedienung erfolgt über das Frontend. Das Frontend sendet Anfragen an das Backend, welches die Eingaben verarbeitet und die benötigten Daten in der Datenbank speichert oder daraus abruft.

In der ersten Projektphase sind keine zwingend erforderlichen externen Systeme vorgesehen. Mögliche spätere Schnittstellen, beispielsweise für Benachrichtigungen oder Kalenderfunktionen, werden erst nach einer Abstimmung im Team berücksichtigt.

## 4. Zusammenspiel der Bestandteile

Der grundlegende Ablauf ist wie folgt vorgesehen:

1. Eine Nutzerin oder ein Nutzer führt im Browser eine Aktion aus, beispielsweise das Anlegen eines Meilensteins.
2. Das React-Frontend erfasst die Eingabe und sendet eine Anfrage an die API des Backends.
3. Das Express-Backend prüft und verarbeitet die übermittelten Daten.
4. Das Backend speichert die Daten in SQLite oder liest vorhandene Daten daraus aus.
5. Das Backend sendet das Ergebnis an das Frontend zurück.
6. Das Frontend aktualisiert die angezeigte Timeline.

Die Kommunikation zwischen Frontend und Backend soll über eine HTTP-basierte API erfolgen. Das genaue API-Design wird später festgelegt.

## 5. Projekt- und Codeorganisation

Frontend und Backend sollen klar voneinander getrennt, aber im gemeinsamen Git-Repository verwaltet werden. Die Projektstruktur ist:

```text
lifeline-project/
├── frontend/
├── backend/
├── docs/
│   ├── spec/
│   └── arch/
└── README.md
```

`frontend/` ist bereits angelegt, `backend/` folgt mit der Backend-Implementierung.

## 6. Externe Systeme und Schnittstellen

Für die erste Version sind zunächst keine externen Systeme zwingend vorgesehen. Folgende Erweiterungen sind denkbar, aber noch nicht Bestandteil des verbindlichen Umfangs:

- Kalenderanbindung,
- E-Mail- oder Push-Benachrichtigungen,
- Export oder Import von Timeline-Daten,
- externe Authentifizierungsdienste.

Solche Erweiterungen werden nur umgesetzt, wenn sie mit der Aufgabenstellung, dem verfügbaren Zeitrahmen und dem Team abgestimmt wurden.

## 7. Offene Architekturentscheidungen

Folgende Punkte müssen noch im Team und gegebenenfalls mit dem Betreuer abgestimmt werden:

- genaue API-Struktur und Benennung der Endpunkte und
- konkrete Gestaltung und Responsivität der Benutzeroberfläche.

## 8. Festgelegter Technologiestack

| Bereich | Vorgesehene Technologie | Status |
|---|---|---|
| Frontend | React, TypeScript und Vite | festgelegt |
| Gestaltung | CSS mit Tailwind CSS | festgelegt |
| Backend | Node.js, TypeScript und Express | festgelegt |
| Datenbank | SQLite | festgelegt |
| Entwicklungsumgebung | Visual Studio Code | festgelegt |
| Versionsverwaltung | Git und GitHub | festgelegt |
| UI-Prototyping | möglicherweise Claude/Artifacts | optional, noch zu prüfen |

## 9. Abgrenzung

Dieser Architekturüberblick beschreibt den gegenwärtig geplanten technischen Aufbau auf einer groben Ebene. Er ersetzt weder ein detailliertes Datenmodell noch eine vollständige Beschreibung der API oder der einzelnen Komponenten. Änderungen können sich durch die weitere Anforderungsanalyse und die Abstimmung im Projektteam ergeben.

Sicherheits- und Datenschutzaspekte sind nicht Gegenstand dieses Überblicks, sondern Teil der Architekturdokumentation (`docs/arch/A02-Architekturbeschränkungen.md`, `docs/arch/A08-Querschnittskonzepte.md`).
