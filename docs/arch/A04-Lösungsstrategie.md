## 4. Lösungsstrategie

### 4.1 Technologie

- **React, TypeScript, Vite** als Frontend – Single Page Application im Browser (TECH-01)
- **Node.js, TypeScript, Express** als Backend – stellt eine REST-API bereit (TECH-02)
- **SQLite** als eingebettete Datenbank, kein separater Datenbankserver nötig (TECH-03)
- Keine produktive Instagram-OAuth-Anbindung, keine Warteschlangen/Worker und keine zusätzliche Infrastruktur. Ein manueller Instagram-Importprototyp ist als abgegrenzte Erweiterung in S1.4 dokumentiert; der Projektumfang bleibt ansonsten bewusst schlank (vgl. P1 §7 Abgrenzung).

### 4.2 Grobzerlegung

Drei Bausteine: **Frontend (React-SPA)** → **Backend/API (Express)** →
**Datenbank (SQLite)**.

Das Frontend kommuniziert ausschließlich über HTTP-Anfragen mit dem
Backend; das Backend ist der einzige Zugriffspunkt auf die Datenbank. Ein
Instagram-Import wird wie ein normaler Event-Import verarbeitet; Bilder werden
in der eigenen Upload-Ablage persistiert, nicht nur über eine externe URL referenziert.
Keine separate Worker- oder Queue-Schicht, da alle Operationen
synchron innerhalb einer Anfrage abgeschlossen werden können.

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
