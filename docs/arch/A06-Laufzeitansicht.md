## 6. Laufzeitsicht

Auswahlkriterium nach arc42: architektonische Relevanz, nicht
Vollständigkeit. Reine CRUD-Abläufe (Event bearbeiten, löschen,
Timeline anzeigen) folgen alle demselben einfachen
Frontend-Backend-Datenbank-Muster wie 6.1 und werden daher nicht
einzeln diagrammiert.

| Szenario | Use Case | Warum architektonisch relevant |
|---|---|---|
| 6.1 Event anlegen | UC-01 | Repräsentativ für alle CRUD-Abläufe; zeigt Validierungsmuster |
| 6.2 Registrieren & Login | UC-07 | Einzige Zugriffskontrolle im System |
| 6.3 Statistik berechnen | UC-06 | Einzige echte Aggregations-/Business-Logik |

Alle in den folgenden Diagrammen verwendeten Bausteine sind in Kapitel 5
(Bausteinsicht) als Blackbox beschrieben.

### 6.1 Event anlegen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant EF as EventForm
    participant AC as ApiClient
    participant R as routes/events
    participant DB as Datenbank

    N->>EF: füllt Formular aus, klickt Speichern
    EF->>AC: createEvent(daten)
    AC->>R: POST /api/events
    R->>R: middleware/validation prüft Eingabe
    alt Eingabe ungültig
        R-->>AC: 422 Fehlermeldung
        AC-->>EF: zeigt Fehler im Formular
    else Eingabe gültig
        R->>DB: INSERT
        DB-->>R: gespeichertes Event
        R-->>AC: 201 Created
        AC-->>EF: Erfolg
        EF-->>N: Timeline aktualisiert sich
    end
```

**Anmerkungen:** Die Validierung (`middleware/validation`) wird direkt
innerhalb der Route aufgerufen, bevor gespeichert wird – damit bleiben
die Daten auch bei direkten API-Aufrufen konsistent (Nachvollziehbarkeit,
QG-02). Es gibt keine separate Datenzugriffsschicht; `routes/events`
spricht die Datenbankverbindung direkt an (siehe 5.2.2). Dieses Muster
gilt analog für UC-02 (Bearbeiten) und UC-03 (Löschen).

### 6.2 Registrieren & Login

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant AC as ApiClient
    participant R as routes/auth
    participant DB as Datenbank

    N->>AC: gibt E-Mail/Passwort ein, sendet ab
    AC->>R: POST /api/auth/login
    R->>DB: SELECT Nutzer anhand E-Mail
    DB-->>R: Nutzerdatensatz (inkl. Passwort-Hash)
    alt Zugangsdaten korrekt
        R-->>AC: Session-Cookie
        AC-->>N: eingeloggt, Weiterleitung zur Timeline
    else Zugangsdaten falsch
        R-->>AC: 401 Unauthorized
        AC-->>N: Fehlermeldung
    end
```

**Auth-Mechanismus:** Session-basierte Authentifizierung – Kontext,
Alternativen und Begründung siehe ADR-004 (Kapitel 9). Konkrete
Realisierung (Passwort-Hashing, Cookie-Flags, Session-Store) siehe
Kapitel 8.2. **Hinweis:** Ein eigenständiger `AuthForms`-Baustein ist
im Frontend noch nicht umgesetzt (siehe 5.2.1); aktuell übernimmt eine
automatische Demo-Anmeldung (`ensureSession()` in `api/client.ts`)
diese Rolle testweise, bis eine echte Login-Seite existiert.

### 6.3 Statistik berechnen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant AC as ApiClient
    participant R as routes/stats
    participant DB as Datenbank

    N->>AC: fordert Statistik an
    AC->>R: GET /api/stats
    R->>DB: SELECT category, COUNT(*), AVG(significance)<br/>GROUP BY category
    DB-->>R: aggregierte Zeilen je Kategorie
    R-->>AC: 200 OK, Statistikdaten
```

**Anmerkung:** Die Aggregation erfolgt als einzelne SQL-Abfrage direkt
in `routes/stats` (`GROUP BY category`), nicht über einen separaten
`statsService` – für den aktuellen Funktionsumfang ausreichend und ohne
zusätzliche Anwendungslogik. **Hinweis:** Ein `StatsDashboard`-Baustein,
der diese Anfrage im Frontend auslöst, ist noch nicht umgesetzt (siehe
5.2.1); der Endpunkt `GET /api/stats` existiert bereits im Backend, wird
aber aktuell von keiner Frontend-Ansicht aufgerufen.

**Bewusst nicht diagrammiert:** UC-04 (Timeline ansehen, einfaches GET)
und UC-05 (Filtern) – Filterung findet clientseitig auf bereits
geladenen Daten statt, ohne zusätzlichen Server-Roundtrip.
