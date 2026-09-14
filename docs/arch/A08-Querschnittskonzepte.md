## 8. Querschnittliche Konzepte

Dieses Kapitel vertieft zwei Konzepte, die mehrere Bausteine gleichzeitig
betreffen und deren technische Realisierung über das hinausgeht, was die
Spezifikation (N2) bereits auf fachlicher Ebene festlegt. Das
Datenmodell (vormals 8.1) ist bereits vollständig in D1/D2 beschrieben
und wird hier nicht wiederholt; Fehlerbehandlung und Secret-Handling
(vormals 8.4/8.5) sind inhaltsgleich bereits in N2.4/N2.5 festgehalten
und werden ebenfalls nicht dupliziert.

### 8.1 Validierung

Der Server ist die einzige verbindliche Instanz – Browser-Prüfung ist
reine Komfortfunktion (Nachvollziehbarkeit, QG-02):

| Grenze | Prüfung | Bei Fehler |
|---|---|---|
| Browser (Komfort) | HTML5-Formularvalidierung im `EventForm` (required, Datumsformat) | Inline-Hinweis, nie verbindlich |
| Backend – Event anlegen/bearbeiten | `middleware/validation` prüft Pflichtfelder, Datums-/Uhrzeitformat, `category` gegen erlaubte Werte | 422 mit Feldfehler, nichts gespeichert |
| Backend – Registrierung/Login | E-Mail-Format, Passwort-Mindestlänge; bei Login zusätzlich Existenz-Check | 422 bzw. 401 |
| Backend – Bild-Upload | Dateiformat (JPEG/PNG/WEBP) und Dateigröße (max. 5 MB) werden geprüft | 422, nichts gespeichert |

**Konkrete Realisierung** (`backend/src/utils/validateEvent.ts`):

| Feld | Regel |
|---|---|
| `category` | Muss einer der zentral gepflegten Werte sein (siehe `constants/categories.ts`, D2.4) |
| `title` | Pflichtfeld, nicht leer (nach Trimmen) |
| `date` | Pflichtfeld, Format `YYYY-MM-DD` (Regex-geprüft) |
| `time` | Optional, falls gesetzt Format `HH:MM` (Regex-geprüft) |
| `significance` | Falls gesetzt: Zahl zwischen 0 und 100 |

Alle Regeln werden serverseitig in einer einzigen Funktion geprüft, die
sowohl von `POST /api/events` als auch von `PUT /api/events/:id`
aufgerufen wird – es gibt dadurch keine zwei unterschiedlichen
Prüf-Implementierungen, die auseinanderlaufen könnten (Erweiterbarkeit,
QG-03).

**Erweiterbarkeit der Kategorien (vgl. NFA-03, QS-03):** Die zulässigen
`category`-Werte sind bewusst zentral an einer Stelle im Backend
definiert und werden sowohl von der Validierung als auch vom
Datenzugriff referenziert. Eine neue Kategorie erfordert dadurch nur
wenige, klar lokalisierte Änderungen: (1) Ergänzung in dieser zentralen
Liste, (2) Ergänzung im Frontend, (3) Ergänzung im Glossar (E2).

### 8.2 Authentifizierung und Session

Die Entscheidung für Session-basierte Authentifizierung statt JWT ist
mit Kontext, Alternativen und Begründung in **ADR-004** (Kapitel 9)
festgehalten – hier die konkrete technische Realisierung:

- **Passwort-Hashing:** bcrypt, niemals Klartext gespeichert oder geloggt
- **Session-Cookie:** `httpOnly` (kein Zugriff per JavaScript),
  `SameSite=Lax`, `secure` in Produktion; Session-Secret aus `.env`
  (siehe Kapitel 7.2, CONV-05)
- **Session-Store:** In-Memory (siehe D-02, Kapitel 11) – ausreichend für
  den Projektumfang, kein persistenter Store nötig; Sessions gehen bei
  Server-Neustart verloren, was für Demo-/Studienzwecke akzeptiert wird
- **Cross-Origin-Zugriff:** Frontend (Port 5173) und Backend (Port 3000)
  laufen als unterschiedliche Origins. Damit das Session-Cookie trotzdem
  funktioniert, müssen Backend und Frontend zusammenspielen: das Backend
  setzt `Access-Control-Allow-Origin` auf die konkrete Frontend-Adresse
  (kein Platzhalter `*`) zusammen mit `Access-Control-Allow-Credentials:
  true`; das Frontend schickt jede Anfrage mit `credentials: 'include'`
  (`api/client.ts`). Fehlt eine der beiden Seiten, wird das Cookie vom
  Browser nicht mitgesendet.
- **Zugriffskontrolle:** Jede geschützte Route prüft zusätzlich, dass
  angefragte Events dem eingeloggten Nutzer gehören (`user_id`-Filter in
  jeder Datenbankabfrage, siehe 5.2.2), nicht nur, dass überhaupt eine
  gültige Session besteht

**Bekannte Einschränkung:** Da im Frontend noch keine echte Login-Seite
existiert (siehe 5.2.1, `AuthForms`), meldet sich die Anwendung aktuell
testweise automatisch mit einem festen Demo-Konto an (`ensureSession()`
in `api/client.ts`). Diese Übergangslösung ist im Code klar
gekennzeichnet und muss vor einem echten Mehrnutzerbetrieb durch eine
reguläre Registrierungs-/Login-Seite ersetzt werden.
