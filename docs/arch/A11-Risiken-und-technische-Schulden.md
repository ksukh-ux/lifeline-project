## 11. Risiken und technische Schulden

### 11.1 Risiken

| ID | Risiko | Auswirkung | Verantwortlich | Gegenmaßnahme |
|---|---|---|---|---|
| R-01 | Hosting-Anbieter mit flüchtigem Dateisystem gewählt | SQLite-Datei geht bei jedem Neu-Deploy verloren | Person D | Vor endgültiger Anbieterwahl explizit auf persistenten Speicher prüfen (vgl. Kapitel 7) |
| R-02 | Enger Zeitrahmen bis 25.09.2026 | Nicht alle Muss-Anforderungen rechtzeitig fertig | Projektleitung | Wochenplan aus PROJEKT_FAHRPLAN.md einhalten, wöchentlicher Fortschritts-Check |
| R-03 | Ungleichmäßige Commit-Verteilung im Team | Laut Modulbeschreibung Indiz für Fremdentwicklung, möglicher Punktabzug in Säule 3 | alle | Jede Person committet regelmäßig im eigenen Feature-Branch, keine Sammel-Commits kurz vor Abgabe |
| R-04 | Kein festgelegtes Test-Framework | Akzeptanzkriterien aus der Spec bleiben ungeprüft | Person C | Framework (z. B. Jest) vor Implementierungsbeginn festlegen |

### 11.2 Technische Schulden

| ID | Schuld | Konsequenz | Bezug |
|---|---|---|---|
| D-01 | SQLite statt Mehrbenutzer-fähiger Datenbank | Kein echter Produktivbetrieb mit vielen gleichzeitigen Nutzer:innen möglich | ADR-003 |
| D-02 | Session-Store In-Memory statt persistent | Aktive Sessions gehen bei Server-Neustart verloren | Kapitel 8.3, ADR-004 |
| D-03 | Keine erweiterten Security-Header (z. B. Content-Security-Policy) | Theoretische Angriffsfläche, falls künftig Nutzereingaben ungefiltert dargestellt werden | Kapitel 8.3 |