# F2 – Anwendungsfälle

Die Anwendungsfälle beschreiben die Interaktionen zwischen der Nutzerin bzw.
dem Nutzer und der Lifeline-Anwendung. Jeder Anwendungsfall verfolgt ein
fachliches Ziel und führt zu einem definierten Ergebnis.

Technische Implementierungsdetails werden nicht als eigene Anwendungsfälle
betrachtet.

---

## F2.1 Übersicht der Anwendungsfälle

| ID | Anwendungsfall | Bereich | Kurzbeschreibung |
|---|---|---|---|
| UC-01 | Ereignis anlegen | Ereignisverwaltung | Ein neues Lebensereignis erfassen und speichern |
| UC-02 | Ereignis anzeigen | Ereignisverwaltung | Gespeicherte Lebensereignisse betrachten |
| UC-03 | Ereignis bearbeiten | Ereignisverwaltung | Ein vorhandenes Ereignis verändern |
| UC-04 | Ereignis löschen | Ereignisverwaltung | Ein einzelnes Ereignis löschen |
| UC-05 | Alle Ereignisse löschen | Ereignisverwaltung | Alle gespeicherten Ereignisse löschen |
| UC-06 | Nach Kategorie filtern | Darstellung | Ereignisse nach ihrer Kategorie filtern |
| UC-07 | Timeline horizontal navigieren | Darstellung | Den sichtbaren Bereich der Timeline verschieben |
| UC-08 | Timeline zoomen | Darstellung | Die Breite bzw. Skalierung der Timeline verändern |
| UC-09 | Timeline als Bild exportieren | Export | Die Timeline als PNG-Bild exportieren |

---

## F2.2 Use-Case-Diagramm

```plantuml
@startuml

left to right direction

actor "Nutzer/in" as User

rectangle "Lifeline" {

  usecase "UC-01\nEreignis anlegen" as UC01
  usecase "UC-02\nEreignis anzeigen" as UC02
  usecase "UC-03\nEreignis bearbeiten" as UC03
  usecase "UC-04\nEreignis löschen" as UC04
  usecase "UC-05\nAlle Ereignisse löschen" as UC05

  usecase "UC-06\nNach Kategorie filtern" as UC06
  usecase "UC-07\nTimeline horizontal navigieren" as UC07
  usecase "UC-08\nTimeline zoomen" as UC08

  usecase "UC-09\nTimeline als Bild exportieren" as UC09
}

User --> UC01
User --> UC02
User --> UC03
User --> UC04
User --> UC05
User --> UC06
User --> UC07
User --> UC08
User --> UC09

@enduml

F2.3 Ereignisverwaltung
UC-01 – Ereignis anlegen
Merkmal	Beschreibung
ID	UC-01
Name	Ereignis anlegen
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer erfasst ein neues Lebensereignis und fügt es der persönlichen Timeline hinzu.
Auslöser	Auswahl von „Ereignis hinzufügen“
Vorbedingung	Die Lifeline-Anwendung ist geöffnet.
Nachbedingung	Das neue Ereignis wurde gespeichert und wird in Timeline und Ereignisliste angezeigt.
Eingaben	Titel, Datum, Beschreibung, Kategorie und Bedeutung
Hauptszenario	1. Nutzer/in öffnet den Dialog „Ereignis hinzufügen“.
2. Nutzer/in gibt die Ereignisdaten ein.
3. Nutzer/in wählt eine Kategorie.
4. Nutzer/in legt die Bedeutung des Ereignisses fest.
5. Nutzer/in bestätigt die Eingabe.
6. System überprüft die Eingaben.
7. System speichert das Ereignis.
8. System aktualisiert Timeline und Ereignisliste.
Alternativ-/Ausnahmeszenario	Ein erforderliches Feld fehlt oder enthält einen ungültigen Wert. Das System weist darauf hin und speichert das Ereignis nicht.
UC-02 – Ereignis anzeigen
Merkmal	Beschreibung
ID	UC-02
Name	Ereignis anzeigen
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer betrachtet gespeicherte Lebensereignisse in der Timeline und in der Ereignisliste.
Auslöser	Öffnen der Anwendung oder Auswahl eines Ereignisses
Vorbedingung	Die Anwendung ist geöffnet.
Nachbedingung	Die vorhandenen Ereignisse werden dargestellt.
Hauptszenario	1. System lädt die gespeicherten Ereignisse.
2. System ordnet die Ereignisse chronologisch.
3. System stellt die Ereignisse auf der Timeline dar.
4. System stellt die Ereignisse zusätzlich in der Ereignisliste dar.
5. Nutzer/in kann ein Ereignis auswählen.
Alternativ-/Ausnahmeszenario	Sind keine Ereignisse vorhanden, zeigt das System einen entsprechenden Hinweis an.
UC-03 – Ereignis bearbeiten
Merkmal	Beschreibung
ID	UC-03
Name	Ereignis bearbeiten
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer verändert die Daten eines bereits vorhandenen Ereignisses.
Auslöser	Auswahl der Bearbeiten-Funktion eines Ereignisses
Vorbedingung	Das zu bearbeitende Ereignis existiert.
Nachbedingung	Die geänderten Daten wurden gespeichert und werden aktualisiert dargestellt.
Hauptszenario	1. Nutzer/in wählt ein Ereignis.
2. Nutzer/in öffnet die Bearbeitungsfunktion.
3. System zeigt die vorhandenen Daten an.
4. Nutzer/in verändert die gewünschten Daten.
5. Nutzer/in bestätigt die Änderung.
6. System überprüft die Eingaben.
7. System speichert die Änderungen.
8. System aktualisiert Timeline und Ereignisliste.
Alternativ-/Ausnahmeszenario	Eine Eingabe ist ungültig. Die Änderung wird nicht gespeichert und das System zeigt einen Hinweis an.
UC-04 – Ereignis löschen
Merkmal	Beschreibung
ID	UC-04
Name	Ereignis löschen
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer entfernt ein einzelnes Lebensereignis.
Auslöser	Auswahl der Löschen-Funktion eines Ereignisses
Vorbedingung	Das zu löschende Ereignis existiert.
Nachbedingung	Das Ereignis ist nicht mehr in der Anwendung vorhanden.
Hauptszenario	1. Nutzer/in wählt ein Ereignis.
2. Nutzer/in wählt „Löschen“.
3. System fordert eine Bestätigung an.
4. Nutzer/in bestätigt die Löschung.
5. System löscht das Ereignis.
6. System aktualisiert Timeline und Ereignisliste.
Alternativszenario	Nutzer/in bricht die Löschung ab. Das Ereignis bleibt unverändert bestehen.
UC-05 – Alle Ereignisse löschen
Merkmal	Beschreibung
ID	UC-05
Name	Alle Ereignisse löschen
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer löscht alle gespeicherten Lebensereignisse.
Auslöser	Auswahl von „Alle Daten löschen“
Vorbedingung	Die Anwendung enthält gespeicherte Ereignisse.
Nachbedingung	Alle gespeicherten Ereignisse wurden entfernt.
Hauptszenario	1. Nutzer/in wählt „Alle Daten löschen“.
2. System fordert eine Bestätigung an.
3. Nutzer/in bestätigt die Löschung.
4. System löscht alle Ereignisse.
5. System aktualisiert die Darstellung.
Alternativszenario	Nutzer/in bricht die Löschung ab. Die vorhandenen Ereignisse bleiben bestehen.
F2.4 Darstellung und Navigation
UC-06 – Nach Kategorie filtern
Merkmal	Beschreibung
ID	UC-06
Name	Nach Kategorie filtern
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer grenzt die angezeigten Ereignisse auf eine bestimmte Kategorie ein.
Auslöser	Auswahl einer Kategorie im Kategorie-Filter
Vorbedingung	Die Anwendung ist geöffnet.
Nachbedingung	Es werden nur Ereignisse der ausgewählten Kategorie angezeigt.
Hauptszenario	1. System zeigt die verfügbaren Kategorien an.
2. Nutzer/in wählt eine Kategorie.
3. System filtert die vorhandenen Ereignisse.
4. System aktualisiert Timeline und Ereignisliste.
5. Nutzer/in betrachtet die gefilterten Ereignisse.
Alternativszenario	Nutzer/in wählt „Alle“. Anschließend werden wieder alle Ereignisse angezeigt.
UC-07 – Timeline horizontal navigieren
Merkmal	Beschreibung
ID	UC-07
Name	Timeline horizontal navigieren
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer bewegt den sichtbaren Ausschnitt der Timeline horizontal.
Auslöser	Bewegung des Positions-Schiebereglers oder horizontales Scrollen
Vorbedingung	Die Timeline ist geöffnet und kann horizontal verschoben werden.
Nachbedingung	Ein anderer horizontaler Ausschnitt der Timeline wird angezeigt.
Hauptszenario	1. Nutzer/in bewegt den Positions-Schieberegler oder scrollt horizontal.
2. System ermittelt die neue horizontale Position.
3. System verschiebt den sichtbaren Timeline-Ausschnitt.
4. Der neue Ausschnitt wird dargestellt.
UC-08 – Timeline zoomen
Merkmal	Beschreibung
ID	UC-08
Name	Timeline zoomen
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer verändert die Breite der Timeline, um den zeitlichen Darstellungsbereich anzupassen.
Auslöser	Bewegung des Zoom-Schiebereglers
Vorbedingung	Die Timeline ist geöffnet.
Nachbedingung	Die Breite bzw. Skalierung der Timeline wurde angepasst.
Hauptszenario	1. Nutzer/in bewegt den Zoom-Regler.
2. System übernimmt den neuen Zoom-Faktor.
3. System berechnet die neue Timeline-Breite.
4. System aktualisiert die Timeline-Darstellung.
5. Die horizontale Navigation bleibt möglich.
F2.5 Export
UC-09 – Timeline als Bild exportieren
Merkmal	Beschreibung
ID	UC-09
Name	Timeline als Bild exportieren
Akteur	Nutzer/in
Beschreibung	Die Nutzerin bzw. der Nutzer exportiert die Timeline als PNG-Bild.
Auslöser	Auswahl von „Als Bild exportieren“
Vorbedingung	Die Anwendung ist geöffnet.
Nachbedingung	Eine PNG-Datei mit der Timeline wurde erzeugt und zum Speichern bereitgestellt.
Hauptszenario	1. Nutzer/in wählt „Als Bild exportieren“.
2. System erfasst die Timeline-Darstellung.
3. System erzeugt daraus ein Bild.
4. System stellt die PNG-Datei zum Speichern bereit.
Alternativ-/Ausnahmeszenario	Beim Erzeugen des Bildes tritt ein Fehler auf. Das System informiert die Nutzerin bzw. den Nutzer über den fehlgeschlagenen Export.