# F3 – Anwendungsfunktionen

Die Anwendungsfunktionen beschreiben die fachlichen und technischen Funktionen der Lifeline-Anwendung. Sie basieren auf den in der Architektur definierten Use Cases und Bausteinen.

## F3.1 Benutzerzugang

Die Anwendung ermöglicht die Registrierung und Anmeldung von Nutzer:innen.

### Zugehöriger Use Case

- UC-07 – Registrieren und Login

### Funktion

Die Nutzer:in kann sich registrieren oder mit bestehenden Zugangsdaten anmelden.

Die eingegebenen Zugangsdaten werden über den `ApiClient` an das Backend übertragen. Das Backend verarbeitet die Anfrage über `routes/auth`.

Bei erfolgreicher Anmeldung wird eine Session bereitgestellt (Session-Cookie).

---

## F3.2 Event-Verwaltung

Die Anwendung ermöglicht das Anlegen, Bearbeiten, Löschen und Abrufen persönlicher Events.

### Zugehörige Use Cases

- UC-01 – Event anlegen
- UC-02 – Event bearbeiten
- UC-03 – Event löschen
- UC-04 – Timeline ansehen

### Funktion

Über das `EventForm` können neue Events angelegt und bestehende Events bearbeitet werden.

Die Anfragen werden über den `ApiClient` an das Backend übertragen und über `routes/events` verarbeitet.

Die eingehenden Daten werden durch die `middleware/validation` geprüft.

Die Speicherung und der Zugriff auf die Events erfolgen über die Models und die SQLite-Datenbank. Dabei werden die Events dem jeweiligen Benutzerkonto zugeordnet.

---

## F3.3 Timeline-Darstellung

Die Anwendung stellt die vorhandenen Events chronologisch in einer horizontalen Timeline dar.

### Zugehöriger Use Case

- UC-04 – Timeline ansehen

### Funktion

Die Timeline fordert die Events des angemeldeten Benutzerkontos über den `ApiClient` an.

Das Backend stellt die Daten über `routes/events` bereit.

Das Frontend stellt die erhaltenen Events chronologisch in der Timeline dar.

Die Timeline verwendet ein zeitliches Raster mit Jahresangaben zur Orientierung.

Die Nutzer:in kann die Timeline horizontal verschieben, um unterschiedliche Zeitbereiche anzuzeigen.

Über eine Zoom-Funktion kann die Darstellung der Timeline vergrößert oder verkleinert werden.

Sind keine Events vorhanden, wird eine leere Timeline angezeigt.

---

## F3.4 Timeline-Filterung

Die Anwendung ermöglicht die Filterung bereits geladener Events nach Kategorien.

### Zugehöriger Use Case

- UC-05 – Timeline filtern

### Funktion

Die Nutzer:in wählt über die `FilterBar` eine Kategorie aus.

Die bereits geladenen Events werden clientseitig anhand der ausgewählten Kategorie gefiltert.

Beim Entfernen des Filters werden wieder alle geladenen Events angezeigt.

Für die Filterung ist keine zusätzliche Anfrage an das Backend erforderlich.

---

## F3.5 Statistik

Die Anwendung ermöglicht die Berechnung und Darstellung aggregierter Informationen zu den vorhandenen Events.

### Zugehöriger Use Case

- UC-06 – Statistik berechnen

### Funktion

Das `StatsDashboard` fordert die Statistikdaten über den `ApiClient` an.

Die Anfrage wird über `routes/stats` verarbeitet.

Der `statsService` berechnet die aggregierten Werte auf Grundlage der Events des angemeldeten Benutzerkontos.

Die benötigten Daten werden über die Models aus der SQLite-Datenbank geladen.

Die berechneten Statistikdaten werden an das Frontend zurückgegeben und im `StatsDashboard` dargestellt.

---

## F3.6 Eingabevalidierung

Die Anwendung prüft relevante Eingaben vor ihrer Verarbeitung.

### Zugehörige Funktionen

- Event anlegen
- Event bearbeiten
- Registrierung und Login

### Funktion

Die `middleware/validation` prüft die entsprechenden eingehenden Daten, bevor diese vom Backend verarbeitet werden.

Ungültige Eingaben werden abgelehnt und als Fehler an das Frontend zurückgegeben.

Dadurch wird verhindert, dass ungültige Daten verarbeitet oder gespeichert werden.

---

## F3.7 Timeline-Export

Die Anwendung ermöglicht den Export der aktuell angezeigten Timeline als Bilddatei.

### Funktion

Die Nutzer:in kann die Timeline über eine Exportfunktion als PNG-Datei herunterladen. Der Export erfolgt clientseitig im Frontend, ohne zusätzliche Anfrage an das Backend.
