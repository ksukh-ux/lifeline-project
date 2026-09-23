## 4. Lösungsstrategie

### 4.1 Technologie

- **React, TypeScript, Vite** als Frontend – Single Page Application im Browser (TECH-01)
- **Node.js, TypeScript, Express** als Backend – stellt eine REST-API bereit (TECH-02)
- **SQLite** als eingebettete Datenbank, kein separater Datenbankserver nötig (TECH-03)
- Die Timeline wird um gesetzliche Feiertage aus einem öffentlichen Dienst ergänzt, den das Backend vermittelt (NB-02, ADR-008). Keine Warteschlangen, keine Hintergrundprozesse und keine zusätzliche Infrastruktur ([CON-3b-02](../spec/P1-constraints.md#con-3b-02-kein-scheduler-kein-hintergrundprozess)). Ein Instagram-Import ist nur als spätere Erweiterung beschrieben und nicht umgesetzt (S1.4, OP-07).

### 4.2 Grobzerlegung

Vier Bausteine: **Frontend (React-SPA)** → **Backend/API (Express)** →
**Datenbank (SQLite)** und **Bildablage (Dateisystem)**.

Das Frontend kommuniziert ausschließlich über HTTP-Anfragen mit dem
Backend; das Backend ist der einzige Zugriffspunkt auf Datenbank, Bildablage
und Feiertagsdienst. Bilder werden als Datei gespeichert, in der Datenbank
steht nur der Pfad (ADR-006). Keine separate Worker- oder Queue-Schicht, da
alle Operationen synchron innerhalb einer Anfrage abgeschlossen werden können.

Wie diese Bausteine tatsächlich bereitgestellt werden (SQLite läuft
z. B. eingebettet im Backend-Prozess, nicht als eigener Server),
wird erst in Kapitel 7 (Verteilungssicht) festgelegt. Details der
Bausteine selbst in Kapitel 5 (Bausteinsicht).

### 4.3 Vorgehen je Qualitätsziel

| Qualitätsziel | Vorgehen | Verankert in |
|---|---|---|
| QG-01 Benutzbarkeit | Klar getrennte, wiederverwendbare UI-Komponenten (Formular, Timeline, Detailansicht); konsistente Darstellung | Kapitel 5 (Bausteinsicht), Kapitel 8 (Querschnittskonzepte) |
| QG-02 Nachvollziehbarkeit | Validierung der Eingaben im Backend vor dem Speichern; typisierte Datenmodelle durch TypeScript auf beiden Seiten | Kapitel 8 (Querschnittskonzepte), Spec D1/D2 |
| QG-03 Erweiterbarkeit | Klare Trennung Frontend/Backend über eine REST-API; Backend kapselt den Datenbankzugriff, sodass SQLite bei Bedarf später austauschbar bleibt | Kapitel 9 (ADRs) |

### 4.4 Organisatorisches Vorgehen

Team von 4 Personen (ORG-01), Betreuung durch Prof. Dr. Carsten Lucke
(ORG-02). Vorgegebene Rahmenwerke: Conventional Commits, arc42 für die
Architektur, Siedersleben für die Spezifikation; die Trennung zwischen
`docs/spec/` und `docs/arch/` ist verbindlich (CONV-03). Harte
Abgabefrist 25. September 2026 (ORG-03) – daher bewusst schlanke
Architektur ohne zusätzliche Infrastruktur-Komplexität, die im
Zeitrahmen nicht mehr sauber umsetzbar wäre.
