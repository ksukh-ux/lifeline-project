# S3 – Inbetriebnahme und Bereitstellung

Die Lifeline-Anwendung kann lokal für die Entwicklung sowie als einzelne Anwendung für eine Demo- oder Produktionsumgebung betrieben werden.

## S3.1 Entwicklungsumgebung

Für die lokale Entwicklung werden Frontend, Backend und Datenbank auf dem Entwicklungsrechner betrieben.

### Frontend

Das Frontend basiert auf React, TypeScript und Vite.

Der Entwicklungsserver wird mit `npm run dev` gestartet und stellt die Anwendung lokal im Browser bereit.

### Backend

Das Backend basiert auf Node.js und Express.

Der Backend-Prozess wird lokal über `npm run dev` gestartet und stellt die API über einen lokalen Port bereit.

### Datenbank

Als Datenbank wird SQLite verwendet.

Die SQLite-Datenbank wird lokal als Datei im Projektverzeichnis gespeichert.

### Voraussetzungen

Für den lokalen Betrieb muss Node.js installiert sein.

Docker ist für den Betrieb der Anwendung nicht erforderlich.

---

## S3.2 Zielumgebung

Für eine Demo- oder Produktionsumgebung wird Lifeline auf einem einzelnen Anwendungsserver betrieben.

Auf diesem Server laufen:

- der Express-Prozess,
- das gebaute Frontend,
- die SQLite-Datenbank.

Der Browser der Nutzer:in greift über HTTPS auf den Anwendungsserver zu.

Das Backend stellt dabei sowohl die API als auch das gebaute Frontend bereit.

---

## S3.3 Bereitstellungsstruktur

Die Anwendung wird als ein gemeinsames Deployment bereitgestellt.

```text
Nutzer:in
    |
    | HTTPS
    v
Anwendungsserver
    |
    +-- Express / Node.js
    |     +-- REST-API
    |     +-- gebautes React-Frontend
    |
    +-- SQLite-Datenbank
```

## S3.4 Laufzeitkonfiguration

Die Laufzeitkonfiguration erfolgt über Umgebungsvariablen.

Verwendet werden insbesondere:

| Einstellung | Zweck |
|---|---|
| `PORT` | Port, auf dem der Express-Server lauscht |
| `DATABASE_PATH` | Pfad zur SQLite-Datenbank |
| `SESSION_SECRET` | Signaturschlüssel für Sessions |
| `NODE_ENV` | Laufzeitumgebung, z. B. `development` oder `production` |

Konkrete Werte werden nicht in das Repository eingecheckt. Die Werte werden lokal beziehungsweise in der jeweiligen Hosting-Umgebung konfiguriert.

---

## S3.5 Inbetriebnahme

Für die lokale Inbetriebnahme sind folgende Schritte erforderlich:

1. Node.js installieren.
2. Abhängigkeiten des Projekts installieren.
3. Die benötigten Umgebungsvariablen konfigurieren.
4. Frontend und Backend mit `npm run dev` starten.
5. Die Anwendung über den lokalen Browser aufrufen.

Für die Zielumgebung wird das Frontend gebaut und zusammen mit dem Express-Prozess auf dem Anwendungsserver bereitgestellt.

Die SQLite-Datenbank wird auf demselben Server betrieben.