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

### 6.1 Event anlegen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant EF as EventForm
    participant AC as ApiClient
    participant MW as middleware/validation
    participant R as routes/events
    participant M as models
    participant DB as SQLite

    N->>EF: füllt Formular aus, klickt Speichern
    EF->>AC: createEvent(daten)
    AC->>MW: POST /api/events
    alt Eingabe ungültig (z.B. Enddatum vor Startdatum)
        MW-->>AC: 422 Fehlermeldung
        AC-->>EF: zeigt Fehler im Formular
    else Eingabe gültig
        MW->>R: weiterleiten
        R->>M: create(event)
        M->>DB: INSERT
        DB-->>M: gespeichertes Event
        M-->>R: Event
        R-->>AC: 201 Created
        AC-->>EF: Erfolg
        EF-->>N: Timeline aktualisiert sich
    end
```

**Anmerkungen:** Validierung geschieht serverseitig *vor* dem Speichern
(Middleware), nicht nur im Frontend – damit bleiben die Daten auch bei
direkten API-Aufrufen konsistent (Nachvollziehbarkeit, QG-02). Dieses
Muster gilt analog für UC-02 (Bearbeiten) und UC-03 (Löschen).

### 6.2 Registrieren & Login

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant AF as AuthForms
    participant AC as ApiClient
    participant R as routes/auth
    participant M as models
    participant DB as SQLite

    N->>AF: gibt E-Mail/Passwort ein
    AF->>AC: login(daten)
    AC->>R: POST /api/auth/login
    R->>M: findByEmail(email)
    M->>DB: SELECT
    DB-->>M: Nutzerdatensatz
    M-->>R: Nutzer + Passwort-Hash
    alt Zugangsdaten korrekt
        R-->>AC: Session-Cookie
        AC-->>AF: eingeloggt
        AF-->>N: Weiterleitung zur Timeline
    else Zugangsdaten falsch
        R-->>AC: 401 Unauthorized
        AC-->>AF: Fehlermeldung
    end
```

**Auth-Mechanismus:** Session-basierte Authentifizierung – Kontext,
Alternativen und Begründung siehe ADR-004 (Kapitel 9). Konkrete
Realisierung (Passwort-Hashing, Cookie-Flags, Session-Store) siehe
Kapitel 8.3.

### 6.3 Statistik berechnen

```mermaid
sequenceDiagram
    actor N as Nutzer:in
    participant SD as StatsDashboard
    participant AC as ApiClient
    participant R as routes/stats
    participant S as services/statsService
    participant M as models
    participant DB as SQLite

    N->>SD: öffnet Dashboard
    SD->>AC: getStats()
    AC->>R: GET /api/stats
    R->>S: calculate(userId)
    S->>M: findAllByUser(userId)
    M->>DB: SELECT alle Events
    DB-->>M: Event-Liste
    M-->>S: Event-Liste
    S->>S: aggregiert Zeitraum je Kategorie
    S-->>R: {reise: Tage, job: Tage, projekt: Tage}
    R-->>AC: 200 OK
    AC-->>SD: Diagramm wird gerendert
```

**Anmerkung:** Die Aggregationslogik liegt bewusst in einem eigenen
Service (`statsService`), nicht direkt in der Route – damit bleibt sie
unabhängig testbar (Erweiterbarkeit, QG-03).

**Bewusst nicht diagrammiert:** UC-04 (Timeline ansehen, einfaches GET)
und UC-05 (Filtern) – Filterung findet clientseitig auf bereits
geladenen Daten statt, ohne zusätzlichen Server-Roundtrip.
