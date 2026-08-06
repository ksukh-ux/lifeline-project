## 10. Qualitätsanforderungen

### 10.1 Qualitätsbaum

| Kategorie | Bezug | Priorität |
|---|---|---|
| Benutzbarkeit | QG-01 (Kapitel 1) | Hoch |
| Nachvollziehbarkeit/Korrektheit | QG-02 (Kapitel 1) | Hoch |
| Erweiterbarkeit/Wartbarkeit | QG-03 (Kapitel 1) | Hoch |
| Sicherheit | N1 (Spec, Datenschutz) | Mittel |
| Performance | N1 (Spec, Ladezeit) | Niedrig |

Sicherheit und Performance waren in Kapitel 1 nicht als Top-3-Ziel
gelistet (bewusst laut Tip 1-16 "nur 3–5 Ziele"), tauchen aber in den
nichtfunktionalen Anforderungen der Spec auf – deshalb hier mit
niedrigerer Priorität ergänzt, nicht weggelassen.

### 10.2 Qualitätsszenarien

| # | Kategorie | Szenario | Erwartete Reaktion | Messkriterium |
|---|---|---|---|---|
| QS-01 | Benutzbarkeit | Eine neue Nutzerin öffnet die App zum ersten Mal und möchte ein Event anlegen | Formular ist ohne Anleitung verständlich ausfüllbar | Aufgabe abgeschlossen in < 2 Minuten (informeller Usability-Test im Team) |
| QS-02 | Nachvollziehbarkeit | Ein Event wird mit Enddatum vor Startdatum abgeschickt | Server lehnt ab, verständliche Fehlermeldung, nichts wird gespeichert | Automatisierter Test (siehe UC-01, Akzeptanzkriterium) |
| QS-03 | Erweiterbarkeit | Eine neue Event-Kategorie (z. B. "Weiterbildung") soll ergänzt werden | Änderung ist an einer zentralen Stelle möglich, keine Anpassung der Kernlogik nötig | Umsetzbar in < 30 Minuten, < 3 geänderte Dateien |
| QS-04 | Sicherheit | Nutzer A ruft per direkter API-Anfrage ein Event von Nutzer B über dessen ID ab | Zugriff wird verweigert | Automatisierter Test erwartet HTTP 403 |
| QS-05 | Performance | Die Timeline eines Nutzers mit 200 Events wird geladen | Darstellung ohne spürbare Verzögerung | Ladezeit < 2 Sekunden (gemessen mit Browser-Devtools) |