# D1 – Datenmodell

## D1.1 Übersicht

Das Datenmodell der Lifeline-Anwendung basiert auf den beiden zentralen Entitäten `USERS` und `EVENTS`.

Ein:e Nutzer:in kann mehrere Events besitzen. Jedes Event ist genau einem Nutzer bzw. einer Nutzerin zugeordnet.

## D1.2 Entität USERS

Die Entität `USERS` speichert die für Registrierung und Anmeldung benötigten Nutzerdaten.

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `id` | integer | Eindeutige ID des Nutzers (Primärschlüssel) |
| `email` | string | E-Mail-Adresse des Nutzers, eindeutig |
| `password_hash` | string | Gehashtes Passwort |
| `created_at` | datetime | Zeitpunkt der Erstellung des Benutzerkontos |

Das Passwort wird nicht im Klartext gespeichert, sondern ausschließlich als Hash.

## D1.3 Entität EVENTS

Die Entität `EVENTS` enthält die persönlichen Ereignisse der Nutzer:innen.

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `id` | integer | Eindeutige ID des Events (Primärschlüssel) |
| `user_id` | integer | Referenz auf den zugehörigen Nutzer (Fremdschlüssel) |
| `category` | string | Kategorie des Events (`meilenstein`, `karriere`, `bildung`, `beziehung`, `reise`, `gesundheit` oder `sonstiges`; siehe D2.4) |
| `significance` | integer | Bedeutung/Gewichtung des Events auf einer Skala von 0–100, beeinflusst die Darstellung in der Timeline |
| `title` | string | Titel des Events |
| `description` | string | Beschreibung des Events |
| `date` | date | Datum des Events |
| `time` | time | Uhrzeit des Events (optional) |
| `image_path` | string | Pfad zu einem optional hochgeladenen Bild des Events; die Bilddatei selbst liegt im Backend, nicht in der Datenbank (siehe D2.7) |
| `created_at` | datetime | Zeitpunkt der Erstellung |

## D1.4 Beziehungen

Zwischen `USERS` und `EVENTS` besteht eine 1:n-Beziehung.

Ein:e Nutzer:in kann mehrere Events besitzen. Ein Event gehört jedoch immer genau zu einem Nutzer bzw. einer Nutzerin. Die Zuordnung erfolgt über den Fremdschlüssel `user_id` in `EVENTS`.

## D1.5 Persistenz

Die persistente Speicherung der Daten erfolgt in einer SQLite-Datenbank. Das Backend übernimmt den Zugriff auf die Datenbank. Direkte Datenbankzugriffe durch das Frontend finden nicht statt.
