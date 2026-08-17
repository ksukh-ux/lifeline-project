# Lifeline — Dashboard MVP

Interaktive Timeline-Webanwendung zur visuellen Darstellung persönlicher Meilensteine, Ziele und Ereignisse.

Dieses MVP setzt das Frontend-Dashboard aus dem [lifeline-project](https://github.com/ksukh-ux/lifeline-project) Architektur-/Team-Setup um (React, TypeScript, Tailwind CSS, Dark-Mode UI, Kategorien & Farben).

## Features (MVP-Umfang)

- Interaktive horizontale Timeline mit Kategorie-Farben
- Event-Karten mit Titel, Datum, Beschreibung, Kategorie, Bedeutung (0–100 %)
- Ereignis hinzufügen / bearbeiten / löschen (Modal-Formular)
- Filter nach Kategorie
- Export der Timeline als PNG
- "Alle Daten löschen"
- Persistenz via `localStorage` (kein Backend nötig für dieses MVP)

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

## Nächste Schritte (Backend-Anbindung)

Aktuell werden Events im Browser-`localStorage` gespeichert. Für die im Team-Setup vorgesehene
Node.js/Express + SQLite-Anbindung:

- `src/hooks/useLocalStorage.ts` durch einen API-Client (fetch/axios) ersetzen bzw. ergänzen
- Express-Routen für `GET/POST/PUT/DELETE /api/events` bereitstellen
- SQLite-Schema passend zu `src/types.ts` (`LifeEvent`) anlegen
- Reminder-System & Progress-Tracking (siehe TEAMINFO.md) als nächste Features

## Projektstruktur

```
src/
  components/       # Header, Timeline, EventCard, EventFormModal, CategoryFilter
  data/             # Beispiel-Events (Startdaten)
  hooks/            # useLocalStorage
  types.ts          # LifeEvent, Category, CATEGORIES
  App.tsx
```
