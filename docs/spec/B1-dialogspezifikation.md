# B1 – Dialogspezifikation

Die Dialogspezifikation beschreibt die zentralen Benutzeroberflächen von Lifeline und deren Interaktion mit der Nutzer:in. Die beschriebenen Dialoge basieren auf den in der Architektur definierten Frontend-Bausteinen und den zugehörigen Use Cases.

## B1.1 Timeline

### Zweck

Die Timeline dient der chronologischen Darstellung der vorhandenen Events. Die Nutzer:in kann vorhandene Events betrachten und weitere Aktionen auswählen.

### Zugehörige Use Cases

- UC-04 – Timeline ansehen
- UC-02 – Event bearbeiten
- UC-03 – Event löschen
- UC-05 – Timeline filtern

### Angezeigte Informationen

Die Timeline zeigt die vorhandenen Events in chronologischer Reihenfolge.

Für ein Event werden die in der Anwendung gespeicherten Informationen dargestellt.

### Benutzeraktionen

Die Nutzer:in kann:

- vorhandene Events auswählen,
- ein Event bearbeiten,
- ein Event löschen,
- die Timeline über die Filterfunktion filtern,
- die Filterung wieder aufheben,
- die Timeline als Bild exportieren (PNG).

### Verhalten

Beim Öffnen der Timeline werden die vorhandenen Events geladen und dargestellt.

Wird ein Filter ausgewählt, werden die bereits geladenen Events entsprechend der ausgewählten Kategorie gefiltert.

Nach dem Anlegen, Bearbeiten oder Löschen eines Events wird die Darstellung der Timeline aktualisiert.

### Fehlersituationen

- Können die Events nicht geladen werden, wird eine Fehlermeldung angezeigt.
- Sind keine Events vorhanden, wird eine leere Timeline dargestellt.

---

## B1.2 EventForm

### Zweck

Das EventForm dient zum Anlegen und Bearbeiten von Events.

### Zugehörige Use Cases

- UC-01 – Event anlegen
- UC-02 – Event bearbeiten

### Eingaben

Die Nutzer:in gibt die für ein Event erforderlichen Informationen in das Formular ein.

Beim Bearbeiten werden die bereits vorhandenen Informationen des Events im Formular angezeigt und können verändert werden.

### Benutzeraktionen

Die Nutzer:in kann:

- die Informationen eines neuen Events eingeben,
- vorhandene Event-Daten bearbeiten,
- das Formular absenden,
- die Eingabe abbrechen.

### Verhalten

Beim Anlegen eines Events wird ein leeres Formular angezeigt.

Beim Bearbeiten eines bestehenden Events werden die vorhandenen Daten im Formular angezeigt.

Nach dem Absenden werden die eingegebenen Daten an das Backend übermittelt und dort validiert.

Bei erfolgreicher Speicherung wird die Timeline aktualisiert.

### Fehlersituationen

- Bei ungültigen oder fehlenden Eingaben wird eine Fehlermeldung angezeigt.
- Das Event wird bei einer fehlgeschlagenen Validierung nicht gespeichert.

---

## B1.3 FilterBar

### Zweck

Die FilterBar dient zur Filterung der bereits geladenen Events in der Timeline nach Kategorien.

### Zugehöriger Use Case

- UC-05 – Timeline filtern

### Eingaben

Die Nutzer:in wählt eine Kategorie aus der Filterauswahl aus.

### Benutzeraktionen

Die Nutzer:in kann:

- eine Kategorie auswählen,
- den ausgewählten Filter ändern,
- die Filterung aufheben.

### Verhalten

Nach Auswahl einer Kategorie werden die bereits geladenen Events entsprechend der Auswahl gefiltert.

Die gefilterte Darstellung wird direkt in der Timeline angezeigt.

Beim Aufheben des Filters werden wieder alle geladenen Events angezeigt.

Die Filterung erfolgt clientseitig auf den bereits geladenen Daten.

### Fehlersituationen

- Gibt es keine Events, die zur ausgewählten Kategorie passen, wird eine leere Darstellung angezeigt.

---

## B1.4 StatsDashboard

### Zweck

Das StatsDashboard dient zur Darstellung der aus den vorhandenen Events berechneten Statistiken.

### Zugehöriger Use Case

- UC-06 – Statistik berechnen

### Angezeigte Informationen

Das StatsDashboard zeigt die vom System berechneten aggregierten Statistikdaten an.

Die Daten werden nach den in der Anwendung verwendeten Kategorien ausgewertet.

### Benutzeraktionen

Die Nutzer:in kann:

- die Statistikansicht öffnen,
- die berechneten Statistikdaten betrachten.

### Verhalten

Beim Öffnen der Statistikansicht fordert das Frontend die Statistikdaten über den `ApiClient` an.

Die Anfrage wird an `routes/stats` weitergeleitet.

Der `statsService` berechnet die aggregierten Werte auf Grundlage der vorhandenen Events.

Die berechneten Daten werden an das Frontend zurückgegeben und im StatsDashboard dargestellt.

### Fehlersituationen

- Sind keine auswertbaren Events vorhanden, wird keine sinnvolle Statistik dargestellt.
- Bei einem Fehler beim Abrufen oder Berechnen der Statistikdaten wird eine Fehlermeldung angezeigt.

---

## B1.5 AuthForms

### Zweck

Die AuthForms dienen zur Registrierung und Anmeldung der Nutzer:in.

### Zugehöriger Use Case

- UC-07 – Registrieren und Login

### Eingaben

Die Nutzer:in gibt die für die Registrierung oder Anmeldung erforderlichen Zugangsdaten ein.

Für den Login werden E-Mail und Passwort eingegeben.

### Benutzeraktionen

Die Nutzer:in kann:

- das Registrierungsformular öffnen,
- Zugangsdaten für die Registrierung eingeben,
- das Login-Formular öffnen,
- E-Mail und Passwort eingeben,
- die Registrierung oder Anmeldung absenden.

### Verhalten

Bei der Registrierung werden die eingegebenen Daten über den `ApiClient` an das Backend übermittelt.

Das Backend verarbeitet die Anfrage über `routes/auth` und prüft die eingegebenen Daten.

Bei einer erfolgreichen Registrierung wird die Registrierung bestätigt.

Beim Login werden die eingegebenen Zugangsdaten über den `ApiClient` an das Backend übermittelt.

Das Backend prüft die Zugangsdaten. Bei einer erfolgreichen Anmeldung wird eine Session bereitgestellt (Session-Cookie) und die Nutzer:in erhält Zugriff auf die Anwendung.

### Fehlersituationen

- Bei fehlenden oder ungültigen Eingaben wird eine Fehlermeldung angezeigt.
- Bei ungültigen Zugangsdaten wird die Anmeldung abgelehnt.
- Bei einer bereits vorhandenen Registrierung wird keine zweite Registrierung mit denselben Zugangsdaten angelegt.