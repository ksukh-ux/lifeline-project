## 9. Architekturentscheidungen

Die grundlegenden Technologie-Entscheidungen wurden bereits in Kapitel 4
(Lösungsstrategie) benannt. Dieses Kapitel vertieft die fünf wichtigsten
davon: Für jede Entscheidung werden alle ernsthaft betrachteten Optionen
mit ihren jeweiligen Vor- und Nachteilen gegenübergestellt, bevor die
gewählte Option begründet und ihre Konsequenzen benannt werden.

### ADR-001: Frontend-Framework – React

**Status:** Entschieden

**Kontext:** Für die Umsetzung der Timeline-, Formular- und
Statistik-Ansichten wird ein komponentenbasiertes Frontend-Framework
benötigt, das ein Anfänger-Team in kurzer Zeit produktiv nutzen kann.

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **React** (gewählt) | Größte Verbreitung, dadurch beste Dokumentation, meiste Tutorials/Foren-Antworten bei Problemen; komponentenbasierte Struktur passt direkt zur geplanten Bausteinsicht (Kapitel 5) | JSX-Syntax und Hook-Konzept (`useState`, `useEffect`) müssen von Grund auf neu gelernt werden |
| Vue.js | Ähnlich einfacher Einstieg wie React, oft als noch anfängerfreundlicher beschrieben (Template-Syntax näher an HTML) | Deutlich kleinere Community/weniger Team-Vorerfahrung im Umfeld verfügbar; weniger Referenzmaterial für Rückfragen |
| Angular | Vollständiges Framework inkl. eigenem Router, Dependency Injection, Formularvalidierung "out of the box" | Deutlich höhere Einstiegshürde (TypeScript-lastig, viel Boilerplate); für den Projektumfang klar überdimensioniert |
| Vanilla JavaScript ohne Framework | Volle Kontrolle, keine Abhängigkeit von Framework-Versionen/Breaking Changes | Deutlich mehr Boilerplate-Code für Komponentenverwaltung und DOM-Updates von Hand; höheres Fehlerrisiko bei wachsender Anwendung |

**Entscheidung:** React mit TypeScript und Vite (vgl. TECH-01, Kapitel 2).

**Begründung:** Die Kombination aus Lernkurve und Verfügbarkeit von
Lösungshilfen gibt für ein Team ohne Vorerfahrung den Ausschlag; die
komponentenbasierte Struktur passt außerdem direkt zur in Kapitel 5
festgelegten Zerlegung in `TimelineView`, `EventForm`, `FilterBar` usw.

**Konsequenzen:**
- *Positiv:* Team kann bei Problemen auf eine sehr breite Wissensbasis
  (Dokumentation, Stack Overflow, KI-Assistenten) zurückgreifen; die
  Komponentenstruktur hält Frontend-Code von Anfang an modular.
- *Negativ:* Einarbeitungszeit in React/JSX und den Hook-basierten
  State-Management-Stil war zu Projektbeginn nötig; ein Wechsel des
  Frontend-Frameworks wäre nachträglich mit vollständiger Neuimplementierung
  aller Komponenten verbunden (kein inkrementeller Umstieg möglich).

---

### ADR-002: Backend-Technologie – Node.js mit Express

**Status:** Entschieden

**Kontext:** Das Backend muss REST-Endpunkte bereitstellen, Eingaben
validieren und auf die Datenbank zugreifen.

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **Node.js mit Express** (gewählt) | Eine Programmiersprache (TypeScript) für Frontend *und* Backend; Express ist minimalistisch, geringe Einstiegshürde für kleine REST-APIs | Kein "Batteries-included"-Framework – Middleware (Validierung, Sessions) muss selbst ausgewählt und verdrahtet werden |
| Python mit Django/Flask | Ebenfalls einsteigerfreundlich; Django liefert Admin-Oberfläche und ORM direkt mit | Zweite Programmiersprache neben TypeScript nötig, dadurch doppelter Lernaufwand und Kontextwechsel im Team |
| Java mit Spring Boot | Sehr robust, weit verbreitet in Unternehmensumgebungen, starkes Typsystem | Deutlich höhere Komplexität (Annotations, Dependency Injection, Build-Tooling); für den Projektumfang nicht gerechtfertigt |

**Entscheidung:** Node.js mit Express, in TypeScript (vgl. TECH-02).

**Begründung:** Eine Sprache für Frontend und Backend reduziert die
Lernkurve und erlaubt es, Typen (z. B. für ein Event) zwischen beiden
Seiten zu teilen; Express ist minimalistisch und ausreichend für den
geplanten, überschaubaren Endpunkt-Umfang (Events, Auth, Statistik).

**Konsequenzen:**
- *Positiv:* Geringe Einstiegshürde, schneller erster lauffähiger
  Endpunkt; ein Team-Mitglied kann sich in beiden Schichten (Frontend/
  Backend) bewegen, ohne die Sprache zu wechseln.
- *Negativ:* Middleware für Validierung und Session-Handling musste
  selbst zusammengestellt und getestet werden statt sie aus einem
  vollständigen Framework zu übernehmen; fehlende Konventionen
  (verglichen mit z. B. Django) erfordern mehr eigene Team-Absprachen
  zur Projektstruktur.

---

### ADR-003: Persistenz – SQLite

**Status:** Entschieden

**Kontext:** Timeline-Einträge und Nutzerdaten müssen dauerhaft
gespeichert werden.

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **SQLite** (gewählt) | Kein separater Datenbankserver nötig, Datei-basiert, einfaches Deployment als ein Deployable (Kapitel 7); für Einzelnutzer-Prototyp ausreichend | Keine parallelen Schreibzugriffe mehrerer Prozesse; bei Hosting mit flüchtigem Dateisystem geht die Datenbank bei jedem Neu-Deploy verloren |
| PostgreSQL | Leistungsfähiger, echte Mehrbenutzer-Fähigkeit, produktionstauglich | Benötigt einen separaten Datenbankserver samt Betrieb/Konfiguration – zusätzlicher Aufwand ohne erkennbaren Nutzen im Projektumfang |
| MongoDB (NoSQL) | Flexibles Schema, keine Migrationsschritte bei Strukturänderungen nötig | Passt schlechter zum klar relationalen Datenmodell (Nutzer → Events, Kapitel 5, 8.1); kein Mehrwert ohne unstrukturierte Daten |

**Entscheidung:** SQLite (vgl. TECH-03).

**Begründung:** Für die Datenmenge eines Einzelnutzer-Prototyps ohne
Produktivbetrieb (vgl. P1 §7) ist kein separater Datenbankserver nötig;
das relationale Datenmodell (Nutzer, Events) passt gut zu SQLite, und
die Ein-Datei-Lösung vereinfacht das Deployment als ein einziges
Deployable erheblich.

**Konsequenzen:**
- *Positiv:* Keine Infrastruktur für einen Datenbankserver nötig;
  lokale Entwicklung und Tests laufen ohne zusätzliches Setup.
- *Negativ:* Keine parallelen Schreibzugriffe mehrerer Prozesse möglich
  – für den Projektumfang unkritisch, wäre bei echtem
  Mehrnutzerbetrieb aber ein Risiko; zusätzlich muss der gewählte
  Hosting-Anbieter zwingend einen persistenten Speicherort für die
  SQLite-Datei bieten, sonst geht der Datenbestand bei jedem
  Neu-Deploy verloren.

---

### ADR-004: Authentifizierung – Session-basiert statt JWT

**Status:** Entschieden

**Kontext:** Nutzer:innen müssen sich anmelden können, sodass jede
Person nur ihre eigenen Events sieht (vgl. Kapitel 6.2, 8.2).

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **Session mit serverseitigem Cookie** (gewählt) | Einfach umzusetzen (Bibliothek übernimmt Cookie-Handling); kein Refresh-Mechanismus nötig; Ausloggen serverseitig sofort wirksam | Session-Zustand muss serverseitig gehalten werden (In-Memory, siehe 8.2); bei mehreren Backend-Instanzen bräuchte es einen geteilten Session-Store |
| JWT (JSON Web Tokens) | Zustandslos – kein serverseitiger Speicher nötig, gut skalierbar über mehrere Backend-Instanzen | Erfordert eigene Refresh-Logik und sichere clientseitige Speicherung des Tokens (XSS-Risiko bei `localStorage`); Ausloggen vor Ablauf ist ohne zusätzliche Sperrliste nicht direkt möglich |

**Entscheidung:** Klassische Session mit serverseitigem Cookie.

**Begründung:** Für ein Anfänger-Team ohne Erfahrung mit
Token-Refresh-Logik ist die Session-basierte Variante deutlich
einfacher korrekt umzusetzen; da es sich um eine Single-Origin-Web-App
ohne mobile native Clients handelt (vgl. ADR-005), entfällt der
Hauptvorteil von JWT (Zustandslosigkeit über verschiedene Client-Typen
hinweg).

**Konsequenzen:**
- *Positiv:* Kein Risiko durch clientseitig gespeicherte Tokens; Logout
  ist serverseitig sofort und zuverlässig umsetzbar.
- *Negativ:* Session-Zustand liegt serverseitig In-Memory (siehe 8.2)
  – bei Server-Neustart gehen aktive Sessions verloren; ein
  späterer Wechsel auf mehrere parallel laufende Backend-Instanzen
  würde einen gemeinsamen Session-Store erfordern, was mit der
  aktuellen Lösung nicht kompatibel ist.

---

### ADR-005: Projektumfang – Web-App statt PWA/native App

**Status:** Entschieden

**Kontext:** Ursprünglich war auch eine mobile-taugliche/installierbare
Version angedacht.

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **Reine Web-Anwendung** (gewählt) | Ein einziger Code- und Bereitstellungspfad; deutlich geringerer Aufwand bis zur Abgabe am 25.09.2026 | Kein Home-Screen-Icon, keine Offline-Fähigkeit |
| PWA (installierbar über Manifest + Service Worker) | Installierbar auf dem Homescreen, eingeschränkte Offline-Nutzung möglich | Zusätzlicher Implementierungsaufwand (Manifest, Service-Worker-Caching-Strategie) ohne fachliche Notwendigkeit im aktuellen Scope |
| Native Apps (React Native, Swift, Kotlin) | Beste Systemintegration, volle Offline-Fähigkeit | Mehrfache Codebasis bzw. zusätzliches Framework nötig; Aufwand im gegebenen Zeitrahmen nicht zu rechtfertigen |

**Entscheidung:** Reine Web-Anwendung ohne PWA- oder native
Mobile-Unterstützung.

**Begründung:** Bewusste Team-Entscheidung, den Scope angesichts des
knappen Zeitrahmens bis zur Abgabe zu begrenzen (vgl. P1 §7, native
Apps dort explizit ausgeschlossen); der Zusatzaufwand für Installierbarkeit
oder Offline-Fähigkeit steht in keinem Verhältnis zum Nutzen für eine
Studienarbeit mit einem Nutzer pro Account.

**Konsequenzen:**
- *Positiv:* Reduzierte Komplexität erlaubt, die verbleibende Zeit auf
  die fachlichen Kernfunktionen (Timeline, Statistik, Validierung) zu
  konzentrieren statt auf Plattform-Themen.
- *Negativ:* Keine Offline-Fähigkeit, kein Home-Screen-Icon; bei
  Bedarf später als Erweiterung nachrüstbar (insbesondere PWA, da sie
  ohne Änderung der Kernarchitektur ergänzt werden kann), aktuell aber
  nicht Teil des Funktionsumfangs.
