# Lifeline

Lifeline ist eine interaktive Timeline-Webanwendung zur visuellen Darstellung
persönlicher Meilensteine, Ziele und Ereignisse. Nutzer:innen können Events
organisieren, kategorisieren und Erinnerungen verwalten. Der Fokus des
Projekts liegt auf moderner UI, Benutzerfreundlichkeit und interaktiver
Visualisierung.

## Features

- Anlegen, Bearbeiten und Löschen persönlicher Lebensereignisse
- Kategorisierung von Events
- Interaktive Timeline-Ansicht
- Verwaltung von Erinnerungen
- Export der Timeline als Bild
- Benutzerregistrierung und Anmeldung

## Tech-Stack

**Backend**
- Node.js mit Express und TypeScript
- Datenbank: SQLite über das eingebaute `node:sqlite`-Modul (kein separater
  Datenbankserver nötig, die Datenbank liegt als Datei unter `backend/data/`)

**Frontend**
- React mit Vite und TypeScript
- Tailwind CSS
- Icons: lucide-react
- Timeline-Export: html2canvas

## Voraussetzungen

- Node.js 22.x ab Version 22.13.0 oder Node.js 24.x
- npm, Git und ein aktueller Webbrowser

## Einrichtung

Alle Befehle im Projektordner `lifeline-project` ausführen.

Abhängigkeiten installieren:

```bash
npm --prefix backend install
npm --prefix frontend install
```

Bei der ersten Einrichtung die Konfigurationsvorlagen kopieren.
Bereits vorhandene `.env`-Dateien weiterverwenden.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

In `backend/.env` für `SESSION_SECRET` einen eigenen langen,
zufälligen Schlüssel eintragen. Die `.env`-Dateien nicht committen.

Anschließend die lokale Datenbank einrichten:

```bash
npm --prefix backend run migrate
```

Dabei wird das Datenbankschema angewendet und die SQLite-Datenbankdatei
angelegt (Standardpfad: `backend/data/lifeline.db`).

## Start

Zwei Terminals im Projektordner öffnen.

Backend in Terminal 1 starten:

```bash
npm --prefix backend run dev
```

Frontend in Terminal 2 starten:

```bash
npm --prefix frontend run dev
```

Mit der Standardkonfiguration ist die Anwendung unter
http://localhost:5173 erreichbar. Das Backend verwendet Port 3000.
Beide Terminals während der Nutzung geöffnet lassen.

## Anmeldung

Zum Testen über die Registrierung ein eigenes Konto erstellen
und anschließend damit anmelden.

## Dokumentation

- [Spezifikation](docs/spec/)
- [Architektur](docs/arch/)
- [Inbetriebnahme](docs/betrieb/S3-inbetriebnahme.md)
