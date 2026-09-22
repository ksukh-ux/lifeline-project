# S1 — Nachbarsystem-Schnittstellen

```mermaid
flowchart TD
    P(("👤<br/>Nutzer:in<br/><small>Einzelner Mensch;<br/>mobil und Desktop</small>"))
    L["«system»<br/><b>LIFELINE</b><br/><small>Persönliche Ereignis-Timeline</small>"]
    H["«external_system»<br/><b>Feiertagsdienst</b><br/><small>Öffentliche Feiertags-API</small>"]

    P -->|"Erfasst, betrachtet, filtert,<br/>wertet aus<br/>[HTTPS, Session]"| L
    L -.->|"Feiertage eines Jahres<br/>[HTTPS, kein Schlüssel]"| H

    style P fill:#f5f5f5,stroke:#333
    style L fill:#1a5fb4,stroke:#0d3868,color:#fff
    style H fill:#dcdcdc,stroke:#666
```

Die durchgezogene Kante zu Lifeline ist verbindlich, die gestrichelte zum Feiertagsdienst
optional — genau diese Unterscheidung ist der Kern der Fehlersemantik in S1.3.

Das Kontextdiagramm ist eine Ebene gröber als das S1-Inventar. Die Zuordnung zu den
S1-Abschnitten ist:

- **Nutzer:in** + der eingehende HTTPS-Kanal → [S1.2](#s12-nb-01--browser-der-nutzerin)
  (die Person ist der Akteur, der Browser der Kanal, gegen den S1 einen Vertrag
  schließt).
- **Feiertagsdienst** → [S1.3](#s13-nb-02--feiertagsdienst).

---

## S1.1 Konventionen

Die folgenden Konventionen gelten für jede unten aufgeführte Operation:

- **Synchron für NB-01, nicht-blockierend für NB-02.** Jeder Aufruf gegenüber
  `NB-01` ist Teil einer einzelnen HTTP-Anfrage und blockiert deren Antwort.
  Der Aufruf von `NB-02` erfolgt nicht-blockierend und darf niemals eine
  Anfrage der Nutzer:in zum Scheitern bringen. Es gibt keine Warteschlange,
  keinen Hintergrundarbeiter und keine zeitgesteuerte Wiederholung
  ([CON-3b-02](P1-constraints.md#con-3b-02-kein-scheduler-kein-hintergrundprozess)).
- **Fehlerfortpflanzung.** Fehler gegenüber `NB-01` werden in die Klassen aus
  [N2.5](N2-querschnittskonzepte.md#n25-fehlerbehandlung) eingeordnet und in der
  Oberfläche nach [B1.4.2](B1-dialogspezifikation.md#b142-fehlermeldungen) dargestellt.
  Fehler gegenüber `NB-02` folgen der Sonderregel in S1.3 und erreichen die Oberfläche
  überhaupt nicht.
- **Authentifizierung.** Zugriffe über `NB-01` sind sitzungsgebunden
  ([N2.4](N2-querschnittskonzepte.md#n24-authentifizierung-und-session)). `NB-02`
  erfordert keinen Schlüssel; Geheimnisse werden ohnehin nie im Repository oder Protokoll
  geführt ([N2.8](N2-querschnittskonzepte.md#n28-umgang-mit-geheimnissen)).
- **Details auf Payload-Ebene.** Konkrete Endpunkt-URLs, Feldnamen, Statuscodes und
  Wiederholungsbudgets sind Implementierungssache und leben in
  [`docs/arch/`](../arch/) und im Code, nicht hier. S1 legt fest, **welche** Operationen
  es gibt und **welche Semantik** sie haben; die Architekturschicht bindet das an
  konkrete Endpunkte.

---

## S1.2 NB-01 — Browser der Nutzer:in

Der Browser ist der einzige menschliche Zugangskanal zu Lifeline. Die Dialogoberfläche
ist in [B1](B1-dialogspezifikation.md) spezifiziert, die einzelnen Operationen
(Konto anlegen, Event anlegen/ändern/löschen, Kategorie verwalten, Auswertung abrufen) in
[F2](F2-anwendungsfaelle.md). Über das hinaus, was B1 und F2 bereits festlegen, ist hier
kein weiterer Protokollvertrag zu spezifizieren.

Was S1 an dieser Grenze ergänzt, ist die grenzüberschreitende Semantik, die B1 und F2
nicht von sich aus zeigen:

### S1.2.1 Grenzsemantik

| Aspekt | Festlegung |
|---|---|
| Verbindlichkeit | Jede Antwort ist verbindlich — im Unterschied zu `NB-02`. |
| Fehlende Session | Abweisung; die Oberfläche leitet nach [B1.4.1](B1-dialogspezifikation.md#b141-umleitung-ohne-session) zum Zugangsformular. |
| Zugriff auf fremde Daten | Abweisung, **ohne** zu unterscheiden, ob das Objekt nicht existiert oder einer anderen Nutzer:in gehört ([NFR-15a-01](N1-nichtfunktional.md)). |
| Teilzustände | Ausgeschlossen; eine fehlgeschlagene Operation hinterlässt keinen halb gespeicherten Datensatz ([NFR-12d-02](N1-nichtfunktional.md)). |
| Vertrauensgrenze | Alles, was über `NB-01` hereinkommt, gilt als nicht vertrauenswürdig, auch von einer angemeldeten Nutzer:in ([N2.3](N2-querschnittskonzepte.md#n23-validierung)). |

---

## S1.3 NB-02 — Feiertagsdienst

Speicherfreie Anreicherung der Timeline mit gesetzlichen Feiertagen.

### S1.3.1 Warum dieses Nachbarsystem

Von den in `docs/OFFENE-PUNKTE.md` (OP-04) geprüften Kandidaten ist der Feiertagsdienst
der einzige, der zu [CON-3g-01](P1-constraints.md#con-3g-01-kein-budget-für-infrastruktur)
(kein Budget) und [CON-3h-01](P1-constraints.md#con-3h-01-harte-abgabefrist)
(Abgabefrist) passt: kein Schlüssel, keine Registrierung, kein Ausfallrisiko, das die
Kernfunktion gefährdet.

Fachlicher Nutzen: Feiertage werden als dezente Markierungen im Hintergrund der Timeline
angezeigt und helfen, eigene Events zeitlich einzuordnen. Das ist eine **Erweiterung**,
keine Muss-Funktion; sie ändert nichts an
[P1.4.1](P1-ziele-rahmenbedingungen.md#p141-zuordnung-der-anwendungsfälle).

| Aspekt | Inhalt |
|---|---|
| **Operation** | `getHolidays(country, year) → [{ date, name }]` |
| **Richtung** | Ausgehend (Anfrage: Ländercode + Jahr; Antwort: Liste von Feiertagen). |
| **Eingaben** | Fester Ländercode aus der Hostkonfiguration, Standard: Deutschland (`DE`); das in der Timeline sichtbare Kalenderjahr. Kein Schlüssel erforderlich (siehe S1.1). |
| **Ausgaben** | Liste aus Datum und Bezeichnung, eingeblendet als Hintergrundmarkierung in [DLG-01](B1-dialogspezifikation.md#dlg-01--timeline). Wird **nicht** persistiert — kein Attribut in [D1](D1-datenmodell.md) wird davon befüllt. |
| **Ausgelöst durch** | [UC-04](F2-anwendungsfaelle.md#uc-04--timeline-ansehen), Schritt 4. |
| **Semantik** | Rein informativ; keine Rückwirkung auf `EVENTS` oder `CATEGORIES`. Das Ergebnis wird für die Dauer der Session je Land und Jahr zwischengespeichert, um wiederholte Aufrufe zu vermeiden. |
| **Fehlerbehandlung** | Nicht erreichbar, langsame Antwort, ungültige Daten und unbekanntes Jahr/Land werden **alle** wie „keine Feiertage für diesen Zeitraum" behandelt. Es entsteht keine Fehlermeldung an die Nutzer:in. |
| **Verantwortung** | Der externe Dienst wird vom jeweiligen externen Anbieter betrieben; Lifeline übernimmt keine administrative Verantwortung. |
| **Anpassungen am Nachbarsystem** | Keine Anpassungen erforderlich; Lifeline nutzt den öffentlich bereitgestellten Dienst ausschließlich über dessen vorhandene Schnittstelle. |

### S1.3.2 Bindende Regel (Fehlerverhalten)

Dies ist das erste Nachbarsystem in Lifeline, dessen Ausfall **kein Fehler der
Nutzer:in** sein darf.

> Kein Zustand in [UC-04](F2-anwendungsfaelle.md#uc-04--timeline-ansehen) darf vom
> Erfolg dieses Aufrufs abhängen. Die Timeline wird angezeigt, sobald die eigenen Events
> geladen sind — der Aufruf an `NB-02` wird nicht abgewartet und sein Scheitern nicht
> gemeldet. Feiertage erscheinen nachträglich, sobald die Antwort da ist, oder gar nicht.

Damit unterscheidet sich `NB-02` grundsätzlich von `NB-01`: bei `NB-01` ist jede Antwort
verbindlich, bei `NB-02` ist ihr Fehlen ein regulärer, erwarteter Fall.

---

## S1.4 Nicht Teil von S1

- **Interner Ablauf innerhalb von Lifeline.** Wie Anwendungslogik und Datenhaltung
  zusammenspielen, ist keine Nachbarsysteminteraktion — siehe
  [F2](F2-anwendungsfaelle.md) und [A05](../arch/A05-Bausteinansicht.md).
- **Domänenalgorithmen laufen innerhalb von Lifeline.** AF-01 bis AF-04 arbeiten auf
  bereits vorhandenen, eigenen Daten; sie sind keine Nachbarsysteminteraktion — siehe
  [F3](F3-anwendungsfunktionen.md).
- **Endpunkt-URLs, Feldnamen, Codec-Details, Wiederholungsbudgets.**
  Implementierungssache — siehe [`docs/arch/`](../arch/).
- **Die Dialogoberfläche der Nutzer:in.** Spezifiziert in
  [B1](B1-dialogspezifikation.md).
- **Die Betriebsumgebung.** Stellt Laufzeit und Speicher bereit, ist aber kein
  Kommunikationspartner — siehe [`docs/betrieb/S3`](../betrieb/S3-inbetriebnahme.md).
- **Datenmigration.** Baustein S2, nicht anwendbar.

---

## S1.5 Referenzen auf S1

Anders als eine gewöhnliche Querverweistabelle zeigt diese Tabelle die Richtung **von den
anderen Bausteinen auf S1**: was dort konkret aus S1 aufgerufen oder vorausgesetzt wird.

| Baustein | Bezug zu S1 |
|---|---|
| **F2** | UC-04 Schritt 4 ruft S1.3 auf. Alle übrigen Anwendungsfälle rufen ausschließlich S1.2 auf. |
| **F3** | Kein Bezug. AF-01 bis AF-04 verarbeiten nur bereits geladene, eigene Daten; das Ergebnis von S1.3 fließt in keine Anwendungsfunktion ein. |
| **D1** | Kein Attribut wird durch S1 befüllt. Feiertage aus S1.3 werden ausdrücklich **nicht** gespeichert — das ist eine bewusste Festlegung, keine Lücke. |
| **B1** | DLG-01 zeigt das Ergebnis von S1.3 als Hintergrundmarkierung. Kein Dialog stellt einen Fehler dar, wenn S1.3 ausfällt (B1.4.2 ist hier bewusst nicht angewendet). |
| **N1** | `NFR-15a-01` und `NFR-15b-01` gelten für S1.2. Für S1.3 gilt sinngemäß, dass ihr Ausfall keine Anforderung an S1.2 verletzen darf. |
| **N2** | N2.3 Validierung gilt an der Grenze zu S1.2; N2.5 Fehlerbehandlung enthält die für S1.3 geltende Sonderregel; N2.8 Umgang mit Geheimnissen gilt für S1.2 — S1.3 braucht keines. |
| **P2** | P2.2 führt S1.2 und S1.3 als vollständiges Nachbarsysteminventar. |
| **`docs/OFFENE-PUNKTE.md`** | OP-04 wird durch S1.3 gelöst. |
