# Lifeline

Lifeline ist eine interaktive Timeline-Webanwendung zur visuellen Darstellung
persönlicher Meilensteine, Ziele und Ereignisse. Nutzer:innen erfassen Events
mit Datum, Kategorie, Bedeutung und optionalem Bild und sehen sie in einer
chronologischen Timeline. Der Fokus des Projekts liegt auf moderner UI,
Benutzerfreundlichkeit und interaktiver Visualisierung.

## Features

- Registrierung, Anmeldung und Abmeldung (jede Person sieht nur eigene Events)
- Anlegen, Bearbeiten und Löschen persönlicher Lebensereignisse, optional mit Bild
- Eigene Kategorien anlegen (sechs Startkategorien sind vorbelegt)
- Interaktive Timeline mit Übersicht, Jahresansicht und Zoom
- Filtern nach Kategorie
- Statistik (Anzahl je Kategorie, Zeitspanne, Tendenz der Bedeutung)
- Gesetzliche Feiertage als Markierung in der Jahresansicht (öffentliche Feiertags-API)
- Export der Timeline als PNG-Bild
- Sicherung als JSON-Datei exportieren und wieder importieren

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

Die `.env`-Dateien enthalten nur lokale Laufzeitkonfiguration und werden nicht
committet. Aktive Sessions liegen während der Laufzeit im Backend-Prozess und
werden bei einem Neustart zurückgesetzt.

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

## Tests

```bash
npm --prefix backend test
```

Die Tests starten das Backend jeweils mit einer temporären Datenbank und
prüfen u. a. Registrierung/Anmeldung, Event-CRUD, den Schutz fremder Daten,
das Anlegen von Kategorien und die Dauerhaftigkeit nach einem Neustart.

Zusätzlich prüft ein Browser-Test die nichtfunktionalen Anforderungen aus
[N1](docs/spec/N1-nichtfunktional.md) (Ladezeit mit 200 und 500 Events,
Reihenfolge, Filter ohne Serveranfrage, Layout auf Smartphone und Desktop,
Schutz vor Skript-Eingaben):

```bash
npm --prefix frontend run test:browser
```

Der Test startet Backend und Frontend selbst (Ports 3190 und 5191, temporäre
Datenbank) und benötigt einen installierten Google Chrome oder Microsoft Edge.

## Produktionsbetrieb (ein Prozess)

Im Produktionsbetrieb liefert das Backend das gebaute Frontend selbst aus
(siehe [A07](docs/arch/A07-Bereitstellungsansicht.md)). Dafür beim Frontend-Build
`VITE_API_URL` leer setzen, damit die API unter derselben Adresse
angesprochen wird:

```bash
npm --prefix frontend install
npm --prefix backend install
VITE_API_URL= npm --prefix frontend run build
npm --prefix backend run build
npm --prefix backend run migrate
NODE_ENV=production npm --prefix backend start
```

Die Anwendung ist dann unter http://localhost:3000 erreichbar. Für den
Betrieb im Internet muss davor ein HTTPS-Endpunkt liegen, und die Ordner
`backend/data/` (Datenbank) und `backend/uploads/` (Bilder) müssen auf
dauerhaftem Speicher liegen und gemeinsam gesichert werden
(siehe [S3](docs/betrieb/S3-inbetriebnahme.md)).

### Optional: öffentliche HTTPS-Adresse für eine Vorführung

Für eine Präsentation kann der lokal laufende Produktionsbetrieb über einen
kostenlosen Cloudflare Quick Tunnel vorübergehend unter einer HTTPS-Adresse
erreichbar gemacht werden, ohne Konto und ohne Codeänderung:

1. `cloudflared` installieren (z. B. `winget install Cloudflare.cloudflared`).
2. Lifeline wie oben im Produktionsbetrieb starten.
3. In einem zweiten Terminal: `cloudflared tunnel --url http://localhost:3000`
4. Die ausgegebene Adresse `https://…trycloudflare.com` im Browser öffnen.

Die Daten bleiben auf dem eigenen Rechner; die Adresse ist nur erreichbar,
solange beide Prozesse laufen. Für einen dauerhaften Betrieb ist das nicht
gedacht.

## Dokumentation

- [Spezifikation](docs/spec/)
- [Architektur](docs/arch/)
- [Inbetriebnahme](docs/betrieb/S3-inbetriebnahme.md)
