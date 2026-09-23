# N2 – Querschnittskonzepte

## N2.1 Übersicht

Die Querschnittskonzepte beschreiben fachliche Regeln und Mechanismen, die mehrere Bereiche der Lifeline-Anwendung betreffen: die Validierung von Eingaben, die Authentifizierung und Session-Verwaltung, die Fehlerbehandlung sowie den Umgang mit sensiblen Daten und Protokollen. Die technische Umsetzung steht in [A08](../arch/A08-Querschnittskonzepte.md).

## N2.2 Validierung

Eingaben werden sowohl in der Oberfläche als auch in der Anwendungslogik geprüft. Die Prüfung in der Oberfläche dient der schnellen Rückmeldung (Pflichtfelder, Passwortbestätigung, Bildformat und -größe). Die **verbindliche** Prüfung erfolgt immer in der Anwendungslogik, denn alles, was vom Browser kommt, gilt als nicht vertrauenswürdig ([S1.2.1](S1-nachbarsysteme.md#s121-grenzsemantik)).

Geprüft wird gegen die Regeln aus [D2](D2-datentypenverzeichnis.md) und die Invarianten aus [D1.7](D1-datenmodell.md#d17-invarianten), insbesondere:

- Pflichtfelder sind vorhanden und nicht leer; Längengrenzen werden eingehalten.
- Datum und Uhrzeit sind gültig (existierender Kalendertag, Uhrzeit `HH:MM`).
- Die Bedeutung ist leer oder eine ganze Zahl von 0 bis 100.
- `category_id` verweist auf eine existierende Kategorie **derselben** Person (`INV-E2`); eine feste Werteliste gibt es nicht, seit Kategorie eine eigene Entität ist (D1.3, UC-08).
- Bilder haben ein erlaubtes Format, höchstens 5 MB und einen Inhalt, der zum Format passt.

## N2.3 Authentifizierung und Session

Die Authentifizierung erfolgt über die Anwendungslogik. Passwörter werden als Hash mit Salt gespeichert und nie im Klartext abgelegt oder protokolliert (`INV-U2`).

Nach erfolgreicher Anmeldung wird eine Session erzeugt. Geschützte Funktionen können nur mit einer gültigen Session verwendet werden. Eine Session endet mit dem Abmelden, nach 24 Stunden oder bei einem Neustart der Anwendung; danach ist eine erneute Anmeldung nötig, die gespeicherten Daten bleiben erhalten.

Nutzer:innen dürfen ausschließlich auf die Events und Kategorien zugreifen, die ihrem eigenen Benutzerkonto zugeordnet sind. Die Zugehörigkeit wird bei **jeder** Operation geprüft ([NFR-15a-02](N1-nichtfunktional.md)).

## N2.4 Fehlerbehandlung

Die Anwendungslogik meldet Fehler mit einheitlichen HTTP-Statuscodes und einer Meldung, die in der Oberfläche angezeigt werden kann.

| Statuscode | Bedeutung |
|---|---|
| `401` | Nutzer:in ist nicht angemeldet oder die Zugangsdaten sind falsch |
| `404` | Die angeforderte Ressource existiert nicht **oder gehört einer anderen Person**; beide Fälle werden bewusst gleich beantwortet ([NFR-15a-01](N1-nichtfunktional.md)) |
| `409` | Konflikt mit dem Bestand: E-Mail-Adresse bereits registriert (`INV-U1`) oder Kategoriename bereits vorhanden (`INV-C1`) |
| `413` | Die Anfrage ist zu groß (z. B. ein sehr großes Bild) |
| `422` | Eingabedaten sind ungültig |
| `500` | Interner Fehler; die Meldung enthält keine technischen Einzelheiten |

Ein eigener Statuscode für „Zugriff verboten“ (403) wird bewusst nicht verwendet, weil er verraten würde, dass eine fremde Ressource existiert.

Fehler werden so behandelt, dass die Oberfläche eine verständliche Rückmeldung ausgeben kann ([B1.4.2](B1-dialogspezifikation.md#b142-fehlermeldungen)).

**Sonderregel für das Nachbarsystem NB-02 (Feiertagsdienst):** Fehler, Zeitüberschreitungen und ungültige Antworten des Feiertagsdienstes führen **nicht** zu einer Fehlermeldung, sondern werden wie „keine Feiertage“ behandelt ([S1.3.2](S1-nachbarsysteme.md#s132-bindende-regel-fehlerverhalten)).

## N2.5 Secret-Handling und Protokollierung

Konfigurationswerte werden über Umgebungsvariablen beziehungsweise eine `.env`-Datei verwaltet, die nicht im Repository liegt. Lifeline benötigt derzeit keine geheimen Schlüssel: Die Session-Kennungen werden zufällig erzeugt, und der Feiertagsdienst ist ohne Schlüssel nutzbar.

Protokolliert werden nur der Start der Anwendung, Datenmigrationen und unerwartete Fehler. Passwörter, Session-Kennungen und Event-Inhalte werden nicht protokolliert ([NFR-15c-02](N1-nichtfunktional.md)).
