# P1-constraints – Rahmenbedingungen (Anhang zu P1)

Dieser Anhang enthält die ausführliche Fassung der Rahmenbedingungen, die in
[P1.5](P1-ziele-rahmenbedingungen.md#p15-rahmenbedingungen) nur als Index (ID + Kurztext)
aufgeführt sind. Gliederung nach Abschnitt 3 (*Mandated Constraints*) des
[Volere Requirements Specification Template](https://www.volere.org/templates/volere-requirements-specification-template/).

Eine Rahmenbedingung ist eine Vorgabe, die den Lösungsraum **von außen** einschränkt —
im Unterschied zu einer messbaren Qualitätsanforderung, wie sie in [N1](N1-nichtfunktional.md)
steht. Jede Rahmenbedingung wird hier mit ihrer Begründung und ihrer Konsequenz für
Lifeline dokumentiert.

---

### CON-3a-01 Webanwendung ohne Installation

| | |
|---|---|
| **Rahmenbedingung** | Lifeline wird ausschließlich als Webanwendung bereitgestellt und über einen aktuellen Browser genutzt; auf dem Gerät der Nutzer:in ist keine Installation erforderlich. |
| **Begründung** | Zielsetzung des Lehrprojekts (`G-04`, `G-05`): ein vollständiger Full-Stack-Prozess soll exemplarisch und ohne Installationshürde vorgeführt werden können. |
| **Konsequenz** | Keine native App für iOS/Android (siehe `NG-01`). Zugriff ausschließlich über den Browser, in der Zielumgebung über HTTPS ([S3, HOST-01](../betrieb/S3-inbetriebnahme.md), `NFR-15b-01`); geprüft durch den vollständigen Durchlauf von Registrierung bis Anlegen eines Events ([N1](N1-nichtfunktional.md)). |

### CON-3a-02 Eingebettete Datenbank

| | |
|---|---|
| **Rahmenbedingung** | Die Datenhaltung erfolgt über eine eingebettete Datenbank, ohne separaten Datenbankserver. |
| **Begründung** | Ein separater Datenbankserver würde ein eigenes Deployment und laufende Kosten verursachen — beides schließen `CON-3a-03` und `CON-3g-01` aus. |
| **Konsequenz** | SQLite läuft eingebettet im Backend-Prozess (Entwurfsentscheidung, siehe `docs/arch/` A09). Kein Netzwerkzugriff auf die Datenbank, kein separates Datenbank-Deployment. |

### CON-3a-03 Ein gemeinsames Deployment

| | |
|---|---|
| **Rahmenbedingung** | Oberfläche, Anwendungslogik und Datenhaltung werden als **eine** Einheit betrieben. |
| **Begründung** | Reduziert die Inbetriebnahme (siehe [S3](../betrieb/S3-inbetriebnahme.md)) auf einen einzigen Bereitstellungsschritt — passend zur harten Abgabefrist (`CON-3h-01`) und zum fehlenden Infrastrukturbudget (`CON-3g-01`). |
| **Konsequenz** | Kein separat auszurollendes Frontend/Backend, keine Versionskompatibilität zwischen getrennten Diensten zu verwalten. |

### CON-3b-01 Persistenter Speicher in der Zielumgebung

| | |
|---|---|
| **Rahmenbedingung** | Die Zielumgebung muss über Neustarts und Neu-Deployments hinweg einen persistenten, vom Anwendungsprozess beschreibbaren Speicherbereich bereitstellen. |
| **Begründung** | Ohne dauerhaften Speicher gingen alle Events bei jedem Neustart verloren — das widerspräche dem Kernauftrag (`G-01`) und ist über `SC-04` messbar gemacht. |
| **Konsequenz** | Die Eignung der Hosting-Plattform ist vor der Inbetriebnahme **nachzuweisen**, nicht anzunehmen (siehe [S3, HOST-03](../betrieb/S3-inbetriebnahme.md)). `AS-04` hält die Annahme fest, die dafür zutreffen muss. |

### CON-3b-02 Kein Scheduler, kein Hintergrundprozess

| | |
|---|---|
| **Rahmenbedingung** | Die Zielumgebung stellt weder einen zeitgesteuerten Dienst noch einen Hintergrundarbeiter bereit; Lifeline darf keinen benötigen. |
| **Begründung** | Passt zu `CON-3g-01` (kein Budget für zusätzliche Infrastruktur) und hält die Betriebsumgebung bewusst einfach. |
| **Konsequenz** | Keine Erinnerungsfunktion (`NG-04`). Jede Verarbeitung läuft synchron innerhalb einer Anfrage; ein Aufruf an ein Nachbarsystem ist entweder Teil der Antwort oder wird nicht abgewartet (siehe [S1.1](S1-nachbarsysteme.md#s11-konventionen)). Es gibt keine Warteschlange und keine zeitgesteuerte Wiederholung. |

### CON-3e-01 Desktop und Smartphone gleichrangig

| | |
|---|---|
| **Rahmenbedingung** | Die Anwendung muss auf Desktop- und Smartphone-Bildschirmen gleichermaßen vollständig nutzbar sein. |
| **Begründung** | Persönliche Ereignisse werden situativ erfasst — teils unterwegs (Smartphone), teils in Ruhe (Desktop). Keiner der beiden Kontexte darf benachteiligt werden. |
| **Konsequenz** | Responsives Layout ohne horizontale Scrollpflicht, ausgenommen die Zeitleiste selbst ([N1](N1-nichtfunktional.md)). Alle Dialoge sind auf beiden Gerätearten vollständig bedienbar ([B1](B1-dialogspezifikation.md)). Eine eigene native App ist dafür nicht nötig (`NG-01`). |

### CON-3g-01 Kein Budget für Infrastruktur

| | |
|---|---|
| **Rahmenbedingung** | Für Hosting, Datenbank und externe Dienste steht kein Budget zur Verfügung. |
| **Begründung** | Studentisches Lehrprojekt ohne Finanzierung. |
| **Konsequenz** | Nur kostenlose Hosting-Angebote kommen infrage; die Anforderungen an den Host sind deshalb bewusst schlicht gehalten ([S3.2](../betrieb/S3-inbetriebnahme.md#s32-voraussetzungen-an-den-host), insbesondere HOST-06). Externe Nachbarsysteme dürfen keinen kostenpflichtigen Schlüssel und kein Abonnement voraussetzen — ausschlaggebend für die Auswahl in [S1.3](S1-nachbarsysteme.md#s13-nb-02--feiertagsdienst) (siehe auch `docs/OFFENE-PUNKTE.md`, OP-04). |

### CON-3h-01 Harte Abgabefrist

| | |
|---|---|
| **Rahmenbedingung** | Der Abgabetermin M3 ist der 25.09.2026 und liegt fest. |
| **Begründung** | Vorgabe des Moduls WK_1106. |
| **Konsequenz** | Der verbindliche Funktionsumfang ist auf die in [P1.4.1](P1-ziele-rahmenbedingungen.md#p141-zuordnung-der-anwendungsfälle) als Muss eingestuften Anwendungsfälle begrenzt. Erweiterungen (z. B. `UC-06`, das Nachbarsystem aus [S1.3](S1-nachbarsysteme.md#s13-nb-02--feiertagsdienst)) werden nur aufgenommen, wenn sie diese Frist nicht gefährden; einzelne Erweiterungen wurden aus Zeitgründen bewusst zurückgestellt (`NG-05`). |

### CON-3i-01 Team und Betreuung

| | |
|---|---|
| **Rahmenbedingung** | Das Projekt wird von einem vierköpfigen Team umgesetzt und von Prof. Dr. Carsten Lucke betreut. |
| **Begründung** | Vorgabe des Moduls WK_1106. |
| **Konsequenz** | Rollenverteilung siehe `TEAMINFO.md`. Der Betreuer nutzt die Anwendung nicht im laufenden Betrieb, sondern bewertet Spezifikation, Architektur und Quellcode ([P1.3](P1-ziele-rahmenbedingungen.md#p13-stakeholder-und-nutzer)). |

### CON-3i-02 Versionierung und Nachvollziehbarkeit

| | |
|---|---|
| **Rahmenbedingung** | Quellcode, Spezifikation und Architekturdokumentation werden versioniert im selben Repository geführt; Abgabestände müssen nachvollziehbar markiert sein. |
| **Begründung** | Vorgabe des Moduls WK_1106 sowie Grundlage für [`SC-07`](P1-ziele-rahmenbedingungen.md#p16-erfolgskriterien) und `NFR-14a-01` in [N1](N1-nichtfunktional.md). |
| **Konsequenz** | Versionierung mit Git/GitHub und Commit-Nachrichten nach Conventional Commits. Abgabestände werden als Git-Tags markiert und bleiben dadurch nachvollziehbar; die finale Abgabe (M3) wird mit dem annotierten Tag `v1.0.0` auf `main` markiert. |

### CON-3j-01 Persönliche Daten

| | |
|---|---|
| **Rahmenbedingung** | Lifeline verarbeitet und speichert persönliche Lebensereignisse der Nutzer:innen. |
| **Begründung** | Ergibt sich unmittelbar aus dem Kernauftrag ([P1.1](P1-ziele-rahmenbedingungen.md#p11-auftrag)); persönliche Ereignisse sind naturgemäß sensibel, auch ohne einer besonderen gesetzlichen Datenkategorie zu unterliegen. |
| **Konsequenz** | Datensparsamkeit — nur fachlich notwendige Attribute werden erhoben (`DS-01` in A02, siehe [D1](D1-datenmodell.md)). Jede Nutzer:in kann eigene Events vollständig löschen (`UC-03`). Kein Zugriff einer Nutzer:in auf die Daten einer anderen (`SC-05`, `NFR-15a-01`). |

---

## Querverweise auf diesen Anhang

| Baustein | Bezug |
|---|---|
| [P1](P1-ziele-rahmenbedingungen.md) | P1.5 ist der Index zu diesem Anhang; P1.3 und P1.4.2 referenzieren einzelne `CON-`-IDs. |
| [N1](N1-nichtfunktional.md) | Mehrere Qualitätsanforderungen nennen die hier begründete Rahmenbedingung als Ursprung (u. a. `CON-3a-01`, `CON-3a-02`, `CON-3b-02`, `CON-3e-01`, `CON-3i-02`, `CON-3j-01`). |
| [S1](S1-nachbarsysteme.md) | `CON-3b-02` und `CON-3g-01` bestimmen die Fehlersemantik und die Auswahl des Nachbarsystems in S1.1 und S1.3. |
| [S3](../betrieb/S3-inbetriebnahme.md) | `CON-3a-02`, `CON-3a-03`, `CON-3b-01`, `CON-3b-02`, `CON-3g-01` prägen die Anforderungen an die Zielumgebung. |
| [B1](B1-dialogspezifikation.md) | `CON-3e-01` verlangt die vollständige Bedienbarkeit aller Dialoge auf beiden Gerätearten. |
