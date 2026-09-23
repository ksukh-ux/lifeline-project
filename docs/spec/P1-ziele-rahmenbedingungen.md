# P1 — Ziele und Rahmenbedingungen

Grundlagenbaustein der Lifeline-Spezifikation nach Siedersleben. Beantwortet: Warum wird
das System gebaut, für wen, und welche Rahmenbedingungen grenzen den Lösungsraum ein?

Die Identifier dieses Bausteins (`G-`, `NG-`, `CON-`, `SC-`, `AS-`) sind stabil und werden
aus anderen Bausteinen und aus der Architekturdokumentation referenziert.

---

## P1.1 Auftrag

Persönliche Ziele, Ereignisse und Meilensteine werden über viele Anwendungen und
Dokumente verstreut festgehalten. Dadurch fehlt die zeitliche Gesamtsicht: Zusammenhänge
zwischen Ereignissen und der eigene Fortschritt sind nicht unmittelbar erkennbar.

Lifeline führt diese Einträge in einer interaktiven, chronologisch aufgebauten Timeline
zusammen. Nutzer:innen legen Ereignisse an, ordnen ihnen einen Zeitpunkt, eine Kategorie
und eine persönliche Bedeutung zu und betrachten sie in einer durchgängigen visuellen
Anordnung.

---

## P1.2 Geschäftsziele

| ID | Ziel |
|----|------|
| G-01 | Persönliche Ereignisse an einer zentralen Stelle erfassen, statt sie über mehrere Anwendungen zu verteilen. |
| G-02 | Zeitliche Zusammenhänge zwischen Ereignissen unmittelbar sichtbar machen. |
| G-03 | Ereignisse nach Kategorie und persönlicher Bedeutung gewichten und filterbar machen. |
| G-04 | Einen durchgängigen Full-Stack-Prozess exemplarisch umsetzen: Eingabe in der Oberfläche, Übertragung an das Backend, dauerhafte Speicherung, Rückgabe und Darstellung. |
| G-05 | Einen technisch nachvollziehbaren und erweiterbaren Prototyp liefern, dessen Anforderungen und Entscheidungen im Repository dokumentiert sind. |

G-04 und G-05 sind Ziele des Lehrprojekts, nicht der Endanwender:in. Sie werden
gleichrangig geführt, weil sie den Lösungsraum genauso einschränken wie die fachlichen
Ziele.

---

## P1.3 Stakeholder und Nutzer

| Rolle | Beschreibung | Interaktion mit Lifeline |
|---|---|---|
| **Nutzer:in** | Einzige Endanwenderrolle. Registriert sich, meldet sich an, verwaltet die eigenen Events. | Vollständig, über die Weboberfläche. |
| **Projektteam** | Vier Studierende, Rollenverteilung in `TEAMINFO.md`. | Entwicklung, Dokumentation, Betrieb der Entwicklungsumgebung. |
| **Betreuer** | Prof. Dr. Carsten Lucke. Fachliche Betreuung und Bewertung. | Keine Nutzung zur Laufzeit; liest Spezifikation, Architektur und Quellcode. |
| **Betriebsumgebung** | Hosting-Plattform für die Demo-/Zielumgebung. | Stellt Laufzeit und persistenten Speicher bereit (siehe [CON-3b-01](P1-constraints.md#con-3b-01-persistenter-speicher-in-der-zielumgebung)). |

Eine administrative Rolle ist nicht vorgesehen (`NG-02`). Alle Events gehören genau einem
Benutzerkonto; Nutzer:innen sehen ausschließlich eigene Events.

---

## P1.4 Umfang

Der Funktionsumfang wird **nicht** als eigene Liste geführt, sondern über die
Anwendungsfälle in [F2](F2-anwendungsfaelle.md) definiert. Diese Tabelle ordnet jedem
Anwendungsfall nur zu, ob er zum verbindlichen Kern gehört oder eine Erweiterung ist.

### P1.4.1 Zuordnung der Anwendungsfälle

| Anwendungsfall | Einstufung | Begründung |
|---|---|---|
| [UC-07](F2-anwendungsfaelle.md) Registrieren und Login | **Muss** | Ohne Konto keine Zuordnung von Events zu einer Person. |
| [UC-01](F2-anwendungsfaelle.md) Event anlegen | **Muss** | Kern von `G-01`. |
| [UC-02](F2-anwendungsfaelle.md) Event bearbeiten | **Muss** | Ein Bestand ohne Korrekturmöglichkeit ist nicht pflegbar. |
| [UC-03](F2-anwendungsfaelle.md) Event löschen | **Muss** | Gegenstück zu UC-01; auch aus Datenschutzgründen nötig (`CON-3j-01`). |
| [UC-04](F2-anwendungsfaelle.md) Timeline ansehen | **Muss** | Kern von `G-02`. |
| [UC-05](F2-anwendungsfaelle.md) Timeline filtern | **Muss** | Kern von `G-03`. |
| [UC-06](F2-anwendungsfaelle.md) Statistik berechnen | Erweiterung | Nützlich, aber der Auftrag ist ohne sie erfüllt. |
| [UC-08](F2-anwendungsfaelle.md) Kategorie anlegen | **Muss** | Ohne sie ist die Erweiterbarkeit der Kategorien (`NFR-14c-01`) nicht erfüllbar. |
| [UC-09](F2-anwendungsfaelle.md) Sicherung exportieren | Erweiterung | Gibt der Nutzer:in eine Kopie ihrer Daten in die Hand; der Auftrag ist ohne sie erfüllt. |
| [UC-10](F2-anwendungsfaelle.md) Sicherung importieren | Erweiterung | Gegenstück zu UC-09. |

Bereits umgesetzte Erweiterungen dürfen im Produkt bleiben; sie werden dadurch nicht zu
Muss-Funktionen und die Erfolgskriterien in P1.6 hängen nicht an ihnen.

Querschnittliche Eigenschaften, die keinem einzelnen Anwendungsfall gehören — dauerhafte
Speicherung, Validierung, Zugriffstrennung — sind als messbare Anforderungen in
[N1](N1-nichtfunktional.md) geführt, nicht hier.

### P1.4.2 Nichtziele

| ID | Nichtziel | Begründung |
|----|-----------|------------|
| NG-01 | Mobile Anwendungen für iOS oder Android, PWA, Offlinebetrieb | Eine responsive Weboberfläche deckt den Bedarf ab; siehe ADR-005. |
| NG-02 | Rollen, Rechte, Administration, Mehrbenutzerzugriff auf dieselbe Timeline | Persönliche Anwendung; jede Nutzer:in sieht ausschließlich eigene Events. |
| NG-03 | Synchronisation zwischen Geräten über den Serverstand hinaus | Der Server ist die einzige Wahrheit. |
| NG-04 | Erinnerungen und Benachrichtigungen | Würde eine Zeitsteuerung und damit einen Batch-Anteil einführen. |
| NG-05 | Externe Authentifizierungsdienste (z. B. Anmeldung mit Google) | Nicht im Zeitrahmen (`CON-3h-01`); die eigene Registrierung mit E-Mail und Passwort genügt. |
| NG-06 | Übernahme von Daten aus einem Vorgängersystem | Greenfield; Baustein S2 entfällt. |
| NG-07 | Berichte, PDF- oder Druckausgaben | Kein Berichtsanwendungsfall. |

---

## P1.5 Rahmenbedingungen

Rahmenbedingungen sind Vorgaben, die den Lösungsraum **von außen** einschränken. Sie sind
keine Anforderungen — messbare Qualitätsanforderungen stehen in
[N1](N1-nichtfunktional.md).

Die ausführlichen Rahmenbedingungen mit Begründung und Konsequenz liegen als Anhang in
[`P1-constraints.md`](P1-constraints.md), gegliedert nach Volere Abschnitt 3 (*Mandated
Constraints*). Der Anhang ist die maßgebliche Quelle; die folgende Tabelle ist nur der
Index.

| ID | Rahmenbedingung |
|----|-----------------|
| [CON-3a-01](P1-constraints.md#con-3a-01-webanwendung-ohne-installation) | Webanwendung ohne Installation auf dem Gerät der Nutzer:in |
| [CON-3a-02](P1-constraints.md#con-3a-02-eingebettete-datenbank) | Eingebettete Datenbank ohne separaten Datenbankserver |
| [CON-3a-03](P1-constraints.md#con-3a-03-ein-gemeinsames-deployment) | Bereitstellung als ein gemeinsames Deployment |
| [CON-3b-01](P1-constraints.md#con-3b-01-persistenter-speicher-in-der-zielumgebung) | Persistenter Speicher in der Zielumgebung erforderlich |
| [CON-3b-02](P1-constraints.md#con-3b-02-kein-scheduler-kein-hintergrundprozess) | Kein Scheduler, kein Hintergrundprozess |
| [CON-3e-01](P1-constraints.md#con-3e-01-desktop-und-smartphone-gleichrangig) | Desktop und Smartphone gleichrangig |
| [CON-3g-01](P1-constraints.md#con-3g-01-kein-budget-für-infrastruktur) | Kein Budget für dedizierte Infrastruktur |
| [CON-3h-01](P1-constraints.md#con-3h-01-harte-abgabefrist) | Harte Abgabefrist 25.09.2026 |
| [CON-3i-01](P1-constraints.md#con-3i-01-team-und-betreuung) | Team aus vier Personen, Betreuung durch Prof. Dr. Carsten Lucke |
| [CON-3i-02](P1-constraints.md#con-3i-02-versionierung-und-nachvollziehbarkeit) | Versionierung mit Git/GitHub, nachvollziehbare Historie |
| [CON-3j-01](P1-constraints.md#con-3j-01-persönliche-daten) | Lifeline speichert persönliche Lebensereignisse |

**Bewusst nicht hier:** die Wahl von Programmiersprache, Framework, Build-Werkzeug,
Datenbankprodukt und Hosting-Anbieter. Das sind *Entwurfsentscheidungen* und stehen in
[`docs/arch/`](../arch/) — als technische Randbedingungen in A02 und mit Begründung in
A09 (ADR-001 bis ADR-008).

---

## P1.6 Erfolgskriterien

| ID | Kriterium |
|----|-----------|
| SC-01 | Die Anwendung ist über einen Browser erreichbar; eine Nutzer:in kann sich registrieren und anmelden. |
| SC-02 | Events können angelegt, angezeigt, bearbeitet und gelöscht werden; das Ergebnis ist unmittelbar in der Zeitleiste sichtbar. |
| SC-03 | Jedes Event wird dem erfassten Datum korrekt zugeordnet und in korrekter chronologischer Reihenfolge dargestellt. |
| SC-04 | Angelegte Events sind nach Abmeldung, erneuter Anmeldung und Neustart des Anwendungsprozesses unverändert vorhanden. |
| SC-05 | Eine Nutzer:in kann auf die Events einer anderen Nutzer:in auch bei direkter Adressierung nicht zugreifen. |
| SC-06 | Die als **Muss** eingestuften Anwendungsfälle aus P1.4.1 sind durch definierte Testfälle nachweislich überprüft. |
| SC-07 | Quellcode, Spezifikation und Architekturdokumentation sind im Repository nachvollziehbar versioniert und die Abgabestände sind als Git-Tags markiert. |

SC-04 und SC-05 sind bewusst scharf formuliert: an beiden scheiterte der Prototyp mit
Browser-Speicherung, und SC-04 ist zugleich der einzige Nachweis für
[CON-3b-01](P1-constraints.md#con-3b-01-persistenter-speicher-in-der-zielumgebung).

---

## P1.7 Annahmen

| ID | Annahme | Konsequenz, falls sie nicht gilt |
|----|---------|----------------------------------|
| AS-01 | Nutzer:innen sind während der Nutzung durchgehend online. | Offlinebetrieb ist nicht vorgesehen; die entsprechende Abgrenzung in NG-01 wäre bei Wegfall dieser Annahme neu zu bewerten. |
| AS-02 | Die Einträge werden von den Nutzer:innen selbst erfasst. Ein Import ist nur für die eigene, zuvor aus Lifeline exportierte Sicherung vorgesehen (UC-10); es gibt keinen automatisierten Import aus Fremdsystemen. | Ein Importbaustein für Fremdsysteme wäre zu spezifizieren (vgl. S1.4, OP-07). |
| AS-03 | Eine persönliche Timeline umfasst einige hundert Events, nicht zehntausende. | Das Ladeverhalten aus [NFR-12a-01](N1-nichtfunktional.md) wäre neu zu bemessen. |
| AS-04 | Die Hosting-Umgebung stellt einen über Neustarts hinweg persistenten Speicherbereich bereit. | Totalverlust aller Daten bei jedem Deployment; siehe ADR-003, Konsequenzen. |

---

## P1.8 Änderungsstand

| Version | Datum | Status | Verantwortlich |
|---|---|---|---|
| 0.1 | 01.08.2026 | Entwurf | Projektteam Lifeline |
| 0.2 | 21.08.2026 | MVP-Abgrenzung ergänzt | Sukhmani Kaur |
| 0.3 | 25.08.2026 | Registrierung und Anmeldung als Muss-Funktion ergänzt | Mary Rose Alghanem |
| 0.4 | 08.09.2026 | Umfang über F2 definiert statt als Liste; Rahmenbedingungen mit IDs und Anhang; offene Punkte ausgelagert | Ahmed Al-Gumaeli |
| 0.5 | 23.09.2026 | Abgleich mit dem umgesetzten Stand: UC-08 bis UC-10 eingestuft, AS-02 und NG-05 präzisiert | Projektteam Lifeline |

---

## P1.9 Querverweise

| Baustein | Bezug zu P1 |
|---|---|
| [P1-constraints](P1-constraints.md) | Anhang mit den ausführlichen Rahmenbedingungen. |
| [P2](P2-architekturüberblick.md) | Enthält das Nachbarsysteminventar; `NG-04` und `NG-05` begründen, warum keine Kalender-, Benachrichtigungs- oder Anmeldedienste angebunden sind. |
| [F2](F2-anwendungsfaelle.md) | Definiert den Funktionsumfang; P1.4.1 stuft ihn nur ein. |
| [N1](N1-nichtfunktional.md) | `CON-3e-01` und `CON-3j-01` sind die Ursprünge der Anforderungen in §10 bzw. §15. |
| [`docs/betrieb/`](../betrieb/) | `AS-04` und `CON-3b-01` sind der Grund für die persistenten Zustandsflächen. |
| [`docs/arch/`](../arch/) | A01 leitet die Qualitätsziele aus `G-01` bis `G-05` ab; A02 hält die Technologieentscheidungen, die P1.5 bewusst offenlässt. |
