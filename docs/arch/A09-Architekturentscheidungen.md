## 9. Architekturentscheidungen

Die grundlegenden Technologie-Entscheidungen wurden bereits in Kapitel 4
(Lösungsstrategie) benannt. Dieses Kapitel vertieft die acht wichtigsten
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
festgelegten Zerlegung in `Timeline`, `EventFormModal`, `CategoryFilter` usw.

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
| **SQLite** (gewählt) | Kein separater Datenbankserver nötig, Datei-basiert, einfaches Deployment als ein Deployable (Kapitel 7); für einen Prototyp mit wenigen Konten und einigen hundert Events je Person (AS-03) ausreichend | Keine parallelen Schreibzugriffe mehrerer Prozesse; bei Hosting mit flüchtigem Dateisystem geht die Datenbank bei jedem Neu-Deploy verloren |
| PostgreSQL | Leistungsfähiger, echte Mehrbenutzer-Fähigkeit, produktionstauglich | Benötigt einen separaten Datenbankserver samt Betrieb/Konfiguration – zusätzlicher Aufwand ohne erkennbaren Nutzen im Projektumfang |
| MongoDB (NoSQL) | Flexibles Schema, keine Migrationsschritte bei Strukturänderungen nötig | Passt schlechter zum klar relationalen Datenmodell (Nutzer → Kategorien → Events, [D1](../spec/D1-datenmodell.md)); kein Mehrwert ohne unstrukturierte Daten |

**Entscheidung:** SQLite (vgl. TECH-03).

**Begründung:** Für die Datenmenge eines Prototyps ohne Produktivbetrieb
([AS-03](../spec/P1-ziele-rahmenbedingungen.md#p17-annahmen)) ist kein separater
Datenbankserver nötig; das relationale Datenmodell (Nutzer, Kategorien,
Events) passt gut zu SQLite, und
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
| **Session mit serverseitigem Cookie** (gewählt) | Mit wenigen Zeilen ohne zusätzliches Paket umsetzbar (`middleware/session.ts`: Zufalls-ID, `Map`, Cookie-Header); kein Refresh-Mechanismus nötig; Ausloggen serverseitig sofort wirksam | Session-Zustand muss serverseitig gehalten werden (In-Memory, siehe 8.2); bei mehreren Backend-Instanzen bräuchte es einen geteilten Session-Store |
| JWT (JSON Web Tokens) | Zustandslos – kein serverseitiger Speicher nötig, gut skalierbar über mehrere Backend-Instanzen | Erfordert eigene Refresh-Logik und sichere clientseitige Speicherung des Tokens (XSS-Risiko bei `localStorage`); Ausloggen vor Ablauf ist ohne zusätzliche Sperrliste nicht direkt möglich |

**Entscheidung:** Klassische Session mit serverseitigem Cookie.

**Begründung:** Für ein Anfänger-Team ohne Erfahrung mit
Token-Refresh-Logik ist die Session-basierte Variante deutlich
einfacher korrekt umzusetzen. Da es nur einen Client-Typ gibt, die
Web-Oberfläche ohne native Apps (vgl. ADR-005), entfällt der
Hauptvorteil von JWT (Zustandslosigkeit über verschiedene Client-Typen
hinweg). Im Produktionsbetrieb liegen Frontend und API unter derselben
Adresse; nur in der Entwicklung sind sie getrennte Origins, was eine
CORS-Konfiguration mit Cookies erfordert (Kapitel 8.2).

Bewusst wurde **kein** Paket wie `express-session` eingesetzt: Der benötigte
Umfang (Session anlegen, prüfen, löschen) ist klein, und der eigene Code ist
im Team vollständig nachvollziehbar.

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
knappen Zeitrahmens bis zur Abgabe zu begrenzen (vgl. P1 NG-01, native
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

---

### ADR-006: Bildablage – Dateisystem mit Base64-Upload im JSON

**Status:** Entschieden

**Kontext:** Events können ein Bild haben ([D2.3](../spec/D2-datentypenverzeichnis.md#d23-bild-image_path)).
Bilder sind im Vergleich zu den übrigen Daten groß, müssen dauerhaft
gespeichert und im Browser angezeigt werden. Es gibt kein Budget für externe
Speicherdienste (CON-3g-01).

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **Datei in `backend/uploads/`, Upload als Base64-Data-URI im JSON** (gewählt) | Ein einziger Anfrage-Typ (JSON) für alle Event-Operationen; kein zusätzliches Paket; Bild kann vom Browser direkt über `/uploads/…` geladen werden; Datenbank bleibt klein | Base64 vergrößert die Übertragung um etwa ein Drittel; Dateisystem und Datenbank lassen sich nicht gemeinsam transaktional ändern |
| Datei im Dateisystem, Upload als `multipart/form-data` (z. B. mit `multer`) | Übliches Verfahren, effizientere Übertragung | Zusätzliches Paket und zweiter Anfrage-Typ neben JSON; mehr Code in Frontend und Backend |
| Bild als BLOB in SQLite | Bild und Event in einer Transaktion | Datenbankdatei wächst stark; Auslieferung jedes Bildes über eigene Route mit Datenbankzugriff |
| Externer Objektspeicher (z. B. S3) | Skalierbar, entlastet den Server | Kosten, Zugangsdaten, weiteres Nachbarsystem; widerspricht CON-3g-01 |

**Entscheidung:** Bilder werden als Datei unter einem zufälligen Namen in
`backend/uploads/` gespeichert; das Frontend sendet sie als Data-URI im
JSON-Body; in der Datenbank steht nur der Pfad.

**Begründung:** Bei höchstens 5 MB je Bild und einer persönlichen Timeline
fällt der Base64-Aufschlag nicht ins Gewicht. Wichtiger ist, dass alle
Event-Operationen gleich funktionieren (ein JSON-Body, eine Validierung) und
kein weiteres Paket nötig ist.

**Konsequenzen:**
- *Positiv:* Einfache, einheitliche Schnittstelle; Bilder werden vom Browser
  wie statische Dateien geladen.
- *Negativ:* Datenbank und Bildablage müssen gemeinsam gesichert werden
  (S3.3). Ohne gemeinsame Transaktion ist nur eine Kompensation möglich
  (Kapitel 8.3); das Restrisiko steht in OP-08. Das JSON-Limit des Servers
  musste auf 10 MB angehoben werden.

---

### ADR-007: Datenbankzugriff – `node:sqlite` mit SQL, ohne ORM

**Status:** Entschieden

**Kontext:** ADR-003 legt SQLite fest. Offen war, wie das Backend auf die
Datenbank zugreift.

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **Eingebautes Modul `node:sqlite` mit handgeschriebenem SQL** (gewählt) | Keine zusätzliche Abhängigkeit, keine nativen Build-Schritte; SQL ist im Code direkt sichtbar und im Team nachvollziehbar | Benötigt Node.js 22.13 oder neuer; Typen der Ergebniszeilen müssen selbst angegeben werden; Migrationen selbst geschrieben |
| Paket `better-sqlite3` | Ausgereift, sehr verbreitet | Native Abhängigkeit, die je nach Betriebssystem kompiliert werden muss; bei der Installation im Team fehleranfällig |
| ORM wie Prisma oder TypeORM | Typsichere Abfragen, Migrationswerkzeug | Zusätzliche Einarbeitung, Code-Generierung und Konfiguration; für drei Tabellen unverhältnismäßig |

**Entscheidung:** `node:sqlite` mit vorbereiteten SQL-Anweisungen
(`db.prepare(...)`), direkt in den Routen.

**Begründung:** Bei drei Tabellen und wenigen Abfragen je Route ist SQL
kürzer und verständlicher als eine ORM-Schicht. Ohne native Abhängigkeit
funktioniert `npm install` auf allen Rechnern im Team gleich.

**Konsequenzen:**
- *Positiv:* Kein zusätzliches Paket für die Datenhaltung; jede Abfrage ist
  sofort lesbar, einschließlich der Einschränkung auf `user_id` (Kapitel 8.2).
- *Negativ:* Mindestversion Node.js 22.13 (README, A07); keine automatische
  Typprüfung der SQL-Ergebnisse; Schemaänderungen erfordern eigene
  Migrationsschritte (Kapitel 8.6).

---

### ADR-008: Feiertagsdienst – Aufruf über das eigene Backend

**Status:** Entschieden

**Kontext:** Die Timeline soll gesetzliche Feiertage anzeigen
([S1.3](../spec/S1-nachbarsysteme.md#s13-nb-02--feiertagsdienst)). Der Dienst ist
öffentlich und ohne Schlüssel nutzbar. Sein Ausfall darf die Timeline nie
beeinträchtigen (S1.3.2).

**Betrachtete Optionen:**

| Option | Vorteile | Nachteile |
|---|---|---|
| **Backend ruft den Dienst auf, Frontend fragt `/api/holidays`** (gewählt) | Browser spricht nur mit Lifeline; Zwischenspeicher je Land und Jahr für alle Nutzer:innen; Fehlerbehandlung und Zeitlimit an einer Stelle; Ländercode als Konfiguration (`HOLIDAY_COUNTRY`) | Zusätzliche Route; Backend braucht Internetzugang |
| Frontend ruft den Dienst direkt auf | Keine zusätzliche Route | Browser jeder Nutzer:in kontaktiert einen Drittanbieter (IP-Adresse wird übertragen, CON-3j-01); kein gemeinsamer Zwischenspeicher; Abhängigkeit von CORS-Einstellungen des Anbieters |
| Feiertage fest im Code hinterlegen | Kein Nachbarsystem | Bewegliche Feiertage und Länder müssten selbst gepflegt werden; kein Mehrwert gegenüber dem Dienst |

**Entscheidung:** Das Backend fragt `date.nager.at` mit 4 Sekunden Zeitlimit
ab, speichert das Ergebnis je Land und Jahr im Arbeitsspeicher und liefert
bei jedem Fehler eine leere Liste. Das Frontend lädt die Feiertage
unabhängig von den Events.

**Begründung:** So bleibt der Datenschutzvorteil erhalten (nur der Server
spricht mit dem Drittanbieter), und die bindende Regel aus S1.3.2 lässt sich
an genau einer Stelle durchsetzen.

**Konsequenzen:**
- *Positiv:* Die Timeline wird nie durch den Feiertagsdienst blockiert;
  wiederholte Aufrufe für dasselbe Jahr kosten keine externe Anfrage.
- *Negativ:* Der Zwischenspeicher geht bei einem Neustart verloren und wird
  dann neu aufgebaut; ohne Internetzugang des Servers erscheinen keine
  Feiertage.
