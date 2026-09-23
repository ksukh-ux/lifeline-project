## 2. Randbedingungen

### 2.1 Technische Randbedingungen

| ID | Randbedingung | Beschreibung |
|---|---|---|
| TECH-01 | Frontend-Stack | React, TypeScript, Vite, Tailwind CSS; Icons mit lucide-react, PNG-Export mit html2canvas |
| TECH-02 | Backend-Stack | Node.js, TypeScript, Express |
| TECH-03 | Datenbank | SQLite über das eingebaute Modul `node:sqlite` (Node.js ab 22.13), kein separater Datenbankserver |
| TECH-04 | Versionsverwaltung | Git, GitHub |
| TECH-05 | Entwicklungsumgebung | Visual Studio Code |

### 2.2 Organisatorische Randbedingungen

| ID | Randbedingung | Beschreibung |
|---|---|---|
| ORG-01 | Teamgröße | 4 Personen |
| ORG-02 | Betreuung | Prof. Dr. Carsten Lucke |
| ORG-03 | Harte Abgabefrist | 25. September 2026 (M3) |
| ORG-04 | Modul | Wirtschaftsinformatik-Projekt I (WK_1106), SS 2026 |

### 2.3 Konventionen

| ID | Konvention | Beschreibung |
|---|---|---|
| CONV-01 | Sprache | Dokumentation und Code-Kommentare auf Deutsch |
| CONV-02 | Commit-Stil | Conventional Commits (`type(scope): description`) |
| CONV-03 | Doku-Trennung | Spezifikation nach Siedersleben (`docs/spec/`), Architektur nach arc42 (`docs/arch/`) |
| CONV-04 | Diagramme | In der Architektur Mermaid direkt im Markdown; in der Spezifikation zusätzlich PlantUML, jeweils mit Quelltext im Repository |
| CONV-05 | Secret-Handling | Konfiguration und mögliche Geheimnisse (z. B. künftige API-Schlüssel) ausschließlich in `.env`, niemals im Repository (`.gitignore`) |

### 2.4 Datenschutz-Randbedingungen

Da Lifeline persönliche Ziele und Lebensereignisse enthalten kann, gelten
zusätzlich zu den technischen Schutzmaßnahmen (Validierung, Zugriffs-
kontrolle, Passwort-Hashing – siehe Kapitel 8.1 und 8.2) zwei grundsätzliche
Randbedingungen für den Umgang mit Daten:

| ID | Randbedingung | Beschreibung |
|---|---|---|
| DS-01 | Datensparsamkeit | Es werden ausschließlich die für die Kernfunktion (Timeline-Einträge, Login) fachlich notwendigen Felder erhoben (siehe D1/D2); keine zusätzlichen personenbezogenen Daten ohne konkreten Verwendungszweck |
| DS-02 | Keine unnötige Speicherung sensibler Daten | Es werden keine sensiblen Daten (z. B. Klartext-Passwörter, vgl. CONV-05) gespeichert oder geloggt, die über den fachlich notwendigen Umfang hinausgehen |

Die übrigen, ursprünglich in der Spezifikation (P2 §7) genannten
Sicherheitsaspekte – Eingabevalidierung, kontrollierter Datenbankzugriff
ausschließlich über das Backend, sichere Behandlung von Anmeldedaten und
nutzerbezogene Zugriffskontrolle – sind bereits konkret in Kapitel 5
(Bausteinsicht) und Kapitel 8 (Querschnittskonzepte) beschrieben und
werden hier nicht dupliziert.
