# Lifeline — Frontend

Interaktive Timeline-Webanwendung zur visuellen Darstellung persönlicher Meilensteine, Ziele und Ereignisse.

Dieses MVP setzt das Frontend-Dashboard aus dem [lifeline-project](https://github.com/ksukh-ux/lifeline-project) Architektur-/Team-Setup um (React, TypeScript, Tailwind CSS, Dark-Mode UI, Kategorien & Farben).

## Funktionen

- Interaktive horizontale Timeline mit Kategorie-Farben
- Event-Karten mit Titel, Datum, Beschreibung, Kategorie, Bedeutung (0–100 %)
- Ereignis hinzufügen / bearbeiten / löschen (Modal-Formular)
- Filter nach Kategorie
- Export der Timeline als PNG
- Alle Ereignisse löschen
- Registrierung und Anmeldung
- Persistenz über die Backend-API und SQLite
- JSON-Sicherung exportieren und importieren

## Tech-Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- lucide-react (Icons)
- html2canvas (PNG-Export)

## Setup

```bash
npm install
npm run dev
```

App läuft danach auf `http://localhost:5173`.

```bash
npm run build     # Production-Build nach dist/
npm run preview   # Production-Build lokal testen
```

## Backend

Das Frontend kommuniziert über `src/api/client.ts` mit dem Express-Backend. Für
die Entwicklung müssen Backend und Frontend separat gestartet werden; die
Produktionsauslieferung kann das gebaute Frontend über den Express-Server bedienen.

## Projektstruktur

```
src/
  components/       # Header, Timeline, EventCard, EventFormModal, CategoryFilter
  api/              # HTTP-Client
  hooks/            # historische lokale Speicherhilfe
  types.ts          # LifeEvent, Category, Holiday
  App.tsx
```
