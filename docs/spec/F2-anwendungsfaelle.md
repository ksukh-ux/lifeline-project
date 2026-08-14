# F2 – Anwendungsfälle

Die folgenden Anwendungsfälle beschreiben die Interaktionen zwischen dem Nutzer und der Lifeline-Anwendung. Die Anwendungsfälle basieren auf den in der Architektur definierten Use Cases UC-01 bis UC-07.

## F2.1 UC-01 – Event anlegen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-01 |
| **Name** | Event anlegen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in legt ein neues Event an und fügt es der persönlichen Timeline hinzu. |
| **Trigger** | Die Nutzer:in möchte ein neues Event erstellen. |
| **Vorbedingung** | Die Nutzer:in befindet sich in der Lifeline-Anwendung. |
| **Nachbedingung** | Das neue Event wurde erfolgreich gespeichert und erscheint in der Timeline. |

### Hauptablauf

1. Die Nutzer:in öffnet das Formular zum Anlegen eines Events.
2. Die Nutzer:in gibt die erforderlichen Informationen ein.
3. Die Nutzer:in sendet das Formular ab.
4. Das Frontend übermittelt die Daten über den `ApiClient` an das Backend.
5. Die Eingaben werden durch die Validierung geprüft.
6. Das Backend verarbeitet die Anfrage über `routes/events`.
7. Das Event wird in der Datenbank gespeichert.
8. Das Backend meldet den erfolgreichen Vorgang zurück.
9. Die Timeline wird aktualisiert.

### Ausnahmefälle

- Sind erforderliche Eingaben ungültig, wird das Event nicht gespeichert.
- Das Frontend zeigt der Nutzer:in eine Fehlermeldung an.

---

## F2.2 UC-02 – Event bearbeiten

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-02 |
| **Name** | Event bearbeiten |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in verändert die Informationen eines bestehenden Events. |
| **Trigger** | Die Nutzer:in möchte ein bestehendes Event ändern. |
| **Vorbedingung** | Das zu bearbeitende Event existiert. |
| **Nachbedingung** | Die Änderungen wurden gespeichert und werden in der Timeline angezeigt. |

### Hauptablauf

1. Die Nutzer:in wählt ein bestehendes Event aus.
2. Die Nutzer:in öffnet die Bearbeitungsfunktion.
3. Das Event-Formular wird mit den vorhandenen Daten angezeigt.
4. Die Nutzer:in verändert die gewünschten Angaben.
5. Die Nutzer:in speichert die Änderungen.
6. Das Frontend übermittelt die geänderten Daten über den `ApiClient`.
7. Das Backend validiert die Eingaben.
8. Das Event wird aktualisiert.
9. Die aktualisierten Daten werden in der Timeline angezeigt.

### Ausnahmefälle

- Sind die eingegebenen Daten ungültig, werden die Änderungen nicht gespeichert.
- Die Nutzer:in erhält eine Fehlermeldung.

---

## F2.3 UC-03 – Event löschen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-03 |
| **Name** | Event löschen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in entfernt ein bestehendes Event aus der Timeline. |
| **Trigger** | Die Nutzer:in möchte ein Event löschen. |
| **Vorbedingung** | Das Event existiert. |
| **Nachbedingung** | Das Event wurde aus der Datenbank und der Timeline entfernt. |

### Hauptablauf

1. Die Nutzer:in wählt ein bestehendes Event aus.
2. Die Nutzer:in wählt die Funktion zum Löschen.
3. Das Frontend sendet die Löschanfrage über den `ApiClient`.
4. Das Backend verarbeitet die Anfrage über `routes/events`.
5. Das entsprechende Event wird aus der Datenbank entfernt.
6. Das Backend bestätigt den erfolgreichen Vorgang.
7. Die Timeline wird aktualisiert.

### Ausnahmefälle

- Kann das Event nicht gefunden werden, wird die Löschung nicht durchgeführt.
- Die Nutzer:in erhält eine entsprechende Fehlermeldung.

---

## F2.4 UC-04 – Timeline ansehen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-04 |
| **Name** | Timeline ansehen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in betrachtet die vorhandenen Events in chronologischer Darstellung. |
| **Trigger** | Die Nutzer:in öffnet die Timeline. |
| **Vorbedingung** | Die Lifeline-Anwendung ist erreichbar. |
| **Nachbedingung** | Die vorhandenen Events werden in der Timeline dargestellt. |

### Hauptablauf

1. Die Nutzer:in öffnet die Timeline.
2. Das Frontend fordert die vorhandenen Events an.
3. Der `ApiClient` kommuniziert mit dem Backend.
4. Das Backend stellt die vorhandenen Events bereit.
5. Das Frontend stellt die Events chronologisch in der Timeline dar.

### Ausnahmefälle

- Sind keine Events vorhanden, wird eine leere Timeline angezeigt.
- Bei einem Fehler beim Laden der Daten erhält die Nutzer:in eine Fehlermeldung.

---

## F2.5 UC-05 – Timeline filtern

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-05 |
| **Name** | Timeline filtern |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in filtert die bereits geladenen Events nach einer Kategorie. |
| **Trigger** | Die Nutzer:in möchte nur Events einer bestimmten Kategorie sehen. |
| **Vorbedingung** | Events wurden bereits geladen und werden in der Timeline angezeigt. |
| **Nachbedingung** | Die Timeline zeigt nur die zur Auswahl passenden Events. |

### Hauptablauf

1. Die Nutzer:in öffnet die Filterfunktion.
2. Die Nutzer:in wählt eine Kategorie aus.
3. Die bereits geladenen Events werden anhand der ausgewählten Kategorie gefiltert.
4. Die Timeline wird mit den gefilterten Events aktualisiert.

### Ausnahmefälle

- Gibt es keine passenden Events, wird eine entsprechend leere Darstellung angezeigt.
- Die Nutzer:in kann den Filter entfernen und wieder alle Events anzeigen.

---

## F2.6 UC-06 – Statistik berechnen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-06 |
| **Name** | Statistik berechnen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in lässt eine aggregierte Statistik auf Basis der vorhandenen Events erstellen. |
| **Trigger** | Die Nutzer:in öffnet die Statistikansicht. |
| **Vorbedingung** | Events sind im System vorhanden. |
| **Nachbedingung** | Die berechnete Statistik wird in der Statistikansicht dargestellt. |

### Hauptablauf

1. Die Nutzer:in öffnet das `StatsDashboard`.
2. Das Frontend fordert die Statistikdaten über den `ApiClient` an.
3. Die Anfrage wird an `routes/stats` weitergeleitet.
4. Der `statsService` berechnet die aggregierten Werte.
5. Die benötigten Event-Daten werden über die Models aus der SQLite-Datenbank geladen.
6. Die berechneten Statistikdaten werden an das Frontend zurückgegeben.
7. Das `StatsDashboard` stellt die Statistik dar.

### Ausnahmefälle

- Sind keine auswertbaren Events vorhanden, kann keine sinnvolle Statistik erstellt werden.
- Bei einem Fehler beim Abrufen oder Berechnen der Daten wird eine Fehlermeldung angezeigt.

---

## F2.7 UC-07 – Registrieren und Login

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-07 |
| **Name** | Registrieren und Login |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in registriert sich oder meldet sich mit bestehenden Zugangsdaten an. |
| **Trigger** | Die Nutzer:in möchte sich registrieren oder anmelden. |
| **Vorbedingung** | Die Lifeline-Anwendung ist erreichbar. |
| **Nachbedingung** | Bei erfolgreicher Anmeldung erhält die Nutzer:in Zugriff auf die Anwendung. |

### Hauptablauf – Registrierung

1. Die Nutzer:in öffnet das Registrierungsformular.
2. Die Nutzer:in gibt die erforderlichen Zugangsdaten ein.
3. Das Frontend übermittelt die Daten über den `ApiClient`.
4. Das Backend verarbeitet die Anfrage über `routes/auth`.
5. Die Zugangsdaten werden geprüft und der Nutzer wird gespeichert.
6. Die Registrierung wird bestätigt.

### Hauptablauf – Login

1. Die Nutzer:in öffnet das Login-Formular.
2. Die Nutzer:in gibt E-Mail und Passwort ein.
3. Das Frontend übermittelt die Zugangsdaten über den `ApiClient`.
4. Das Backend verarbeitet die Anfrage über `routes/auth`.
5. Die Zugangsdaten werden geprüft.
6. Bei korrekten Zugangsdaten wird eine Session bzw. ein Token bereitgestellt.
7. Die Nutzer:in erhält Zugriff auf die Anwendung.

### Ausnahmefälle

- Bei ungültigen Zugangsdaten wird die Anmeldung abgelehnt.
- Bei fehlenden oder ungültigen Eingaben wird eine Fehlermeldung angezeigt.
- Bei einer bereits vorhandenen Registrierung wird keine zweite Registrierung mit denselben Zugangsdaten angelegt.