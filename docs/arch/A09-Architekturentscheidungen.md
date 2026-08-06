## 9. Architekturentscheidungen

Die grundlegenden Technologie-Entscheidungen wurden bereits in Kapitel 4
(Lösungsstrategie) benannt. Dieses Kapitel vertieft die fünf wichtigsten
davon um Alternativen, Begründung und Konsequenzen.

### ADR-001: Frontend-Framework – React

**Status:** Entschieden

**Kontext:** Für die Umsetzung der Timeline-, Formular- und
Statistik-Ansichten wird ein komponentenbasiertes Frontend-Framework
benötigt, das ein Anfänger-Team in kurzer Zeit produktiv nutzen kann.

**Alternativen:**
- Vue.js – ähnlich einfacher Einstieg, kleinere Community
- Angular – deutlich höhere Einstiegshürde, für den Projektumfang überdimensioniert
- Vanilla JavaScript ohne Framework – volle Kontrolle, aber deutlich mehr Boilerplate-Code für Komponentenverwaltung

**Entscheidung:** React mit TypeScript und Vite (vgl. TECH-01, Kapitel 2).

**Begründung:** Größte Verbreitung und Dokumentation, dadurch beste
Lernkurve für ein Team ohne Vorerfahrung; komponentenbasierte Struktur
passt direkt zur Bausteinsicht (Kapitel 5).

**Konsequenzen:** Team muss sich in React/JSX einarbeiten; dafür breite
Verfügbarkeit von Tutorials und Fehlerlösungen im Netz.

---

### ADR-002: Backend-Technologie – Node.js mit Express

**Status:** Entschieden

**Kontext:** Das Backend muss REST-Endpunkte bereitstellen, Eingaben
validieren und auf die Datenbank zugreifen.

**Alternativen:**
- Python mit Django/Flask – ebenfalls einsteigerfreundlich, aber zweite
  Programmiersprache neben TypeScript nötig
- Java mit Spring Boot – deutlich höhere Komplexität, für Projektumfang
  nicht gerechtfertigt

**Entscheidung:** Node.js mit Express, in TypeScript (vgl. TECH-02).

**Begründung:** Eine Programmiersprache (TypeScript) für Frontend *und*
Backend reduziert die Lernkurve für das Team; Express ist minimalistisch
und ausreichend für den geplanten Funktionsumfang.

**Konsequenzen:** Kein "Batteries-included"-Framework wie Django –
Middleware (Validierung, Auth) muss selbst zusammengestellt werden.

---

### ADR-003: Persistenz – SQLite

**Status:** Entschieden

**Kontext:** Timeline-Einträge und Nutzerdaten müssen dauerhaft
gespeichert werden.

**Alternativen:**
- PostgreSQL – leistungsfähiger, benötigt aber einen separaten
  Datenbankserver und dessen Betrieb/Konfiguration
- MongoDB (NoSQL) – passt schlechter zum klar relationalen Datenmodell
  (Nutzer → Events, Kapitel 5, 8.1)

**Entscheidung:** SQLite (vgl. TECH-03).

**Begründung:** Kein separater Datenbankserver nötig (vgl. Kapitel 7,
ein Deployable); für die Datenmenge eines Einzelnutzer-Prototyps völlig
ausreichend; das relationale Datenmodell passt gut zu SQLite.

**Konsequenzen:** Keine parallelen Schreibzugriffe mehrerer Prozesse
möglich – für den Projektumfang (kein Produktivbetrieb, siehe P1 §7)
unkritisch, wäre bei echtem Mehrnutzerbetrieb aber ein Risiko (→ Kapitel 11).

---

### ADR-004: Authentifizierung – Session-basiert statt JWT

**Status:** Entschieden

**Kontext:** Nutzer:innen müssen sich anmelden können, sodass jede
Person nur ihre eigenen Events sieht (vgl. Kapitel 6.2, 8.3).

**Alternativen:**
- JWT (JSON Web Tokens) – zustandslos, aber erfordert eigene
  Refresh-Logik und sichere clientseitige Speicherung

**Entscheidung:** Klassische Session mit serverseitigem Cookie.

**Begründung:** Einfacher umzusetzen für ein Anfänger-Team; kein
Refresh-Mechanismus nötig; für eine Single-Origin-Web-App ohne mobile
native Clients ausreichend.

**Konsequenzen:** Session-Zustand liegt serverseitig (In-Memory oder
SQLite-Tabelle, siehe Kapitel 8.3) – bei Server-Neustart gehen aktive
Sessions verloren, für Demo-/Projektzwecke akzeptabel.

---

### ADR-005: Projektumfang – Web-App statt PWA/native App

**Status:** Entschieden

**Kontext:** Ursprünglich war auch eine mobile-taugliche/installierbare
Version angedacht.

**Alternativen:**
- PWA (installierbar über Manifest + Service Worker)
- Native Apps (React Native, Swift, Kotlin)

**Entscheidung:** Reine Web-Anwendung ohne PWA- oder native
Mobile-Unterstützung.

**Begründung:** Team-Entscheidung, den Scope bewusst zu begrenzen
(vgl. P1 §7, native Apps explizit ausgeschlossen); reduziert
Komplexität deutlich bei knappem Zeitrahmen bis zur Abgabe am
25. September 2026.

**Konsequenzen:** Keine Offline-Fähigkeit, kein Home-Screen-Icon; bei
Bedarf später als Erweiterung nachrüstbar, ohne die Kernarchitektur
zu ändern.