## 12. Glossar

Fachliche Begriffe (Event, Timeline, Kategorie) sind bereits im
Spezifikations-Baustein E2 definiert und werden hier nicht wiederholt.
Dieses Glossar enthält ausschließlich Begriffe, die spezifisch für
dieses Architekturdokument sind.

| Begriff | Bedeutung |
|---|---|
| ADR (Architecture Decision Record) | Dokumentierte Architekturentscheidung mit Kontext, Alternativen, Entscheidung, Begründung, Konsequenzen (Kapitel 9) |
| Baustein | Abgrenzbarer Bestandteil des Systems (Komponente/Modul), siehe Kapitel 5 |
| Blackbox | Beschreibung eines Bausteins über Verantwortlichkeit und Schnittstellen, ohne die innere Struktur zu zeigen |
| Whitebox | Beschreibung der inneren Struktur eines Bausteins inkl. seiner Unter-Bausteine |
| QG (Qualitätsziel) | ID-Präfix für ein priorisiertes Qualitätsziel (Kapitel 1.2), z. B. QG-01 |
| TECH- / ORG- / CONV- | ID-Präfixe für technische bzw. organisatorische Randbedingungen und Konventionen (Kapitel 2) |
| UC (Use Case) | ID-Präfix für einen Anwendungsfall aus der Spezifikation (Baustein F2) |
| Session | Serverseitig gespeicherter Anmeldezustand einer Nutzerin/eines Nutzers (Kapitel 8.2) |
| Origin | Kombination aus Protokoll, Host und Port (z. B. `http://localhost:5173`); Browser trennen Cookies und Anfragen nach Origin (Kapitel 8.2) |
| CORS | Cross-Origin Resource Sharing: Regeln, mit denen das Backend Anfragen von einem anderen Origin (in der Entwicklung das Frontend auf Port 5173) erlaubt |
| Data-URI | Bilddaten als Text im Format `data:image/png;base64,…`; so werden Bilder im JSON-Body hochgeladen (Kapitel 8.3, ADR-006) |
| Migration | Einmalige Anpassung eines bestehenden Datenbestands an ein geändertes Schema (Kapitel 8.6) |
| NB (Nachbarsystem) | ID-Präfix für ein System außerhalb von Lifeline, mit dem Daten ausgetauscht werden (Spezifikation S1, Kapitel 3) |
| Reverse Proxy | Vorgeschalteter Server, der HTTPS entgegennimmt und die Anfragen an den Express-Prozess weiterleitet (Kapitel 7.1.2) |
