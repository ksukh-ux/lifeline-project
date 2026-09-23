# F3 – Anwendungsfunktionen

Anwendungsfunktionen im Sinne von Siedersleben (Kap. 4.4): in sich geschlossene, wiederverwendbare Verhaltensbausteine, die von einem oder mehreren Anwendungsfällen (F2) aufgerufen werden und aus fachlicher Sicht **genug algorithmische Substanz** besitzen, um eine eigene Beschreibung außerhalb des Anwendungsfalls zu rechtfertigen. F3 beschreibt bewusst **keine** Bildschirme, Komponenten oder Persistenz – das ist Aufgabe von [B1](B1-dialogspezifikation.md), [F2](F2-anwendungsfaelle.md) und der Architekturdokumentation.

Reines Anlegen, Bearbeiten und Löschen, die Registrierung/Anmeldung und das bloße Laden und Anzeigen von Events sind **keine** Anwendungsfunktionen in diesem Sinne – es sind Anwendungsfälle (siehe [F2](F2-anwendungsfaelle.md)) ohne eigenständigen Berechnungs- oder Transformationsschritt. Inhalte, die **nicht** nach F3 gehören, sind an ihrem eigentlichen Baustein dokumentiert:

- **Benutzerzugang, Anlegen/Bearbeiten/Löschen, Timeline ansehen.** Reine Interaktionsschritte ohne Algorithmus – siehe [F2](F2-anwendungsfaelle.md) UC-01 bis UC-04, UC-07.
- **Validierungsregeln.** Querschnittskonzept – siehe [N2.2](N2-querschnittskonzepte.md#n22-validierung), abgesichert durch [D2](D2-datentypenverzeichnis.md).
- **Persistenz.** Implementierung, nicht Spezifikation.

Was bleibt, sind die Funktionen, die tatsächlich etwas *berechnen* oder *transformieren*: Zeitspanne, Statistik, Filterung, Bildexport und die Zuordnung von Kategorien beim Import.

---

## F3.1 Funktionsübersicht

| ID | Funktion | Zweck |
|----|----------|-------|
| [AF-01](#af-01--zeitspanne-berechnen) | Zeitspanne berechnen | Berechnet die Anzahl Tage zwischen zwei Datumswerten, z. B. vom ältesten bis zum jüngsten Event. |
| [AF-02](#af-02--statistik-aggregation) | Statistik-Aggregation | Verdichtet die eigenen Events zu Kennzahlen (Anzahl insgesamt und je Kategorie, Zeitspanne, Tendenz der Bedeutung je Kategorie). |
| [AF-03](#af-03--timeline-filterung) | Timeline-Filterung | Reduziert die bereits geladenen Events auf die Events einer ausgewählten Kategorie. |
| [AF-04](#af-04--timeline-export) | Timeline-Export | Wandelt die aktuell dargestellte Timeline in eine PNG-Bilddatei um. |
| [AF-05](#af-05--kategorien-beim-import-zuordnen) | Kategorien beim Import zuordnen | Bildet die Kategorien einer Sicherungsdatei auf die Kategorien der angemeldeten Person ab. |

---

## F3.2 Funktionsbeschreibungen

### AF-01 — Zeitspanne berechnen

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Berechnet aus zwei Datumswerten die Anzahl der dazwischenliegenden Tage. Events sind Zeitpunkte, keine Zeiträume; die Funktion misst deshalb den Abstand zwischen zwei Events. |
| **Eingaben** | Zwei Datumswerte, hier das früheste und das späteste `date` der eigenen Events. |
| **Ausgaben** | Ganzzahlige Anzahl Tage. |
| **Regeln** | - Das Ergebnis wird auf ganze Tage gerundet.<br>- Liegen beide Daten auf demselben Tag oder gibt es keine Events, ist das Ergebnis 0.<br>- Das Ergebnis hängt ausschließlich von den beiden Eingabewerten ab. |
| **Verwendet von** | [AF-02](#af-02--statistik-aggregation) (Kennzahl *Zeitspanne*). |

### AF-02 — Statistik-Aggregation

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Verdichtet die Events einer Person zu Kennzahlen für die Statistik. |
| **Eingaben** | Menge der `EVENTS`-Datensätze der angemeldeten Person mit ihren Kategorien. |
| **Ausgaben** | Anzahl Events insgesamt; ältestes und jüngstes Datum; Zeitspanne in Tagen ([AF-01](#af-01--zeitspanne-berechnen)); je Kategorie mit mindestens einem Event: Name, Farbe, Anzahl und Mittelwert der `significance`. |
| **Regeln** | - Sind keine Events vorhanden, liefert die Funktion neutrale Werte (0, keine Kategorien) statt eines Fehlers.<br>- Berücksichtigt werden ausschließlich die Events der angemeldeten Person.<br>- Der Mittelwert der Bedeutung wird nur als **Tendenz** ausgewiesen, weil die Skala ordinal ist ([D2.2](D2-datentypenverzeichnis.md#d22-wertebereich-von-significance)).<br>- Ein aktiver Filter (AF-03) wirkt nicht auf die Statistik. |
| **Verwendet von** | [UC-06](F2-anwendungsfaelle.md#uc-06--statistik-berechnen) *Statistik berechnen*. |

### AF-03 — Timeline-Filterung

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Reduziert die bereits geladenen Events auf die Teilmenge, die zu einer ausgewählten Kategorie passt, ohne die Daten neu anzufordern. |
| **Eingaben** | Bereits geladene Events; ausgewählte Kategorie oder „kein Filter“. |
| **Ausgaben** | Gefilterte Teilmenge der Events. |
| **Regeln** | - Arbeitet ausschließlich auf den bereits geladenen Daten ([NFR-12a-02](N1-nichtfunktional.md)).<br>- Bei „kein Filter“ wird die vollständige Menge zurückgegeben.<br>- Eine leere Ergebnismenge ist ein regulärer Zustand, kein Fehler ([B1.4.4](B1-dialogspezifikation.md#b144-leere-zustände)). |
| **Verwendet von** | [UC-05](F2-anwendungsfaelle.md#uc-05--timeline-filtern) *Timeline filtern*, ausgelöst über die Filterleiste ([DLG-03](B1-dialogspezifikation.md#dlg-03--filterleiste)). |

### AF-04 — Timeline-Export

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Wandelt die aktuell dargestellte Timeline in eine PNG-Bilddatei um, die die Nutzer:in herunterladen kann. |
| **Eingaben** | Aktueller Darstellungszustand der Timeline (Übersicht oder Jahresansicht, Jahr, Zoom, ggf. aktiver Filter). |
| **Ausgaben** | PNG-Bilddatei `lifeline-timeline.png`. |
| **Regeln** | - Es werden keine Daten neu angefordert.<br>- Das Bild zeigt den Zustand zum Zeitpunkt des Exports, einschließlich eines aktiven Filters. |
| **Verwendet von** | [UC-04](F2-anwendungsfaelle.md#uc-04--timeline-ansehen), Aktion „Timeline als Bild exportieren“ in [DLG-01](B1-dialogspezifikation.md#dlg-01--timeline). |

### AF-05 — Kategorien beim Import zuordnen

| Abschnitt | Inhalt |
|---|---|
| **Zweck** | Die Kategorien in einer Sicherung stammen aus einem anderen Konto oder einem früheren Stand und haben dort andere Kennungen. Die Funktion bildet sie auf die Kategorien der angemeldeten Person ab, damit jedes importierte Event einer eigenen Kategorie zugeordnet wird. |
| **Eingaben** | Kategorien der Sicherung (Kennung, Name, Farbe); Kategorien der angemeldeten Person. |
| **Ausgaben** | Zuordnung *Kennung in der Sicherung → eigene Kategorie*. |
| **Regeln** | - Zuordnung über den Namen, ohne Unterschied von Groß-/Kleinschreibung und führenden/folgenden Leerzeichen.<br>- Gibt es keine Kategorie mit diesem Namen, wird sie mit der Farbe aus der Sicherung angelegt (UC-08).<br>- Verweist ein Event der Sicherung auf eine Kategorie, die in der Sicherung fehlt, wird der Import mit einer Meldung abgebrochen. |
| **Verwendet von** | [UC-10](F2-anwendungsfaelle.md#uc-10--sicherung-importieren) *Sicherung importieren*. |

---

## F3.3 Nicht Teil von F3

- **Registrierung und Login.** Reiner Interaktions- und Prüfschritt ohne eigenständige Berechnung — siehe [F2](F2-anwendungsfaelle.md) UC-07.
- **Event anlegen, bearbeiten, löschen.** Siehe [F2](F2-anwendungsfaelle.md) UC-01 bis UC-03.
- **Timeline ansehen (Laden und Anzeigen).** Siehe [F2](F2-anwendungsfaelle.md) UC-04.
- **Sicherung exportieren.** Die Datei enthält die geladenen Daten unverändert; es findet keine fachliche Transformation statt — siehe [F2](F2-anwendungsfaelle.md) UC-09.
- **Eingabevalidierung.** Querschnittskonzept — siehe [N2.2](N2-querschnittskonzepte.md#n22-validierung), Wertebereiche in [D2](D2-datentypenverzeichnis.md).
- **Persistenzoperationen.** Implementierungsdetails — siehe [A05](../arch/A05-Bausteinansicht.md).

---

## F3.4 Querverweise

| Baustein | Bezug zu F3 |
|---|---|
| F1 | Entfällt nach Abstimmung mit dem Betreuer. |
| [F2](F2-anwendungsfaelle.md) | UC-04 nutzt AF-04; UC-05 nutzt AF-03; UC-06 nutzt AF-01 und AF-02; UC-10 nutzt AF-05. |
| [D1](D1-datenmodell.md) | AF-01 und AF-02 rechnen auf den Attributen von `EVENTS` (`date`, `category_id`, `significance`); AF-05 arbeitet auf `CATEGORIES.label`. |
| [D2](D2-datentypenverzeichnis.md) | Der Wertebereich von `significance` bestimmt die Aggregation in AF-02. |
| [B1](B1-dialogspezifikation.md) | AF-03 wirkt in DLG-03, AF-02 in DLG-04, AF-04 in DLG-01. |
| [A05](../arch/A05-Bausteinansicht.md) | AF-01 und AF-02 laufen in `routes/stats`, AF-03 bis AF-05 im Frontend (`App`). |
