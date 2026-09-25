# S3 — Inbetriebnahme und Bereitstellung

S3 beschreibt, wie Lifeline in den produktiven Betrieb gebracht wird und wie spätere
Stände dieselbe Umgebung erreichen, im Sinne von Siedersleben (Kap. 4.6): der Baustein
*Inbetriebnahme* benennt die **Voraussetzungen an die Umgebung**, die **persistenten
Zustandsflächen**, die jede Auslieferung überdauern müssen, den Ablauf der
**Erstinbetriebnahme** und den leichteren Ablauf **folgender Auslieferungen**.

S3 bleibt auf der Ebene *was* geschehen muss und *welche Bedingungen* dabei gelten. *Wie*
konkret ausgeliefert wird — Befehle, Pfade, Build-Schritte, Plattformeinstellungen —
gehört in die Verteilungssicht [A07](../arch/A07-Bereitstellungsansicht.md) und in die
Skripte selbst. **S3 ist kein Runbook.**

Dieser Baustein liegt als eigener Bereich `docs/betrieb/` auf derselben Ebene wie
`docs/spec/` und `docs/arch/`, weil er beide Seiten adressiert: er fordert von der
Umgebung, was die Spezifikation an Dauerhaftigkeit verlangt, und übergibt die konkrete
Umsetzung an die Architektur.

---

## S3.1 Konventionen

- **Kein Vorgängersystem.** Lifeline ist Greenfield. Kein Parallelbetrieb, kein
  Umstellungstermin, keine Datenübernahme; Baustein S2 entfällt.
- **Ein gemeinsames Deployment.** Oberfläche, Anwendungslogik und Datenhaltung werden als
  **eine** Einheit betrieben
  ([CON-3a-03](../spec/P1-constraints.md#con-3a-03-ein-gemeinsames-deployment)). Damit
  gibt es keine getrennt auszurollenden Bestandteile und keine Versionskompatibilität
  zwischen ihnen zu verwalten.
- **Kein Scheduler im Laufzeitpfad.** Jede Verarbeitung läuft synchron innerhalb einer
  Anfrage ([CON-3b-02](../spec/P1-constraints.md#con-3b-02-kein-scheduler-kein-hintergrundprozess)).
- **Keine Mehrmandantenfähigkeit.** Eine Installation bedient beliebig viele
  Benutzerkonten, aber es gibt keinen Mandantenbegriff und keine mandantenweise
  Einrichtung.

---

## S3.2 Voraussetzungen an den Host

| ID | Voraussetzung | Begründung |
|---|---|---|
| HOST-01 | Erreichbarkeit über HTTPS an der öffentlichen Kante. | Zugangsdaten und persönliche Ereignisse werden übertragen ([NFR-15b-01](../spec/N1-nichtfunktional.md)). |
| HOST-02 | Laufzeitumgebung, die die Anwendung als langlaufenden Serverprozess ausführt. | Die Anwendung bedient Anfragen und hält die Datenhaltung. |
| HOST-03 | **Ein über Neustart und Neu-Deployment hinweg persistenter Speicherbereich**, beschreibbar durch den Anwendungsprozess. | Siehe S3.3. Ohne ihn ist [SC-04](../spec/P1-ziele-rahmenbedingungen.md#p16-erfolgskriterien) nicht erfüllbar. |
| HOST-04 | Konfiguration über Umgebungsvariablen außerhalb des Quellcodes. | Geheimnisse dürfen nicht im Repository liegen ([N2.5](../spec/N2-querschnittskonzepte.md), CONV-05 in A02). |
| HOST-05 | Möglichkeit, den Inhalt des persistenten Bereichs zu sichern und zurückzuspielen. | Voraussetzung für S3.6. |
| HOST-06 | Kein zeitgesteuerter Dienst und kein Hintergrundarbeiter erforderlich. | Negativvoraussetzung: einfache Umgebungen ohne diese Möglichkeiten sind ausdrücklich geeignet ([CON-3g-01](../spec/P1-constraints.md#con-3g-01-kein-budget-für-infrastruktur)). |

**`HOST-03` ist die kritische Voraussetzung.** Viele kostenfreie Plattformen stellen ein
**flüchtiges** Container-Dateisystem bereit: dort ist der Zustand nach jedem Deployment
zurückgesetzt. Die Eignung der gewählten Plattform ist vor der Inbetriebnahme
**nachzuweisen**, nicht anzunehmen — siehe
[CON-3b-01](../spec/P1-constraints.md#con-3b-01-persistenter-speicher-in-der-zielumgebung)
und die Konsequenzen von ADR-003.

**Stand zur Abgabe:** Lifeline wird nur lokal betrieben; eine Zielumgebung, die HOST-01 bis
HOST-06 erfüllt, ist noch nicht ausgewählt und nachgewiesen
([OP-10](../OFFENE-PUNKTE.md)).

---

## S3.3 Persistente Zustandsflächen

Flächen, deren Inhalt **jede** Auslieferung und jeden Neustart überdauern muss. Alles
andere darf ohne Weiteres neu erzeugt werden.

| Fläche | Inhalt | Verlust bedeutet |
|---|---|---|
| **Chronikbestand** | Benutzerkonten, Kategorien, Events ([D1.1](../spec/D1-datenmodell.md#d11-übersicht)) | Totalverlust aller Chroniken. Nicht wiederherstellbar. |
| **Bildablage** | Die zu Events hochgeladenen Bilddateien ([D2.3](../spec/D2-datentypenverzeichnis.md#d23-bild-image_path)) | Events bleiben erhalten, ihre Bilder fehlen; `INV-E5` ist verletzt. |

Zwei Folgerungen, die leicht übersehen werden:

1. **Eine Sicherung der Datenbank allein sichert die Chronik nicht vollständig.** Bilder
   liegen außerhalb. Beide Flächen sind gemeinsam zu sichern und gemeinsam
   zurückzuspielen, sonst entstehen Verweise auf fehlende Dateien.
2. **Der Session-Zustand gehört ausdrücklich nicht dazu.** Die Session-Kennungen liegen
   nur im Arbeitsspeicher des Backend-Prozesses und gehen bei jedem Neustart verloren;
   die Nutzdaten bleiben erhalten, Nutzer:innen müssen sich nur erneut anmelden. Das ist
   eine bewusst akzeptierte Einschränkung des aktuellen Prototyps.

---

## S3.4 Erstinbetriebnahme

Jede Zeile ist eine Bedingung, nicht ein Befehl.

| # | Aktivität | Ergebnis |
|---|---|---|
| I1 | Voraussetzungen `HOST-01` bis `HOST-06` prüfen und nachweisen. | Umgebung geeignet. |
| I2 | Persistenten Speicherbereich einrichten und der Anwendung zuweisen. | Beide Flächen aus S3.3 liegen dort. |
| I3 | Laufzeitkonfiguration setzen (S3.7). | Anwendung startfähig. Aktive Sessions müssen nach einem Neustart neu aufgebaut werden. |
| I4 | Auslieferungsartefakt bereitstellen und Anwendung starten. | Anwendung erreichbar: `GET /api/health` antwortet mit `{ "status": "ok" }`. |
| I5 | Leeres Datenschema anlegen. Die Standardkategorien entstehen nicht mit dem Schema, sondern bei jeder Registrierung für das neue Konto ([D1.3](../spec/D1-datenmodell.md#d13-categories)). | Leere, betriebsbereite Datenbank. |
| I6 | Abnahme: Konto anlegen, Event erfassen, **Anwendung neu starten**, Event ist noch vorhanden. | `SC-01` und **`SC-04`** nachgewiesen. |

Schritt I6 ist kein Formalismus: er ist der einzige Test, der die Gefahr aus `HOST-03`
tatsächlich ausschließt.

---

## S3.5 Folgende Auslieferungen

| # | Aktivität | Bedingung |
|---|---|---|
| R1 | Neues Artefakt bereitstellen. | Konfiguration bleibt unverändert, sofern sich keine Variable geändert hat. |
| R2 | Schemaänderungen anwenden, falls sich das Datenmodell geändert hat. | Muss auf einem **bestehenden** Bestand laufen, nicht nur auf einem leeren. |
| R3 | Anwendung neu starten. | Persistente Flächen aus S3.3 bleiben unberührt. |
| R4 | Kurzabnahme: anmelden, vorhandenes Event anzeigen. | Bestand unversehrt. |

Eine Auslieferung ist nur dann unkritisch, wenn sie **keine** der Flächen aus S3.3
berührt. Sobald eine Schemaänderung ansteht, gilt S3.6.

---

## S3.6 Rückfall und Punkt ohne Wiederkehr

| Lage | Vorgehen |
|---|---|
| Auslieferung ohne Schemaänderung schlägt fehl | Vorheriges Artefakt erneut bereitstellen. Bestand unberührt, kein Datenverlust. |
| Auslieferung **mit** Schemaänderung schlägt fehl | Rückfall nur zusammen mit dem Rückspielen der vor der Änderung erstellten Sicherung möglich. |
| **Punkt ohne Wiederkehr** | Sobald eine Schemaänderung ausgeführt wurde und danach Nutzerdaten geschrieben wurden. Ab hier bedeutet Rückfall Datenverlust. |

Daraus folgt die einzige zwingende Regel dieses Bausteins: **vor jeder Auslieferung mit
Schemaänderung wird eine Sicherung beider Flächen aus S3.3 erstellt und ihre
Rückspielbarkeit geprüft** (`HOST-05`).

Praktisch relevant wird das bei der Einführung der Entität `CATEGORIES`: bestehende Events
müssen dabei von einem Kategoriewert auf einen Kategorieverweis umgestellt werden. Das ist
eine Schemaänderung auf bestehendem Bestand und damit der erste echte Anwendungsfall
dieser Regel.

---

## S3.7 Laufzeitkonfiguration

Konfiguriert wird ausschließlich über Umgebungsvariablen; konkrete Werte liegen nie im
Repository.

| Einstellung | Zweck | Änderung/Verlust bedeutet |
|---|---|---|
| Netzwerkport | Port, auf dem die Anwendung Anfragen annimmt | Anwendung nicht erreichbar. |
| Pfad des Chronikbestands | Ablageort der Datenbank | Muss auf die persistente Fläche zeigen, sonst Datenverlust bei jedem Deployment. |
| Ablageort der Bilder | Ort der Bilddateien | Muss auf der persistenten Fläche liegen, sonst fehlende Bilder. Im aktuellen Stand ist der Ort nicht einstellbar, sondern fest vorgegeben (siehe A07.2); die Zielumgebung muss ihn deshalb auf persistentem Speicher bereitstellen. |
| Ländercode für Feiertage | Land, dessen gesetzliche Feiertage angezeigt werden (Standard Deutschland) | Falscher Wert: Feiertage eines anderen Landes oder keine; die Timeline bleibt nutzbar. |
| Erlaubte Frontend-Adresse | Nur nötig, wenn Frontend und Backend unter verschiedenen Adressen laufen (Entwicklung) | Fehlt sie, kann sich das Frontend nicht anmelden, weil der Browser das Session-Cookie nicht mitsendet. |
| Betriebsmodus | Unterscheidung Entwicklung/Produktion | Im Produktionsmodus dürfen keine internen Fehlerdetails ausgeliefert werden ([N2.4](../spec/N2-querschnittskonzepte.md)). |

Die konkreten Variablennamen stehen in [A07.2](../arch/A07-Bereitstellungsansicht.md).

---

## S3.8 Nicht Teil von S3

- **Konkrete Befehle, Pfade, Build-Schritte, Plattformeinstellungen** —
  [A07](../arch/A07-Bereitstellungsansicht.md) und die README des Repositorys.
- **Einrichtung der Entwicklungsumgebung.** Arbeitsmittel des Teams, nicht Teil der
  Inbetriebnahme des Produkts.
- **Datenübernahme aus einem Altsystem.** Baustein S2, nicht anwendbar.
- **Parallelbetrieb und Umstellungsplanung.** Es gibt kein abzulösendes System.
- **Überwachung im laufenden Betrieb.** Im aktuellen Umfang nicht spezifiziert; das
  Protokollierungskonzept steht in [N2.5](../spec/N2-querschnittskonzepte.md).

---

## S3.9 Querverweise

| Baustein | Bezug zu S3 |
|---|---|
| [P1](../spec/P1-ziele-rahmenbedingungen.md) | `SC-04` wird in I6 nachgewiesen; `AS-04` ist die Annahme, die `HOST-03` prüft. |
| [P1-constraints](../spec/P1-constraints.md) | `CON-3a-02`, `CON-3a-03`, `CON-3b-01`, `CON-3b-02`, `CON-3g-01` prägen diesen Baustein. |
| [D1](../spec/D1-datenmodell.md) | Die beiden Datenspeicher aus D1.1 sind die Flächen aus S3.3. |
| [N1](../spec/N1-nichtfunktional.md) | `NFR-12d-01` Dauerhaftigkeit, `NFR-13b-01` Betrieb ohne Zusatzdienste, `NFR-15b-01` Verschlüsselung. |
| [N2](../spec/N2-querschnittskonzepte.md) | N2.5 bestimmt, was über die Laufzeitkonfiguration bereitzustellen ist. |
| [A07](../arch/A07-Bereitstellungsansicht.md) | Die konkrete Umsetzung dessen, was hier gefordert wird. |
| ADR-003 (A09) | Die Konsequenz „Hosting muss persistenten Speicher bieten" ist der Ursprung von `HOST-03`. |
