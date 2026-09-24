# Lifeline — Frontend

Interaktive Timeline-Webanwendung zur visuellen Darstellung persönlicher Meilensteine, Ziele und Ereignisse.

Dieses Frontend setzt die Benutzeroberfläche aus dem [lifeline-project](https://github.com/ksukh-ux/lifeline-project) Architektur-/Team-Setup um (React, TypeScript, Tailwind CSS, Dark-Mode UI, Kategorien & Farben).

## Funktionen

- Interaktive Timeline mit Übersicht und Jahresansicht, fließendem Wechsel, Zoom und
  gesetzlichen Feiertagen
- Event-Karten mit Titel, Datum, Beschreibung, Kategorie, Bild und Bedeutung (0–100,
  angezeigt als „75 / 100“, keine Prozentangabe)
- Ereignis hinzufügen / bearbeiten / löschen (Formular im Dialogfenster, mit Bildvorschau)
- Filter nach Kategorie und eigene Kategorien anlegen
- Statistik mit Ringdiagramm der Anteile je Kategorie
- Export der Timeline als PNG
- Alle Ereignisse löschen
- Registrierung, Anmeldung und Abmelden
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
npm run build          # Production-Build nach dist/
npm run preview        # Production-Build lokal testen
npm run test:browser   # Browser-Test der nichtfunktionalen Anforderungen (Chrome oder Edge nötig)
```

## Backend

Das Frontend kommuniziert über `src/api/client.ts` mit dem Express-Backend. Für
die Entwicklung müssen Backend und Frontend separat gestartet werden; die
Produktionsauslieferung kann das gebaute Frontend über den Express-Server bedienen.

## Projektstruktur

```
src/
  components/       # AuthForms, Header, Timeline, EventCard, EventFormModal,
                    # CategoryFilter, StatsDashboard
  api/              # HTTP-Client
  types.ts          # LifeEvent, Category, Holiday
  App.tsx
e2e/                # Browser-Test (nfr-checks.mjs)
```

Die Bausteine und ihre Zuordnung zu den Anwendungsfällen sind in
[A05](../docs/arch/A05-Bausteinansicht.md) beschrieben.
