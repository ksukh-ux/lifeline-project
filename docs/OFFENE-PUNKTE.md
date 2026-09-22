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

**Status:** Offen. Kein Anwendungsfall in F2 verlangt diese Funktion als Muss; sie ist
eine denkbare Komfortfunktion, keine Voraussetzung für die Erfolgskriterien in P1.6.

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

## OP-05 – Fehlender Anwendungsfall für die Kategorienverwaltung

**Bezug:** [B1](spec/B1-dialogspezifikation.md), DLG-06; [D1.3](spec/D1-datenmodell.md#d13-categories); `NFR-14c-01` in [N1](spec/N1-nichtfunktional.md).

Seit `CATEGORIES` eine eigene Entität ist, müssen Nutzer:innen eigene Kategorien zur
Laufzeit anlegen können — das ist die Bedingung dafür, dass `NFR-14c-01`
(„Erweiterbarkeit der Kategorien") überhaupt erfüllbar ist. Der Dialog DLG-06 ist dafür
bereits spezifiziert, ein passender Anwendungsfall in [F2](spec/F2-anwendungsfaelle.md)
fehlt aber noch.

**Status:** Fachlich und technisch bereits umgesetzt (`POST /api/categories`,
DLG-06-Oberfläche); die formale Ergänzung eines Anwendungsfalls in F2 zur lückenlosen
Nachvollziehbarkeit steht noch aus.
