## 8. Querschnittliche Konzepte

Dieses Kapitel beschreibt die technische Umsetzung von Konzepten, die mehrere
Bausteine gleichzeitig betreffen. Die fachlichen Regeln dazu stehen in der
Spezifikation ([N2](../spec/N2-querschnittskonzepte.md)); das Datenmodell ist
in [D1](../spec/D1-datenmodell.md)/[D2](../spec/D2-datentypenverzeichnis.md)
beschrieben und wird hier nicht wiederholt.

### 8.1 Validierung

Der Server ist die einzige verbindliche Instanz, die Prüfung im Browser dient
nur der schnellen Rückmeldung (Nachvollziehbarkeit, QG-02):

| Grenze | Prüfung | Bei Fehler |
|---|---|---|
| Browser (Komfort) | Pflichtfelder und Formate per HTML5 in `EventFormModal` und `AuthForms`; Passwortbestätigung; Bildformat und -größe vor dem Einlesen | Meldung am Feld, nie verbindlich |
| Backend – Event anlegen/bearbeiten | `utils/validateEvent.ts` und Besitzprüfung der Kategorie in `routes/events.ts` | 422, nichts gespeichert |
| Backend – Registrierung/Login | E-Mail-Format, Passwort mindestens 8 Zeichen; E-Mail bereits vergeben; Zugangsdaten falsch | 422, 409 bzw. 401 |
| Backend – Kategorie anlegen | Name 1–40 Zeichen, Farbe `#RRGGBB`, Name pro Person eindeutig (`constants/categories.ts`) | 422 bzw. 409 |
| Backend – Bild-Upload | Data-URI mit Typ JPEG/PNG/WEBP, höchstens 5 MB, passende Dateisignatur (`utils/image.ts`) | 422, nichts gespeichert |
| Backend – Feiertage abrufen | `year` ist eine ganze Zahl von 1900 bis 2100 (`routes/holidays.ts`); das Jahresfeld der Oberfläche lässt nur diesen Bereich zu | 422; Fehler des Feiertagsdienstes selbst ergeben dagegen eine leere Liste |

**Regeln in `validateEventInput`** (gilt für `POST` und `PUT /api/events`):

| Feld | Regel |
|---|---|
| `category_id` | Positive Ganzzahl; zusätzlich muss die Kategorie der angemeldeten Person gehören (Prüfung in der Route) |
| `title` | Pflichtfeld, nach Trimmen nicht leer, höchstens 120 Zeichen |
| `description` | Optional; falls gesetzt Text mit höchstens 2000 Zeichen |
| `date` | Pflichtfeld, Format `YYYY-MM-DD` und existierender Kalendertag |
| `time` | Optional; falls gesetzt Format `HH:MM` mit gültiger Uhrzeit |
| `significance` | Optional; falls gesetzt ganze Zahl von 0 bis 100 ([D2.2](../spec/D2-datentypenverzeichnis.md#d22-wertebereich-von-significance)) |

Alle Regeln stehen in einer einzigen Funktion, die von beiden Routen
aufgerufen wird. Dadurch gibt es keine zwei Prüfimplementierungen, die
auseinanderlaufen könnten (Erweiterbarkeit, QG-03). Die Fehlermeldungen
sind für die Oberfläche formuliert und enthalten keine Feldnamen oder
Formatangaben aus dem Code ([NFR-11c-01](../spec/N1-nichtfunktional.md)).

**Erweiterbarkeit der Kategorien (QG-03, NFR-14c-01):** Kategorien sind eine
eigene Tabelle. Neue Kategorien entstehen zur Laufzeit über
`POST /api/categories`, ohne Codeänderung oder neues Deployment.

### 8.2 Authentifizierung, Session und Zugriffsschutz

Die Entscheidung für Sessions statt JWT ist in **ADR-004** begründet. Die
technische Umsetzung:

- **Passwort-Hashing:** `scrypt` aus dem Node.js-Modul `crypto` mit
  zufälligem Salt je Konto; Vergleich mit `timingSafeEqual`
  (`utils/password.ts`). Passwörter werden nie gespeichert oder protokolliert.
- **E-Mail-Adressen** werden kleingeschrieben gespeichert und ohne
  Groß-/Kleinschreibung verglichen, damit eine Adresse genau ein Konto hat.
- **Session-Cookie** `sid`: 32 zufällige Bytes, `HttpOnly`, `SameSite=Lax`,
  `Path=/`, Gültigkeit 24 Stunden; in `production` zusätzlich `Secure`.
- **Session-Store:** eine `Map` im Arbeitsspeicher des Backend-Prozesses
  (`middleware/session.ts`), ohne zusätzliches npm-Paket. Bewusste
  Einschränkung des Prototyps: Nach einem Neustart sind alle Sessions weg und
  die Nutzer:innen müssen sich erneut anmelden; die Daten bleiben erhalten.
  Das Frontend erkennt dies an der Antwort 401 und kehrt zum
  Anmeldeformular zurück (Laufzeitsicht 6.6).
- **Cross-Origin in der Entwicklung:** Frontend (Port 5173) und Backend
  (Port 3000) sind verschiedene Origins. Das Backend setzt deshalb
  `Access-Control-Allow-Origin` auf die konkrete Adresse aus
  `FRONTEND_ORIGIN` (kein `*`) zusammen mit
  `Access-Control-Allow-Credentials: true`, und das Frontend sendet jede
  Anfrage mit `credentials: 'include'` (`api/client.ts`). Im
  Produktionsbetrieb liefert das Backend das Frontend selbst aus; dort gibt es
  nur einen Origin (Kapitel 7.1.2).
- **Zugriffsschutz:** `middleware/requireAuth` weist Anfragen ohne Session
  mit 401 ab. Zusätzlich enthält **jede** Datenbankabfrage auf Events und
  Kategorien die Bedingung `user_id = ?`. Ein fremdes Event wird dadurch
  genauso beantwortet wie ein nicht existierendes (404), sodass sich die
  Existenz fremder Einträge nicht feststellen lässt
  ([NFR-15a-01](../spec/N1-nichtfunktional.md)). Die Integrationstests
  prüfen das für Lesen, Ändern und Löschen.

### 8.3 Bildablage

- Bilder werden vom Frontend als Base64-Data-URI im JSON-Body übertragen.
  Dadurch ist kein zusätzliches Paket für `multipart/form-data` nötig; das
  JSON-Limit des Servers ist dafür auf 10 MB angehoben.
- `utils/image.ts` prüft Typ, Größe (höchstens 5 MB) und die **Dateisignatur**
  der dekodierten Daten. Eine als PNG deklarierte Datei mit anderem Inhalt
  wird abgewiesen ([NFR-15b-04](../spec/N1-nichtfunktional.md)).
- Die Datei wird unter einem zufälligen Namen (`<uuid>.<endung>`) in
  `backend/uploads/` gespeichert; in `events.image_path` steht nur der Pfad
  `/uploads/<uuid>.<endung>`.
- **Kompensation statt Transaktion:** Dateisystem und SQLite lassen sich
  nicht gemeinsam transaktional ändern. Scheitert das Speichern in der
  Datenbank, wird die neu geschriebene Datei wieder gelöscht. Ein ersetztes
  oder entferntes Bild wird erst nach dem erfolgreichen Update gelöscht.
  Das verbleibende Restrisiko ist in [OP-08](../OFFENE-PUNKTE.md) beschrieben.
- Die Bilder werden unter `/uploads/*` ohne Sessionprüfung ausgeliefert. Die
  zufälligen Dateinamen sind nicht erratbar; wer die Adresse eines Bildes
  kennt, kann es aber abrufen. Für den Prototyp ist das akzeptiert.

### 8.4 Datentypen zwischen Backend und Frontend

Das Backend liefert die Spalten aus [D1](../spec/D1-datenmodell.md)
unverändert als JSON. Das Frontend bildet sie an genau einer Stelle
(`fromApiRow` und `toApiPayload` in `api/client.ts`) auf seinen eigenen Typ
`LifeEvent` ab:

| D1 / Backend (`EVENTS`) | Frontend (`LifeEvent`) | Abbildung |
|---|---|---|
| `id` (integer) | `id` (string) | als Text, weil React-Schlüssel und Formularzustand mit Text arbeiten |
| `category_id` | `category` | Kategorie-ID, Anzeige über `getCategory` |
| `image_path` | `image` | vollständige Bild-URL bzw. beim Hochladen eine Data-URI |
| `significance` (optional) | `significance` | fehlt der Wert, wird 50 angenommen (D1.4) |
| `description`, `time` (optional) | `description`, `time` | `null` wird zu leerem Text bzw. `undefined` |

### 8.5 Fehlerbehandlung

- Erwartete Fehler beantworten die Routen selbst mit einem Statuscode aus
  [N2.4](../spec/N2-querschnittskonzepte.md#n24-fehlerbehandlung) und einem JSON-Objekt
  `{ "error": "<Meldung für die Oberfläche>" }`.
- Unerwartete Fehler fängt ein **zentraler Fehler-Handler** in `server.ts`
  ab: Er protokolliert den Fehler auf der Konsole und antwortet mit 500 und
  einer allgemeinen Meldung, nie mit Stapelspuren. Ein zu großer
  Request-Body wird mit 413 beantwortet.
- Das Frontend zeigt nur den Text aus `error` an; Netzwerkfehler werden in
  „Keine Verbindung zum Server“ übersetzt (`api/client.ts`). Beim Laden der
  Timeline gibt es die Möglichkeit, erneut zu laden.
- Fehler des Feiertagsdienstes werden in `routes/holidays.ts` in eine leere
  Liste umgewandelt und erreichen die Oberfläche nie (Laufzeitsicht 6.4).

### 8.6 Schema und Datenmigration

- `db/schema.sql` enthält das vollständige Schema mit
  `CREATE TABLE IF NOT EXISTS` und wird bei jedem Start angewendet.
- `db/migrateCategories.ts` stellt ältere Datenbestände einmalig auf die
  Entität `categories` um (früher war die Kategorie ein fester Textwert am
  Event) und legt Konten ohne Kategorien die Startkategorien an. Die Schritte
  laufen in Transaktionen und sind wiederholbar; auf einer aktuellen
  Datenbank bewirken sie nichts.
- Vor einer Schemaänderung auf einem bestehenden Bestand sind Datenbank und
  Bildablage gemeinsam zu sichern ([S3.6](../betrieb/S3-inbetriebnahme.md)).
