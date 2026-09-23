# Offene Punkte

Diese Datei sammelt bewusste Lücken und noch offene Entscheidungen, die aus einzelnen
Spezifikationsbausteinen heraus referenziert werden (`OP-XX`), anstatt sie als verstreute
Inline-Kommentare in den jeweiligen Dateien zu belassen. Ein offener Punkt ist entweder
eine bewusst zurückgestellte Lücke (mit Begründung) oder eine noch fehlende, aber
absehbar nötige Ergänzung.

Die Nummerierung ist nicht lückenlos garantiert — ein einmal vergebener `OP-`-Bezeichner
wird nach Auflösung nicht neu vergeben.

---

## OP-01 – Kein Dialog für „Alle Events löschen"

**Bezug:** [B1](spec/B1-dialogspezifikation.md), DLG-01.

Für das vollständige Löschen aller Events einer Nutzer:in existiert bislang kein eigener
Dialog. Vorgesehen ist eine Aktion in DLG-01 mit einer Rückfrage nach
[B1.4.3](spec/B1-dialogspezifikation.md#b143-bestätigung-zerstörerischer-aktionen)
(Bestätigung zerstörerischer Aktionen), analog zum Löschen eines einzelnen Events.

**Status:** Gelöst. „Alle Ereignisse löschen“ ist als Aktion im Menü des Anwendungsrahmens
umgesetzt, mit Rückfrage nach B1.4.3, und in F2 als Alternativablauf von UC-03 beschrieben.

## OP-03 – Kein Zurücksetzen eines vergessenen Passworts

**Bezug:** [B1](spec/B1-dialogspezifikation.md), Registrierung und Login.

Es gibt keinen Weg, ein vergessenes Passwort zurückzusetzen. Das ist eine bewusste
Lücke: ein Zurücksetzen-Mechanismus setzt üblicherweise einen E-Mail-Versand voraus, der
außerhalb des aktuellen Funktionsumfangs liegt und mangels Budget
([CON-3g-01](spec/P1-constraints.md#con-3g-01-kein-budget-für-infrastruktur)) und
angesichts der Abgabefrist
([CON-3h-01](spec/P1-constraints.md#con-3h-01-harte-abgabefrist)) nicht mehr aufgenommen
wurde.

**Status:** Bewusst zurückgestellt. Betrifft nur den eigenen Zugang der Nutzer:in zu
ihrem eigenen Konto; kein Sicherheitsrisiko für Dritte.

## OP-04 – Auswahl des Nachbarsystems für S1.3

**Bezug:** [S1.3](spec/S1-nachbarsysteme.md#s13-nb-02--feiertagsdienst).

Für ein zweites, echtes externes Nachbarsystem (über den Browser der Nutzer:in hinaus)
wurden mehrere Kandidaten geprüft:

| Kandidat | Verworfen, weil |
|---|---|
| KI-gestützte Vorschläge (z. B. eine LLM-API) | Erfordert einen kostenpflichtigen API-Schlüssel — verletzt [CON-3g-01](spec/P1-constraints.md#con-3g-01-kein-budget-für-infrastruktur); zusätzlicher Umsetzungsaufwand passt nicht zur Abgabefrist ([CON-3h-01](spec/P1-constraints.md#con-3h-01-harte-abgabefrist)). |
| Kalender-Synchronisation (z. B. Google Calendar) | Erfordert OAuth-Registrierung und einen externen Authentifizierungsdienst — ausdrücklich als Nichtziel ausgeschlossen (`NG-05`). |
| Wetterdienst | Die meisten frei nutzbaren Anbieter verlangen inzwischen eine Registrierung oder einen Schlüssel; kein belastbarer fachlicher Mehrwert für eine persönliche Ereignis-Timeline. |
| **Feiertagsdienst (gewählt)** | Öffentlich, ohne Schlüssel und ohne Registrierung nutzbar; Ausfall gefährdet keine Muss-Funktion (siehe [S1.3.2](spec/S1-nachbarsysteme.md#s132-bindende-regel-fehlerverhalten)); passt zu [CON-3g-01](spec/P1-constraints.md#con-3g-01-kein-budget-für-infrastruktur) und [CON-3h-01](spec/P1-constraints.md#con-3h-01-harte-abgabefrist). |

**Status:** Gelöst. Der Feiertagsdienst ist in [S1.3](spec/S1-nachbarsysteme.md#s13-nb-02--feiertagsdienst)
vollständig spezifiziert und mittlerweile auch technisch umgesetzt: Endpunkt
`GET /api/holidays` in `backend/src/routes/holidays.ts`, nicht-blockierender Aufruf und
Darstellung als Hintergrundmarkierung in der Timeline im Frontend.

## OP-07 – Instagram-Import als spätere Erweiterung

**Bezug:** [S1.4](spec/S1-nachbarsysteme.md#s14-nb-03--instagram-vorgeschlagene-erweiterung),
[A03](arch/A03-Kontext-und-Umfang.md), [A04](arch/A04-Lösungsstrategie.md).

Als weiteres Nachbarsystem wurde Instagram vorgeschlagen, damit eigene Beiträge als
Lifeline-Ereignisse übernommen werden können. Für die Abgabe wird keine echte
Meta-OAuth-/Graph-API-Anbindung vorausgesetzt. Diese würde eine Meta-App,
Berechtigungen und ein geeignetes Instagram-Konto erfordern.

Als mögliche spätere Ausbaustufe ist ein manueller Import eines festgelegten
Instagram-Exportformats beschrieben. Das konkrete Format, die Medien-ID zur
Duplikatprüfung und der dazugehörige Dialog sind noch nicht implementiert.

**Status:** Bewusst zurückgestellt. Die technische Grundlage für Bildpersistenz und
normale Event-Erstellung ist vorhanden; die Instagram-spezifische Anbindung bleibt
ein dokumentierter Prototyp bzw. Folgeausbau.

## OP-05 – Fehlender Anwendungsfall für die Kategorienverwaltung

**Bezug:** [B1](spec/B1-dialogspezifikation.md), DLG-06; [D1.3](spec/D1-datenmodell.md#d13-categories); `NFR-14c-01` in [N1](spec/N1-nichtfunktional.md).

Seit `CATEGORIES` eine eigene Entität ist, müssen Nutzer:innen eigene Kategorien zur
Laufzeit anlegen können — das ist die Bedingung dafür, dass `NFR-14c-01`
(„Erweiterbarkeit der Kategorien") überhaupt erfüllbar ist. Der Dialog DLG-06 ist dafür
bereits spezifiziert, ein passender Anwendungsfall in [F2](spec/F2-anwendungsfaelle.md)
fehlt aber noch.

**Status:** Gelöst. [UC-08](spec/F2-anwendungsfaelle.md#uc-08--kategorie-anlegen)
deckt `POST /api/categories` und die DLG-06-Oberfläche jetzt formal ab (siehe auch OP-06
zur Abgrenzung des Funktionsumfangs von DLG-06).

## OP-06 – DLG-06 spezifizierte mehr, als das Backend an Kategorien-Endpunkten anbot

**Bezug:** [B1](spec/B1-dialogspezifikation.md), DLG-06; [D1.3](spec/D1-datenmodell.md#d13-categories).

DLG-06 beschrieb neben dem Anlegen auch das Umbenennen, Umfärben und Löschen eigener
Kategorien sowie einen Schutz der Standardkategorien vor Bearbeitung
(`INV-C1`–`INV-C3`), obwohl im Backend bisher ausschließlich `GET` und `POST
/api/categories` ([UC-08](spec/F2-anwendungsfaelle.md#uc-08--kategorie-anlegen))
umgesetzt sind — es gibt weder `PUT`/`DELETE`-Endpunkte noch eine Spalte, die eine
Standard- von einer eigenen Kategorie unterscheidet.

**Status:** Gelöst. DLG-06 wurde auf den tatsächlichen Funktionsumfang gekürzt
(nur noch Anlegen); Umbenennen, Umfärben und Löschen sind bewusst nicht spezifiziert,
solange es dafür keine Backend-Endpunkte gibt.

## OP-08 – Bilddatei und Datenbank nicht vollständig atomar

**Bezug:** [NFR-12d-02](spec/N1-nichtfunktional.md#12-anforderungen-an-das-laufzeitverhalten),
[D2.3](spec/D2-datentypenverzeichnis.md#d23-bild-image_path),
`backend/src/routes/events.ts` und `backend/src/utils/image.ts`.

Bilddateien werden außerhalb der SQLite-Datenbank gespeichert. Die aktuelle
Implementierung räumt eine neu angelegte Bilddatei bei einem nachfolgenden
Datenbankfehler wieder auf und löscht beim Ersetzen beziehungsweise Löschen eines
Events die alte Datei. Eine echte atomare Transaktion über Dateisystem und SQLite ist
damit jedoch nicht möglich; ein Fehler genau während einer Dateioperation kann in
seltenen Fällen einen verwaisten Datei- oder Datenbankverweis hinterlassen.

**Status:** Bewusst akzeptiertes Restrisiko des Prototyps. Die zentrale
Bildpersistenz und die Kompensation für die üblichen Fehlerfälle sind implementiert;
ein separates Storage-/Transaktionssystem wäre für den aktuellen Abgabeumfang
unverhältnismäßig.
