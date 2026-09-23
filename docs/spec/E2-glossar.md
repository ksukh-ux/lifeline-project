# E2 – Glossar

## E2.1 Übersicht

Das Glossar definiert die zentralen fachlichen Begriffe der Lifeline-Anwendung und stellt eine einheitliche Verwendung dieser Begriffe innerhalb der Spezifikation sicher.

| Begriff | Bedeutung |
|---|---|
| Event | Ein persönliches Ereignis oder ein Meilenstein, der von einer Nutzerin bzw. einem Nutzer in Lifeline angelegt und auf der Timeline dargestellt wird. |
| Timeline | Chronologische Darstellung der Events einer Nutzerin bzw. eines Nutzers. |
| Kategorie | Fachliche Einordnung eines Events, zugleich Grundlage für die farbliche Darstellung in der Timeline. Kategorie ist eine eigene, pro Person verwaltete Entität mit sechs vorbelegten Startkategorien; eigene Kategorien lassen sich jederzeit ergänzen (siehe D1.3, UC-08). |
| Meilenstein | Kategorie für besonders bedeutsame persönliche Ereignisse. |
| Karriere | Kategorie für berufliche Events. |
| Bildung | Kategorie für Events im Zusammenhang mit Ausbildung, Studium oder Weiterbildung. |
| Beziehung | Kategorie für Events im Zusammenhang mit persönlichen Beziehungen. |
| Reise | Kategorie für Events, die sich auf Reisen beziehen. |
| Gesundheit | Kategorie für Events im Zusammenhang mit Gesundheit und Wohlbefinden. |
| Bedeutung (significance) | Ganze Zahl von 0 bis 100, die angibt, wie wichtig ein Event für die Nutzer:in ist; bestimmt die Größe des Markers in der Timeline. Die Skala ist ordinal (D2.2). |
| Nutzer:in | Person, die Lifeline verwendet und eigene Events verwalten kann. |
| Uhrzeit | Optionale Uhrzeit eines Events im Format `HH:MM`. |
| Bild (image_path) | Optional einem Event zugeordnetes Bild; wird als Datei im Backend gespeichert, in der Datenbank steht nur der Pfad. |
| Registrierung | Vorgang zum Erstellen eines Benutzerkontos in Lifeline. |
| Login | Anmeldung einer registrierten Nutzerin bzw. eines registrierten Nutzers bei Lifeline. |
| Abmelden | Beenden der Session durch die Nutzer:in; danach ist eine erneute Anmeldung nötig. |
| Session | Anmeldezustand nach erfolgreichem Login; endet mit dem Abmelden, nach 24 Stunden oder bei einem Neustart der Anwendung. |
| Startkategorien | Die sechs Kategorien Meilenstein, Karriere, Bildung, Beziehung, Reise und Gesundheit, die bei der Registrierung für jedes Konto angelegt werden. |
| Übersicht | Ansicht der Timeline über alle Jahre, in denen Events liegen. |
| Jahresansicht | Ansicht der Timeline über ein Kalenderjahr mit Monatsmarken und Feiertagen. |
| Zoom | Einstellung der Breite der Timeline; flüchtiger Anzeigezustand, der nicht gespeichert wird. |
| Filter | Auswahl einer Kategorie, auf deren Events Timeline und Event-Liste eingeschränkt werden; wirkt nicht auf die Statistik. |
| Statistik | Verdichtete Kennzahlen über die eigenen Events: Anzahl, Zeitspanne und je Kategorie Anzahl und Tendenz der Bedeutung. |
| Tendenz | Mittelwert der Bedeutung je Kategorie; nur als grobe Orientierung, weil die Bedeutungsskala ordinal ist. |
| Feiertag | Gesetzlicher Feiertag, den Lifeline vom Feiertagsdienst abfragt und in der Jahresansicht markiert; wird nicht gespeichert. |
| Feiertagsdienst | Öffentlicher Dienst im Internet, der die Feiertage eines Landes und Jahres liefert (Nachbarsystem NB-02, S1.3). |
| Nachbarsystem | System außerhalb von Lifeline, mit dem Lifeline Daten austauscht (S1). |
| Sicherung | JSON-Datei mit den eigenen Kategorien und Events, die exportiert (UC-09) und wieder importiert (UC-10) werden kann. |
| Timeline-Export | Herunterladen der aktuell dargestellten Timeline als PNG-Bild (AF-04). |
| Invariante | Bedingung, die für den gespeicherten Datenbestand immer gelten muss; gekennzeichnet mit `INV-…` (D1.7). |
