## 6. Laufzeitsicht

Auswahlkriterium nach arc42: architektonische Relevanz, nicht
Vollständigkeit. Bearbeiten und Löschen eines Events folgen demselben
Muster wie 6.1 und werden nicht eigens diagrammiert.

| Szenario | Anwendungsfall | Warum architektonisch relevant |
|---|---|---|
| 6.1 Event anlegen | UC-01 | Repräsentativ für alle schreibenden Abläufe; zeigt Validierung, Besitzprüfung und Bildablage |
| 6.2 Registrieren und Login | UC-07 | Einzige Zugangskontrolle; zeigt Transaktion, Passwort-Hash und Session |
| 6.3 Statistik berechnen | UC-06 | Einzige Aggregation auf dem Server |
| 6.4 Timeline ansehen mit Feiertagen | UC-04 | Zeigt das nicht-blockierende Nachbarsystem NB-02 |
| 6.5 Kategorie anlegen | UC-08 | Laufzeit-Erweiterbarkeit der Kategorien (NFR-14c-01) |
| 6.6 Abgelaufene Session | alle außer UC-07 | Verhalten nach Serverneustart (In-Memory-Sessions, Kapitel 8.2) |

Alle Bausteine in den Diagrammen sind in Kapitel 5 beschrieben.

### 6.1 Event anlegen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant EF as EventFormModal
    participant AC as api/client
    participant R as routes/events
    participant V as utils/validateEvent
    participant I as utils/image
    participant DB as Datenbank

    N->>EF: füllt Formular aus, wählt ggf. Bild, klickt Hinzufügen
    EF->>EF: Pflichtfelder, Bildformat und -größe vorprüfen
    EF->>AC: createEvent(event)
    AC->>R: POST /api/events (JSON, Bild als Data-URI)
    R->>V: validateEventInput(body)
    alt Eingabe ungültig
        R-->>AC: 422 { error }
        AC-->>N: Meldung, Formular bleibt offen
    else Eingabe gültig
        R->>DB: Kategorie gehört der Person?
        R->>I: parseDataUri + saveImage (Signatur prüfen)
        I-->>R: /uploads/<uuid>.png
        R->>DB: INSERT INTO events (…, user_id)
        alt Datenbankfehler
            R->>I: deleteImage (keine verwaiste Datei)
            R-->>AC: 500 { error }
        else Erfolg
            R-->>AC: 201 Created, gespeichertes Event
            AC-->>EF: Erfolg
            EF-->>N: Timeline aktualisiert sich
        end
    end
```

**Anmerkungen:** Die verbindliche Prüfung liegt im Backend; die Vorprüfung im
Formular dient nur der schnellen Rückmeldung am Feld (Kapitel 8.1). Beim
Bearbeiten (`PUT`) wird ein ersetztes Bild erst **nach** erfolgreichem Update
gelöscht, damit ein Datenbankfehler keinen Verweis auf eine fehlende Datei
hinterlässt ([NFR-12d-02](../spec/N1-nichtfunktional.md), OP-08).

### 6.2 Registrieren und Login

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant AF as AuthForms
    participant AC as api/client
    participant R as routes/auth
    participant P as utils/password
    participant S as middleware/session
    participant DB as Datenbank

    alt Registrierung
        N->>AF: E-Mail, Passwort, Passwortbestätigung
        AF->>AF: Passwörter gleich, mind. 8 Zeichen?
        AF->>AC: register(email, password)
        AC->>R: POST /api/auth/register
        R->>DB: E-Mail (ohne Groß-/Kleinschreibung) schon vergeben?
        alt vergeben
            R-->>AC: 409 { error }
        else frei
            R->>P: hashPassword (scrypt + Salt)
            R->>DB: Transaktion: INSERT users, INSERT 6 Startkategorien
            R->>S: createSession(userId)
            R-->>AC: 201 + Set-Cookie sid (HttpOnly, SameSite=Lax)
        end
    else Anmeldung
        N->>AF: E-Mail, Passwort
        AF->>AC: login(email, password)
        AC->>R: POST /api/auth/login
        R->>DB: SELECT Nutzer anhand E-Mail
        R->>P: verifyPassword (timingSafeEqual)
        alt Zugangsdaten korrekt
            R->>S: createSession(userId)
            R-->>AC: 200 + Set-Cookie sid
            AC-->>N: Weiterleitung zur Timeline
        else falsch oder unbekannt
            R-->>AC: 401, immer dieselbe Meldung
            AC-->>N: „E-Mail oder Passwort falsch.“
        end
    end
```

**Auth-Mechanismus:** Session-basierte Authentifizierung, Begründung in ADR-004
(Kapitel 9), technische Details in Kapitel 8.2. Die gleiche Meldung für
unbekannte Adresse und falsches Passwort verhindert, dass registrierte
Adressen ermittelt werden können (B1 DLG-05).

### 6.3 Statistik berechnen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant SD as StatsDashboard
    participant AC as api/client
    participant R as routes/stats
    participant DB as Datenbank

    N->>SD: öffnet die Timeline (Statistik wird mitgeladen)
    SD->>AC: fetchStats()
    AC->>R: GET /api/stats
    R->>DB: COUNT, MIN(date), MAX(date) WHERE user_id = ?
    R->>DB: COUNT, AVG(significance) je Kategorie WHERE user_id = ?
    R->>R: Zeitspanne in Tagen berechnen (AF-01)
    R-->>AC: 200 { totalCount, oldestDate, newestDate, spanDays, categories }
    AC-->>SD: Kennzahlen anzeigen
```

**Anmerkung:** Die Aggregation (AF-02) erfolgt per SQL direkt in
`routes/stats`. Nach jedem Anlegen, Bearbeiten, Löschen und Import lädt das
Frontend die Statistik neu. Ein aktiver Kategoriefilter wirkt nicht auf die
Statistik; das `StatsDashboard` weist darauf hin (B1 DLG-04).

### 6.4 Timeline ansehen mit Feiertagen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant App as App
    participant AC as api/client
    participant RE as routes/events
    participant RH as routes/holidays
    participant H as Feiertagsdienst

    N->>App: öffnet Lifeline (Session besteht)
    par Events laden (verbindlich)
        App->>AC: fetchCategories() + fetchEvents()
        AC->>RE: GET /api/events
        RE-->>AC: 200, eigene Events
        AC-->>App: Timeline wird angezeigt
    and Feiertage laden (optional)
        App->>AC: fetchHolidays(Jahr)
        AC->>RH: GET /api/holidays?year=2026
        alt Jahr im Zwischenspeicher
            RH-->>AC: 200, Feiertage
        else noch nicht geladen
            RH->>H: GET /api/v3/PublicHolidays/2026/DE (max. 4 s)
            alt Antwort gültig
                H-->>RH: Liste
                RH-->>AC: 200, Feiertage
            else Fehler, Zeitüberschreitung, ungültige Daten
                RH-->>AC: 200, leere Liste
            end
        end
        AC-->>App: Markierungen erscheinen nachträglich oder gar nicht
    end
```

**Anmerkung:** Beide Anfragen laufen unabhängig voneinander. Die Timeline
wartet nicht auf die Feiertage, und kein Fehler des Feiertagsdienstes erreicht
die Oberfläche ([S1.3.2](../spec/S1-nachbarsysteme.md#s132-bindende-regel-fehlerverhalten)).
`fetchHolidays` wirft deshalb bewusst nie eine Ausnahme. Die Filterung (UC-05)
ist nicht diagrammiert: Sie arbeitet ohne Serveranfrage auf den bereits
geladenen Events.

### 6.5 Kategorie anlegen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant CF as CategoryFilter
    participant AC as api/client
    participant R as routes/categories
    participant DB as Datenbank

    N->>CF: „Neue Kategorie“, Name und Farbe
    CF->>AC: createCategory(label, color)
    AC->>R: POST /api/categories
    R->>R: Name 1–40 Zeichen, Farbe #RRGGBB?
    alt ungültig
        R-->>AC: 422 { error }
    else Name bei dieser Person schon vorhanden
        R-->>AC: 409 { error }
    else gültig
        R->>DB: INSERT INTO categories (user_id, label, color)
        R-->>AC: 201, neue Kategorie
        AC-->>CF: sofort im Filter und im Event-Formular auswählbar
    end
```

### 6.6 Abgelaufene Session

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant App as App
    participant AC as api/client
    participant B as Backend

    Note over B: Backend wurde neu gestartet,<br/>In-Memory-Sessions sind weg
    N->>App: beliebige Aktion (z. B. anderes Jahr wählen)
    App->>AC: Anfrage mit altem Cookie sid
    AC->>B: GET /api/…
    B-->>AC: 401 Nicht angemeldet
    AC->>App: Ereignis „lifeline:unauthorized“
    App-->>N: zurück zum Anmeldeformular (B1.4.1)
```

**Anmerkung:** Die gespeicherten Daten bleiben erhalten; nur die Anmeldung
muss wiederholt werden (Kapitel 8.2, SC-04).
