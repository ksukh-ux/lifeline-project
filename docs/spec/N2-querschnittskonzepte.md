# N2 – Querschnittskonzepte

## N2.1 Übersicht

Die Querschnittskonzepte beschreiben technische Regeln und Mechanismen, die mehrere Bereiche der Lifeline-Anwendung betreffen. Dazu gehören die Validierung von Eingaben, die Authentifizierung und Session-Verwaltung, die Fehlerbehandlung sowie der Umgang mit sensiblen Daten und Logging.

## N2.2 Validierung

Eingaben werden sowohl im Frontend als auch im Backend validiert. Die Validierung im Frontend dient der Benutzerfreundlichkeit und ermöglicht eine frühzeitige Rückmeldung bei fehlerhaften Eingaben. Die verbindliche Prüfung erfolgt im Backend.

Für Events gelten insbesondere folgende Validierungsregeln:

- Pflichtfelder müssen vorhanden sein.
- Datumsangaben müssen gültig sein.
- `end_date` darf nicht vor `start_date` liegen.
- Für `type` sind nur die Werte `travel`, `job` und `project` zulässig.

## N2.3 Authentifizierung und Session

Die Authentifizierung erfolgt über das Backend. Passwörter werden mit `bcrypt` gehasht und nicht im Klartext gespeichert.

Nach erfolgreicher Anmeldung wird eine Session erzeugt. Geschützte Funktionen können nur mit einer gültigen Session verwendet werden.

Nutzer:innen dürfen ausschließlich auf die Events zugreifen, die ihrem eigenen Benutzerkonto zugeordnet sind.

## N2.4 Fehlerbehandlung

Die REST-API verwendet einheitliche HTTP-Statuscodes für auftretende Fehler.

| Statuscode | Bedeutung |
|---|---|
| `401` | Nutzer:in ist nicht authentifiziert |
| `403` | Zugriff auf eine Ressource ist nicht erlaubt |
| `404` | Angeforderte Ressource wurde nicht gefunden |
| `422` | Eingabedaten sind ungültig |
| `500` | Interner Serverfehler |

Fehler werden so behandelt, dass das Frontend eine verständliche Rückmeldung an die Nutzer:innen ausgeben kann.

## N2.5 Secret-Handling und Logging

Sensible Informationen wie Passwörter und Session-Secrets dürfen nicht im Klartext protokolliert werden.

Secrets werden über Umgebungsvariablen beziehungsweise eine `.env`-Datei verwaltet und nicht im Repository gespeichert.

Das Logging dient der Nachvollziehbarkeit von Fehlern und technischen Abläufen, ohne sensible Nutzerdaten offenzulegen.