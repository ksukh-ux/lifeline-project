# D2 – Datentypenverzeichnis

## D2.1 Übersicht

Das Datentypenverzeichnis beschreibt die im Datenmodell der Lifeline-Anwendung verwendeten Datentypen. Grundlage bildet das in der Architektur definierte Datenmodell. Die persistente Speicherung erfolgt in einer SQLite-Datenbank.

## D2.2 Entität USERS

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `id` | integer | Eindeutige ID des Nutzers |
| `email` | string | E-Mail-Adresse des Nutzers |
| `password_hash` | string | Hash des Benutzerpassworts |
| `created_at` | datetime | Zeitpunkt der Erstellung des Benutzerkontos |

Die E-Mail-Adresse ist eindeutig. Passwörter werden nicht im Klartext gespeichert, sondern ausschließlich als Hash.

## D2.3 Entität EVENTS

| Attribut | Datentyp | Beschreibung |
|---|---|---|
| `id` | integer | Eindeutige ID des Events |
| `user_id` | integer | Referenz auf den zugehörigen Nutzer |
| `type` | string | Typ bzw. Kategorie des Events |
| `title` | string | Titel des Events |
| `description` | string | Beschreibung des Events |
| `start_date` | date | Startdatum des Events |
| `end_date` | date | Enddatum des Events |
| `location` | string | Ort des Events |
| `tags` | string | Schlagwörter des Events |
| `created_at` | datetime | Zeitpunkt der Erstellung des Events |

## D2.4 Wertebereich des Event-Typs

Für das Attribut `type` sind folgende Werte vorgesehen:

- `travel`
- `job`
- `project`

Andere Werte werden vom Backend abgelehnt.

## D2.5 Schlüssel und Referenzen

`USERS.id` und `EVENTS.id` dienen der eindeutigen Identifikation der jeweiligen Datensätze.

Über `EVENTS.user_id` wird ein Event einem Nutzer bzw. einer Nutzerin zugeordnet. Dadurch können einem Nutzer mehrere Events zugeordnet werden.