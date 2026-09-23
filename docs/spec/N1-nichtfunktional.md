# N1 — Nichtfunktionale Anforderungen

Messbare Qualitätsanforderungen mit Prüfkriterium. Zu unterscheiden von den
**Rahmenbedingungen**, die den Lösungsraum von außen begrenzen — diese stehen in
[`P1-constraints.md`](P1-constraints.md).

Gliederung nach dem [Volere Requirements Specification Template](https://www.volere.org/templates/volere-requirements-specification-template/),
Abschnitte 10–17 (Robertson & Robertson). Nur die für Lifeline belegten Abschnitte sind
aufgeführt.

Identifier folgen dem Schema `NFR-<Volere-Abschnitt>-<laufend>` und sind stabil. Jede
Anforderung nennt ein **Prüfkriterium** — eine Anforderung ohne Prüfkriterium ist eine
Absichtserklärung.

**Abgrenzung gegen funktionale Anforderungen.** Regeln, die bestimmen, *ob eine Eingabe
gültig ist* — Pflichtfelder, Datumsformat, zulässige Kategorie —, sind funktionale
Anforderungen und stehen in [D1](D1-datenmodell.md), [D2](D2-datentypenverzeichnis.md)
und [N2.2](N2-querschnittskonzepte.md#n22-validierung), nicht hier. In N1 gehört nur, *wie gut* das
System etwas tut, nicht *was* es tut.

---

## 10. Anforderungen an Erscheinung und Bedienung

**NFR-10a-01: Bedienbarkeit auf Desktop und Smartphone**

Beide Nutzungskontexte sind gleichrangig
([CON-3e-01](P1-constraints.md#con-3e-01-desktop-und-smartphone-gleichrangig)). Die
Darstellung passt sich der Fensterbreite an, ohne dass horizontal gescrollt werden muss —
ausgenommen die Zeitleiste selbst, deren horizontale Navigation beabsichtigt ist. Auf
Berührungsgeräten sind alle Bedienelemente mit dem Finger erreichbar; Navigieren und
Zoomen der Zeitleiste funktionieren per Wischgeste.

**Prüfkriterium:** Jeder Dialog aus [B1](B1-dialogspezifikation.md) ist auf einem
Smartphone-Fenster (375 × 667) und einem Desktop-Fenster (1920 × 1080) vollständig
bedienbar.

---

## 11. Anforderungen an Benutzbarkeit

**NFR-11a-01: Erfassen ohne Anleitung**

Das Anlegen eines Events ist ohne zusätzliche Anleitung verständlich und durchführbar.

**Prüfkriterium:** Eine Person, die Lifeline zum ersten Mal sieht, legt ohne
Hilfestellung in weniger als zwei Minuten ein vollständiges Event an.

**NFR-11c-01: Verständliche Rückmeldungen**

Jede Rückmeldung benennt, was nicht möglich war und was die Nutzer:in tun kann.
Technische Einzelheiten erscheinen nicht in der Oberfläche.

**Prüfkriterium:** Keine in der Oberfläche sichtbare Meldung enthält Statuscodes,
Klassennamen, Dateipfade oder Stapelspuren.

**NFR-11d-01: Grundlegende Zugänglichkeit**

Bedienelemente sind mit der Tastatur erreichbar, Formularfelder tragen Beschriftungen,
und Farbe ist nie das **einzige** Unterscheidungsmerkmal — die Kategorie eines Events ist
zusätzlich als Text erkennbar.

**Prüfkriterium:** Jeder Dialog ist vollständig mit der Tastatur bedienbar; die Kategorie
jedes Events ist ohne Farbwahrnehmung feststellbar.

---

## 12. Anforderungen an das Laufzeitverhalten

**NFR-12a-01: Ladeverhalten der Zeitleiste**

Die Zeitleiste wird auch bei einem größeren Bestand ohne spürbare Verzögerung
dargestellt.

**Prüfkriterium:** Die Zeitleiste einer Nutzer:in mit 200 Events ist in weniger als zwei
Sekunden dargestellt.

Die Zahl 200 folgt aus [AS-03](P1-ziele-rahmenbedingungen.md#p17-annahmen). Wird die
Annahme verworfen, ist das Kriterium neu zu bemessen.

**NFR-12a-02: Unmittelbare Wirkung der Filterung**

Das Setzen oder Aufheben eines Filters wirkt ohne wahrnehmbare Verzögerung, weil es auf
den bereits geladenen Daten arbeitet
([AF-03](F3-anwendungsfunktionen.md)).

**Prüfkriterium:** Kein Netzwerkzugriff beim Filterwechsel; die Darstellung ist in unter
200 ms aktualisiert.

**NFR-12c-01: Korrekte chronologische Ordnung**

Events werden an der Position ihres erfassten Datums dargestellt; bei gleichem Datum
entscheidet die optionale Uhrzeit über die Reihenfolge.

**Prüfkriterium:** Für einen Testbestand mit gemischten Datumsangaben, davon mehrere am
selben Tag mit und ohne Uhrzeit, entspricht die dargestellte Reihenfolge der Sortierung
nach `date`, dann `time` ([SC-03](P1-ziele-rahmenbedingungen.md#p16-erfolgskriterien)).

**NFR-12d-01: Dauerhaftigkeit gespeicherter Daten**

Ein erfolgreich gespeichertes Event überdauert Abmeldung, Browserwechsel und Neustart des
Anwendungsprozesses.

**Prüfkriterium:** Event anlegen, Anwendung neu starten, anmelden — das Event ist
unverändert vorhanden ([SC-04](P1-ziele-rahmenbedingungen.md#p16-erfolgskriterien)).

**NFR-12d-02: Keine Teilzustände**

Schlägt eine schreibende Operation fehl, wird kein Teilergebnis gespeichert. Die Nutzer:in
kann die Operation unverändert wiederholen.

**Prüfkriterium:** Bei erzwungenem Fehler während des Speicherns ist danach weder ein
unvollständiges Event noch eine verwaiste Bilddatei vorhanden.

**NFR-12e-01: Bestandsgröße**

Eine Chronik umfasst mindestens 500 Events, ohne dass Bedienung oder Darstellung
unbrauchbar werden.

**Prüfkriterium:** Mit 500 Events bleiben Anlegen, Bearbeiten, Filtern und Navigieren
funktionsfähig.

---

## 13. Anforderungen an Betrieb und Umgebung

**NFR-13b-01: Betrieb ohne zusätzliche Dienste**

Lifeline läuft ohne separaten Datenbankserver, ohne Warteschlange und ohne
zeitgesteuerten Dienst
([CON-3a-02](P1-constraints.md#con-3a-02-eingebettete-datenbank),
[CON-3b-02](P1-constraints.md#con-3b-02-kein-scheduler-kein-hintergrundprozess)).

**Prüfkriterium:** Die Inbetriebnahme nach
[S3](../betrieb/S3-inbetriebnahme.md) gelingt in einer Umgebung, die nur
Prozessausführung, HTTPS und einen persistenten Speicherbereich bereitstellt.

**NFR-13b-02: Nutzung ohne Installation**

Die Anwendung ist mit einem aktuellen Browser nutzbar; auf dem Gerät der Nutzer:in ist
keine zusätzliche Software erforderlich
([CON-3a-01](P1-constraints.md#con-3a-01-webanwendung-ohne-installation)).

**Prüfkriterium:** Vollständiger Durchlauf von Registrierung bis Anlegen eines Events in
den aktuellen Versionen zweier verbreiteter Browser.

---

## 14. Anforderungen an Wartbarkeit

**NFR-14a-01: Nachvollziehbarkeit von Änderungen**

Quellcode, Spezifikation und Architekturdokumentation liegen versioniert im selben
Repository; Abgabestände sind als Git-Tags markiert
([CON-3i-02](P1-constraints.md#con-3i-02-versionierung-und-nachvollziehbarkeit)).

**Prüfkriterium:** Zu jedem Muss-Anwendungsfall aus
[P1.4.1](P1-ziele-rahmenbedingungen.md#p141-zuordnung-der-anwendungsfälle) ist der Commit
benennbar, der ihn eingeführt hat; mindestens der Abgabestand trägt einen Tag.

**NFR-14a-02: Prüfbarkeit der Kernabläufe**

Die Muss-Anwendungsfälle sind durch automatisierte Tests abgedeckt.

**Prüfkriterium:** Für jeden Muss-Anwendungsfall existiert mindestens ein Test, der ihn
durchläuft ([SC-06](P1-ziele-rahmenbedingungen.md#p16-erfolgskriterien)).

**NFR-14c-01: Erweiterbarkeit der Kategorien**

Eine Nutzer:in kann eine neue Kategorie anlegen, **ohne dass Quellcode geändert oder ein
neues Deployment erstellt werden muss**.

**Prüfkriterium:** In einer laufenden Installation wird über die Oberfläche eine neue
Kategorie angelegt, einem Event zugeordnet, danach gefiltert — ohne Neustart und
ohne Code-Änderung.

**Anmerkung zur Verschärfung.** Die Vorfassung galt als erfüllt, wenn eine neue Kategorie
in weniger als 30 Minuten durch Änderung an weniger als drei Dateien ergänzt werden kann.
Das setzt eine Code-Änderung voraus und ist damit keine Erweiterbarkeit zur Laufzeit. Die
Anforderung ist deshalb neu formuliert und der Wertebereich in eine eigene Entität
überführt ([D1.3](D1-datenmodell.md#d13-categories)).

**Status:** Erfüllt. Kategorie ist als eigene Entität `CATEGORIES` umgesetzt
(Datenmodell, Backend-Endpunkte `GET`/`POST /api/categories`, Frontend). Neue
Kategorien werden über die Oberfläche angelegt (`CategoryFilter`), sofort im
Event-Formular auswählbar und in der Timeline filterbar — ohne Neustart oder
Code-Änderung. Bestehende Installationen mit der alten, fest codierten
Kategorie-Liste werden beim Serverstart automatisch migriert.

---

## 15. Anforderungen an Sicherheit

**NFR-15a-01: Zugriff nur auf eigene Daten**

Nutzer:innen greifen ausschließlich auf die Events und Kategorien zu, die ihrem eigenen
Konto zugeordnet sind.

**Prüfkriterium:** Der direkte Zugriff auf ein fremdes Event über dessen Kennung wird
abgewiesen, und die Rückmeldung unterscheidet **nicht** zwischen „existiert nicht" und
„gehört einer anderen Nutzer:in" — sonst ließe sich die Existenz fremder Einträge
feststellen ([SC-05](P1-ziele-rahmenbedingungen.md#p16-erfolgskriterien)).

**NFR-15a-02: Prüfung bei jeder Operation**

Die Zugehörigkeit wird bei **jeder** Operation geprüft, nicht nur beim Aufbau einer
Ansicht. Eine Ansicht, die nur eigene Einträge zeigt, ist kein Schutz.

**Prüfkriterium:** Für jede lesende und schreibende Operation existiert ein Test mit einem
fremden Event, der die Abweisung nachweist.

**NFR-15b-01: Verschlüsselte Übertragung**

Jede Kommunikation zwischen Browser und Anwendung ist transportverschlüsselt.

**Prüfkriterium:** In der Zielumgebung ist kein unverschlüsselter Zugriff möglich.

**NFR-15b-02: Passwörter nie im Klartext**

Passwörter werden ausschließlich als kryptografischer Hash gespeichert und nie
protokolliert oder ausgeliefert (`INV-U2`).

**Prüfkriterium:** Weder im Datenbestand noch in den Protokollen ist ein Passwort im
Klartext auffindbar.

**NFR-15b-03: Neutralisierung von Freitexteingaben**

Von Nutzer:innen stammende Inhalte werden bei der Darstellung so behandelt, dass sie nicht
als ausführbarer Inhalt wirken können.

**Prüfkriterium:** Ein Event, dessen Titel Auszeichnungs- oder Skriptsyntax enthält, wird
als Text dargestellt und nicht ausgeführt.

**NFR-15b-04: Prüfung hochgeladener Dateien**

Bilduploads werden in der Anwendungslogik gegen Format und Größe geprüft; die Angabe des
Browsers ist nicht maßgeblich ([D2.3](D2-datentypenverzeichnis.md#d23-bild-image_path)).

**Prüfkriterium:** Eine Datei mit unzulässigem Inhalt wird auch dann abgewiesen, wenn sie
mit zulässiger Endung und zulässigem gemeldeten Dateityp übermittelt wird.

**NFR-15c-01: Datensparsamkeit**

Es werden nur die fachlich notwendigen personenbezogenen Daten erhoben
([CON-3j-01](P1-constraints.md#con-3j-01-persönliche-daten), DS-01 in A02).

**Prüfkriterium:** Jedes Attribut in [D1](D1-datenmodell.md) ist einem Anwendungsfall
zuzuordnen. Es werden keine Nutzungsdaten zu anderen Zwecken erhoben.

**NFR-15c-02: Keine personenbezogenen Daten in Protokollen**

Protokolle enthalten weder Zugangsdaten noch Event-Inhalte
([N2.5](N2-querschnittskonzepte.md#n25-secret-handling-und-protokollierung), DS-02 in A02).

**Prüfkriterium:** In einem Protokollauszug eines vollständigen Durchlaufs ist kein
Event-Titel und kein Passwort enthalten.

---

## 17. Anforderungen an Konformität

**NFR-17a-01: Auskunft und Löschung**

Nutzer:innen müssen ihre gespeicherten persönlichen Inhalte
einsehen und löschen können.

**Prüfkriterium:** Für einen Benutzeraccount kann nachgewiesen
werden, dass die zugehörigen gespeicherten Inhalte eingesehen
und gelöscht werden können.

---

## N1.8 Nicht Teil von N1

- **Rahmenbedingungen** — [`P1-constraints.md`](P1-constraints.md).
- **Gültigkeitsregeln für Eingaben** — [D1](D1-datenmodell.md),
  [D2](D2-datentypenverzeichnis.md), [N2.2](N2-querschnittskonzepte.md#n22-validierung). Diese sind
  funktional, nicht nichtfunktional.
- **Strategien, wie eine Qualität erreicht wird** — [N2](N2-querschnittskonzepte.md); die
  technische Umsetzung in A08.
- **Funktionale Anforderungen** — [F2](F2-anwendungsfaelle.md),
  [F3](F3-anwendungsfunktionen.md).

---

## N1.9 Zuordnung zur Vorfassung

| Alt | Neu | Anmerkung |
|---|---|---|
| NFA-01 Benutzbarkeit | `NFR-11a-01` | unverändert |
| NFA-02 Korrektheit | — | **entfällt.** Eingabevalidierung ist eine funktionale Anforderung; sie steht in N2.2 und D1/D2. |
| NFA-03 Erweiterbarkeit | `NFR-14c-01` | verschärft: Erweiterbarkeit zur Laufzeit statt geringer Code-Änderung |
| NFA-04 Sicherheit | `NFR-15a-01` | Prüfkriterium um die Ununterscheidbarkeit ergänzt |
| NFA-05 Performance | `NFR-12a-01` | unverändert, Herkunft der Zahl 200 belegt |

---

## N1.10 Querverweise

| Baustein | Bezug zu N1 |
|---|---|
| [P1](P1-ziele-rahmenbedingungen.md) | `SC-01` bis `SC-07` sind die Abnahmekriterien auf Projektebene. |
| [P1-constraints](P1-constraints.md) | `CON-3e-01`, `CON-3i-02`, `CON-3j-01` sind die Ursprünge. |
| [F2](F2-anwendungsfaelle.md) | Je Anwendungsfall verweist die Zeile *Qualitäten* auf die geltenden Anforderungen. |
| [D1](D1-datenmodell.md) | `NFR-14c-01` ist der Grund für die Entität `CATEGORIES`. |
| [B1](B1-dialogspezifikation.md) | §10 und §11 binden die Dialoge. |
| [S3](../betrieb/S3-inbetriebnahme.md) | `NFR-12d-01` ist der Grund für die persistenten Zustandsflächen. |
| [`docs/arch/A01`](../arch/A01-Einleitung-und-Ziele.md) | Die Qualitätsziele QG-01 bis QG-03 werden durch die Anforderungen dieses Bausteins konkretisiert. |

---

## N1.11 Erfüllungsstand zur Abgabe

Stand 23.09.2026. **Erfüllt** heißt: umgesetzt und mit dem genannten Nachweis geprüft.
**Teilweise** heißt: umgesetzt, aber das Prüfkriterium ist nicht vollständig nachgewiesen.
**Offen** heißt: nicht nachgewiesen.

Automatisierte Tests: `npm --prefix backend test` (Integrationstests gegen die laufende
API sowie Einzeltests für Validierung und Bildprüfung) und
`npm --prefix frontend run test:browser` (Browser-Test in Chrome oder Edge; startet Backend
und den Produktions-Build des Frontends selbst und prüft die hier genannten Anforderungen
mit Messwerten).

| Anforderung | Stand | Nachweis bzw. Einschränkung |
|---|---|---|
| NFR-10a-01 Desktop und Smartphone | Erfüllt | Browser-Test: kein horizontales Scrollen in Anmeldung, Hauptansicht (mit Filterleiste und Auswertung) und Ereignisformular bei 375 × 667 und 1920 × 1080; Aktionen auf Touch-Geräten sichtbar. |
| NFR-11a-01 Erfassen ohne Anleitung | Offen | Kein Test mit einer unbeteiligten Person durchgeführt. |
| NFR-11c-01 Verständliche Rückmeldungen | Erfüllt | Meldungen der Anwendungslogik ohne Feldnamen und Formate; zentraler Fehler-Handler ohne Stapelspuren; Netzwerkfehler werden übersetzt. |
| NFR-11d-01 Grundlegende Zugänglichkeit | Teilweise | Formularfelder beschriftet, Kategorie überall als Text. Vollständige Tastaturbedienung nicht systematisch geprüft (z. B. kein Fokusfang im Formularfenster). |
| NFR-12a-01 Ladeverhalten | Erfüllt | Browser-Test: 200 Events in unter 1 s vollständig dargestellt (Produktions-Build, Median aus drei Ladevorgängen, in mehreren Läufen 0,5–1,0 s; Grenze 2 s). |
| NFR-12a-02 Filterung ohne Verzögerung | Erfüllt | Browser-Test: Filterwechsel ohne Serveranfrage, Darstellung nach rund 40 ms (Grenze 200 ms). |
| NFR-12c-01 Chronologische Ordnung | Erfüllt | Browser-Test mit mehreren Events am selben Tag mit und ohne Uhrzeit: Zeitachse und Event-Liste folgen derselben Ordnung (Datum, dann Uhrzeit, ohne Uhrzeit am Tagesende). |
| NFR-12d-01 Dauerhaftigkeit | Erfüllt | Test „Events bleiben nach einem Neustart erhalten“. |
| NFR-12d-02 Keine Teilzustände | Teilweise | Konto und Startkategorien in einer Transaktion; Bilder werden kompensierend aufgeräumt. Restrisiko zwischen Datei und Datenbank siehe OP-08. |
| NFR-12e-01 Bestandsgröße | Erfüllt | Browser-Test mit 500 Events: Darstellung in unter 2 s (Produktions-Build, Median aus drei Ladevorgängen, in mehreren Läufen 1,2–1,4 s); Filtern, Jahresansicht, Jahreswechsel, Anlegen und Bearbeiten funktionieren. |
| NFR-13b-01 Betrieb ohne Zusatzdienste | Teilweise | Produktionsbetrieb als ein Prozess ohne Datenbankserver lokal geprüft; Betrieb hinter HTTPS nicht nachgewiesen. |
| NFR-13b-02 Nutzung ohne Installation | Teilweise | Durchlauf von Registrierung bis Anlegen in Chrome; zweiter Browser nicht protokolliert. |
| NFR-14a-01 Nachvollziehbarkeit | Teilweise | Versionierung und Pull Requests auf GitHub; der Abgabe-Tag `v1.0.0` wird mit der Abgabe gesetzt. |
| NFR-14a-02 Prüfbarkeit der Kernabläufe | Erfüllt | Integrationstests: UC-01, UC-02, UC-03, UC-04 (Laden), UC-07, UC-08. Browser-Test: UC-05 (Filtern) und UC-04 (Darstellung). |
| NFR-14c-01 Erweiterbarkeit der Kategorien | Erfüllt | Test „Kategorie anlegen und verwenden“; Anlegen über die Oberfläche ohne Neustart. |
| NFR-15a-01 Zugriff nur auf eigene Daten | Erfüllt | Test: fremdes Event wird mit 404 beantwortet, genau wie ein nicht existierendes. |
| NFR-15a-02 Prüfung bei jeder Operation | Erfüllt | Test für Lesen, Ändern und Löschen eines fremden Events sowie für eine fremde Kategorie. |
| NFR-15b-01 Verschlüsselte Übertragung | Offen | Im Produktionsmodus wird das Cookie nur über HTTPS gesendet; eine Zielumgebung mit HTTPS ist nicht nachgewiesen. |
| NFR-15b-02 Passwörter nie im Klartext | Erfüllt | Speicherung nur als scrypt-Hash; Passwörter werden nicht protokolliert. |
| NFR-15b-03 Neutralisierung von Freitext | Erfüllt | Browser-Test: ein Titel mit `<script>` und `<img onerror>` erscheint als Text, es wird nichts ausgeführt. |
| NFR-15b-04 Prüfung hochgeladener Dateien | Erfüllt | Einzeltest: Datei mit falscher Signatur und nicht erlaubter Typ werden abgewiesen. |
| NFR-15c-01 Datensparsamkeit | Erfüllt | Es werden nur E-Mail, Passwort-Hash, Kategorien und Events gespeichert; jedes Attribut gehört zu einem Anwendungsfall. |
| NFR-15c-02 Keine personenbezogenen Daten in Protokollen | Erfüllt | Protokolliert werden nur Start, Migrationen und unerwartete Fehler. |
| NFR-17a-01 Auskunft und Löschung | Teilweise | Events einsehen, exportieren (UC-09) und löschen (UC-03) ist möglich; das Löschen des eigenen Kontos ist nicht umgesetzt. |
