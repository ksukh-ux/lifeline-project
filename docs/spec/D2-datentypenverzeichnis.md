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
| `category` | string | Kategorie des Events (siehe D2.4) |
| `significance` | integer | Bedeutung/Gewichtung des Events, siehe D2.6 |
| `title` | string | Titel des Events |
| `description` | string | Beschreibung des Events |
| `start_date` | date | Startdatum des Events |
| `end_date` | date | Enddatum des Events |
| `location` | string | Ort des Events |
| `tags` | string | Schlagwörter des Events |
| `image_path` | string | Pfad zu einem optional hochgeladenen Bild des Events, siehe D2.7 |
| `created_at` | datetime | Zeitpunkt der Erstellung des Events |

## D2.4 Wertebereich der Event-Kategorie

Für das Attribut `category` sind folgende Werte vorgesehen. Jede Kategorie ist zusätzlich einer festen Akzentfarbe für die Darstellung in der Timeline zugeordnet:

| Wert | Bezeichnung | Farbe (Hex) |
|---|---|---|
| `meilenstein` | Meilenstein | `#38BDF8` |
| `karriere` | Karriere | `#FB923C` |
| `bildung` | Bildung | `#8B5CF6` |
| `beziehung` | Beziehung | `#EC4899` |
| `reise` | Reise | `#14B8A6` |
| `gesundheit` | Gesundheit | `#F43F5E` |
| `sonstiges` | Sonstiges | `#94A3B8` |

Andere Werte werden vom Backend abgelehnt. Die Zuordnung von Wert, Bezeichnung und Farbe wird zentral an einer Stelle gepflegt (siehe Architektur, Kapitel 8.2), damit neue Kategorien mit minimalem Aufwand ergänzt werden können (vgl. N1.3, NFA-03).

## D2.5 Schlüssel und Referenzen

`USERS.id` und `EVENTS.id` dienen der eindeutigen Identifikation der jeweiligen Datensätze.

Über `EVENTS.user_id` wird ein Event einem Nutzer bzw. einer Nutzerin zugeordnet. Dadurch können einem Nutzer mehrere Events zugeordnet werden.

## D2.6 Wertebereich von significance

Das Attribut `significance` ist eine Ganzzahl zwischen 0 und 100 (0 = geringste, 100 = höchste Bedeutung für die Nutzer:in). Der Wert wird für die visuelle Gewichtung des Events in der Timeline verwendet.

## D2.7 Bild (image_path)

Ein Event kann optional genau ein Bild besitzen. Das Bild wird nicht in der Datenbank gespeichert, sondern als Datei im Backend abgelegt; `image_path` enthält lediglich den Pfad, unter dem das Bild ausgeliefert wird. Erlaubte Formate sind JPEG, PNG und WEBP mit einer maximalen Dateigröße von 5 MB. Ungültige Formate oder zu große Dateien werden vom Backend abgelehnt.