# F2 – Anwendungsfälle

F2 beschreibt die Interaktionen zwischen Nutzer:in und Lifeline. Anwendungsfälle im Sinne von Siedersleben (Kap. 4.4) sind konkrete Interaktionsszenarien, die jeweils ein für die Nutzer:in bedeutsames Ziel verfolgen und in einem stabilen Endzustand münden.

Rein systeminterne Berechnungen und Verarbeitungen (z. B. Statistik-Aggregation oder Filterung) sind keine Anwendungsfälle; sie werden als Anwendungsfunktionen in [F3](F3-anwendungsfunktionen.md) beschrieben. F2 beschreibt fachlich, *was* geschieht; welche Bausteine den Ablauf technisch umsetzen, steht in [A05](../arch/A05-Bausteinansicht.md#53-rückverfolgbarkeit-anwendungsfall--baustein) und [A06](../arch/A06-Laufzeitansicht.md).

Jeder Anwendungsfall wird mit derselben tabellarischen Vorlage beschrieben. Die Zeile **Qualitäten** verweist auf die nichtfunktionalen Anforderungen aus [N1](N1-nichtfunktional.md), die für den Anwendungsfall gelten und mit denen er abgenommen wird. Die Nummerierung ist stabil; ein einmal referenzierter UC wird nicht umnummeriert.

---

## F2.1 Anwendungsfall-Übersicht

| ID | Anwendungsfall | Akteur | Gruppe | Einstufung ([P1.4.1](P1-ziele-rahmenbedingungen.md#p141-zuordnung-der-anwendungsfälle)) |
|---|---|---|---|---|
| UC-07 | Registrieren und Login | Nutzer:in | Zugang | Muss |
| UC-01 | Event anlegen | Nutzer:in | Event-Verwaltung | Muss |
| UC-02 | Event bearbeiten | Nutzer:in | Event-Verwaltung | Muss |
| UC-03 | Event löschen | Nutzer:in | Event-Verwaltung | Muss |
| UC-04 | Timeline ansehen | Nutzer:in | Event-Verwaltung | Muss |
| UC-08 | Kategorie anlegen | Nutzer:in | Event-Verwaltung | Muss |
| UC-05 | Timeline filtern | Nutzer:in | Auswertung | Muss |
| UC-06 | Statistik berechnen | Nutzer:in | Auswertung | Erweiterung |
| UC-09 | Sicherung exportieren | Nutzer:in | Sicherung | Erweiterung |
| UC-10 | Sicherung importieren | Nutzer:in | Sicherung | Erweiterung |

![F2 Anwendungsfalldiagramm – Lifeline](diagrams-png/f2-use-cases.png)

Quelltext des Diagramms: [`diagrams/f2-use-cases.plantuml`](diagrams/f2-use-cases.plantuml).

Das Diagramm zeigt vier Gruppen: *Zugang* (UC-07, ohne bestehende Session erreichbar), *Event-Verwaltung* (Anlegen, Bearbeiten, Löschen und Ansehen eigener Events sowie das Anlegen eigener Kategorien), *Auswertung* (UC-05, UC-06 auf den bereits gespeicherten Events) und *Sicherung* (UC-09, UC-10). Die `<<precedes>>`-Beziehungen von UC-01 bis UC-03 zu UC-04 markieren, dass jede Änderung an einem Event zu einer aktualisierten Timeline führt; die `<<extend>>`-Beziehung von UC-05 zu UC-04 zeigt, dass Filtern eine optionale Erweiterung der Timeline-Ansicht ist. UC-10 schließt UC-08 ein, weil beim Import fehlende Kategorien angelegt werden. Die Notiz fasst zusammen, dass alle Anwendungsfälle außer UC-07 eine bestehende Session voraussetzen ([N2.3](N2-querschnittskonzepte.md#n23-authentifizierung-und-session)).

---

## F2.2 Zugang

### UC-07 – Registrieren und Login

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-07 |
| **Name** | Registrieren und Login |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in legt ein Konto an, meldet sich mit bestehenden Zugangsdaten an oder meldet sich ab. |
| **Trigger** | Die Nutzer:in möchte Lifeline nutzen bzw. die Nutzung beenden. |
| **Vorbedingung** | Lifeline ist erreichbar. Für das Abmelden: bestehende Session. |
| **Nachbedingung** | Nach Registrierung oder Anmeldung besteht eine Session und die Timeline wird angezeigt; nach der Registrierung stehen die sechs Startkategorien zur Verfügung. Nach dem Abmelden besteht keine Session mehr. |
| **Qualitäten** | [NFR-15b-02](N1-nichtfunktional.md) (Passwörter nie im Klartext); [NFR-15a-01](N1-nichtfunktional.md) (danach Zugriff nur auf eigene Daten); [NFR-15c-01](N1-nichtfunktional.md) (nur E-Mail und Passwort werden erhoben). |

#### Hauptablauf – Registrierung

1. Die Nutzer:in öffnet das Registrierungsformular.
2. Die Nutzer:in gibt E-Mail-Adresse, Passwort und Passwortbestätigung ein.
3. Lifeline prüft, dass die Passwörter übereinstimmen und die Eingaben gültig sind.
4. Lifeline legt das Konto mit den Startkategorien an.
5. Lifeline meldet die Nutzer:in an und zeigt die (leere) Timeline.

#### Hauptablauf – Login

1. Die Nutzer:in öffnet das Anmeldeformular.
2. Die Nutzer:in gibt E-Mail und Passwort ein.
3. Lifeline prüft die Zugangsdaten.
4. Bei korrekten Zugangsdaten wird eine Session eingerichtet und die Timeline angezeigt.

#### Alternativablauf – Abmelden

1. Die Nutzer:in wählt im Anwendungsrahmen „Abmelden“.
2. Lifeline beendet die Session und zeigt das Anmeldeformular.

#### Ausnahmefälle

- Ungültige Zugangsdaten: Die Anmeldung wird abgelehnt; die Meldung verrät nicht, ob die Adresse unbekannt oder das Passwort falsch ist.
- Fehlende oder ungültige Eingaben (z. B. Passwort kürzer als 8 Zeichen, Passwörter stimmen nicht überein): Fehlermeldung, kein Konto.
- Die E-Mail-Adresse ist bereits registriert (auch in anderer Groß-/Kleinschreibung): kein zweites Konto (`INV-U1`).
- Die Session ist abgelaufen, z. B. nach einem Neustart der Anwendung: Lifeline führt beim nächsten Zugriff zum Anmeldeformular zurück; die gespeicherten Daten bleiben erhalten.

---

## F2.3 Event-Verwaltung

### UC-01 – Event anlegen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-01 |
| **Name** | Event anlegen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in legt ein neues Event an und fügt es der persönlichen Timeline hinzu. |
| **Trigger** | Die Nutzer:in möchte ein neues Event erfassen. |
| **Vorbedingung** | Bestehende Session (UC-07). |
| **Nachbedingung** | Das Event ist gespeichert und erscheint in der Timeline und in der Statistik. |
| **Qualitäten** | [NFR-11a-01](N1-nichtfunktional.md) (Erfassen ohne Anleitung); [NFR-12d-01](N1-nichtfunktional.md) (dauerhaft gespeichert); [NFR-12d-02](N1-nichtfunktional.md) (keine Teilzustände); [NFR-15b-04](N1-nichtfunktional.md) (Prüfung hochgeladener Bilder). |

#### Hauptablauf

1. Die Nutzer:in öffnet das Formular zum Anlegen eines Events.
2. Die Nutzer:in gibt Titel und Datum ein, wählt eine Kategorie und die Bedeutung und ergänzt optional Uhrzeit, Beschreibung und ein Bild.
3. Die Nutzer:in speichert.
4. Lifeline prüft die Eingaben ([N2.2](N2-querschnittskonzepte.md#n22-validierung)) und das Bild ([D2.3](D2-datentypenverzeichnis.md#d23-bild-image_path)).
5. Lifeline speichert das Event.
6. Die Timeline wird aktualisiert (UC-04).

#### Ausnahmefälle

- Ungültige Eingaben: Das Event wird nicht gespeichert, die Meldung erscheint am betroffenen Feld bzw. im Formular; alle Eingaben bleiben erhalten.
- Ungültiges Bild (falsches Format, größer als 5 MB, Inhalt passt nicht zum Format): Das Bild wird abgewiesen; das Event wird erst gespeichert, wenn das Bild entfernt oder ersetzt wurde.
- Die Nutzer:in bricht nach Eingaben ab: Rückfrage, ob die Eingaben verworfen werden sollen.

---

### UC-02 – Event bearbeiten

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-02 |
| **Name** | Event bearbeiten |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in verändert die Angaben eines bestehenden Events. |
| **Trigger** | Die Nutzer:in möchte ein bestehendes Event ändern. |
| **Vorbedingung** | Bestehende Session; das Event existiert und gehört der Nutzer:in. |
| **Nachbedingung** | Die Änderungen sind gespeichert und in der Timeline sichtbar. |
| **Qualitäten** | [NFR-15a-02](N1-nichtfunktional.md) (Besitzprüfung bei jeder Operation); [NFR-12d-02](N1-nichtfunktional.md) (keine Teilzustände, auch beim Ersetzen eines Bildes). |

#### Hauptablauf

1. Die Nutzer:in wählt ein Event in der Timeline oder in der Event-Liste aus (UC-04).
2. Lifeline zeigt das Formular mit den vorhandenen Angaben.
3. Die Nutzer:in ändert die gewünschten Angaben, ersetzt oder entfernt ggf. das Bild.
4. Die Nutzer:in speichert.
5. Lifeline prüft die Eingaben und speichert die Änderungen.
6. Die Timeline wird aktualisiert (UC-04).

#### Ausnahmefälle

- Ungültige Eingaben: Die Änderungen werden nicht gespeichert; Meldung wie in UC-01.
- Das Event existiert nicht (mehr) oder gehört einer anderen Person: Abweisung ohne Unterscheidung der beiden Fälle ([NFR-15a-01](N1-nichtfunktional.md)).

---

### UC-03 – Event löschen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-03 |
| **Name** | Event löschen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in entfernt ein Event oder alle eigenen Events. |
| **Trigger** | Die Nutzer:in möchte ein Event bzw. den gesamten Bestand entfernen. |
| **Vorbedingung** | Bestehende Session; das Event existiert und gehört der Nutzer:in. |
| **Nachbedingung** | Das Event und sein Bild sind gelöscht und nicht mehr in der Timeline sichtbar. |
| **Qualitäten** | [NFR-15a-02](N1-nichtfunktional.md) (Besitzprüfung); [NFR-17a-01](N1-nichtfunktional.md) (eigene Inhalte löschen können). |

#### Hauptablauf

1. Die Nutzer:in wählt bei einem Event „Löschen“.
2. Lifeline fragt nach, ob das Event wirklich gelöscht werden soll ([B1.4.3](B1-dialogspezifikation.md#b143-bestätigung-zerstörerischer-aktionen)).
3. Die Nutzer:in bestätigt.
4. Lifeline löscht das Event und sein Bild.
5. Die Timeline wird aktualisiert (UC-04).

#### Alternativablauf – Alle Events löschen

1. Die Nutzer:in wählt im Menü des Anwendungsrahmens „Alle Ereignisse löschen“.
2. Lifeline fragt nach, ob wirklich alle Events unwiderruflich gelöscht werden sollen.
3. Nach Bestätigung löscht Lifeline alle eigenen Events; die Kategorien bleiben erhalten.

#### Ausnahmefälle

- Die Nutzer:in bestätigt nicht: Es wird nichts gelöscht.
- Das Event existiert nicht (mehr) oder gehört einer anderen Person: Abweisung ohne Unterscheidung der beiden Fälle.

---

### UC-04 – Timeline ansehen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-04 |
| **Name** | Timeline ansehen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in betrachtet die eigenen Events in chronologischer Darstellung. |
| **Trigger** | Die Nutzer:in öffnet Lifeline bzw. kehrt zur Timeline zurück. |
| **Vorbedingung** | Bestehende Session. |
| **Nachbedingung** | Die eigenen Events sind chronologisch dargestellt; für das angezeigte Jahr sind, sofern verfügbar, die Feiertage markiert. |
| **Qualitäten** | [NFR-12a-01](N1-nichtfunktional.md) (200 Events in unter 2 s); [NFR-12c-01](N1-nichtfunktional.md) (korrekte Reihenfolge); [NFR-10a-01](N1-nichtfunktional.md) (Desktop und Smartphone); [NFR-11d-01](N1-nichtfunktional.md) (Kategorie nicht nur über Farbe). |

#### Hauptablauf

1. Die Nutzer:in öffnet die Timeline.
2. Lifeline lädt die eigenen Events und Kategorien.
3. Lifeline stellt die Events chronologisch dar: in der Übersicht über alle Jahre oder in der Jahresansicht.
4. Unabhängig davon ermittelt Lifeline die Feiertage des angezeigten Jahres über den Feiertagsdienst ([S1.3](S1-nachbarsysteme.md#s13-nb-02--feiertagsdienst)) und markiert sie in der Jahresansicht. Dieser Schritt blockiert die Darstellung nicht; sein Ausfall wird nicht gemeldet ([S1.3.2](S1-nachbarsysteme.md#s132-bindende-regel-fehlerverhalten)).

#### Alternativabläufe

- Die Nutzer:in wechselt zwischen Übersicht und Jahresansicht, wählt ein anderes Jahr, verschiebt den sichtbaren Bereich oder ändert den Zoom.
- Die Nutzer:in filtert die dargestellten Events (UC-05).
- Die Nutzer:in wählt ein Event zur Bearbeitung oder Löschung aus (UC-02, UC-03).
- Die Nutzer:in lädt die aktuelle Darstellung als PNG-Bild herunter ([AF-04](F3-anwendungsfunktionen.md#af-04--timeline-export)).

#### Ausnahmefälle

- Keine Events vorhanden: Lifeline zeigt einen leeren Zustand mit direktem Weg zum Anlegen.
- Fehler beim Laden: Meldung mit der Möglichkeit, erneut zu laden.

---

### UC-08 – Kategorie anlegen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-08 |
| **Name** | Kategorie anlegen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in legt eine eigene Kategorie an, um Events flexibler einordnen zu können. |
| **Trigger** | Die Nutzer:in möchte eine zusätzliche Kategorie zur Verfügung haben. |
| **Vorbedingung** | Bestehende Session (UC-07). |
| **Nachbedingung** | Die neue Kategorie ist gespeichert und steht sofort in der Filterleiste (UC-05) und im Event-Formular (UC-01, UC-02) zur Auswahl. |
| **Qualitäten** | [NFR-14c-01](N1-nichtfunktional.md) (Erweiterbarkeit zur Laufzeit ohne Codeänderung). |

#### Hauptablauf

1. Die Nutzer:in wählt in der Filterleiste „Neue Kategorie“ ([DLG-06](B1-dialogspezifikation.md#dlg-06--kategorieverwaltung)).
2. Die Nutzer:in gibt einen Anzeigenamen ein und übernimmt oder ändert die vorgeschlagene Farbe.
3. Die Nutzer:in speichert.
4. Lifeline prüft die Eingaben und legt die Kategorie an.
5. Die neue Kategorie ist sofort auswählbar.

#### Ausnahmefälle

- Der Anzeigename ist leer oder länger als 40 Zeichen, oder die Farbe ist kein gültiger Farbcode: keine Kategorie, Fehlermeldung.
- Die Person hat bereits eine Kategorie mit diesem Namen: keine zweite Kategorie, Fehlermeldung (`INV-C1`).

---

## F2.4 Auswertung

### UC-05 – Timeline filtern

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-05 |
| **Name** | Timeline filtern |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in schränkt die dargestellten Events auf eine Kategorie ein. |
| **Trigger** | Die Nutzer:in möchte nur Events einer bestimmten Kategorie sehen. |
| **Vorbedingung** | Die Events sind geladen und werden angezeigt (UC-04). |
| **Nachbedingung** | Timeline und Event-Liste zeigen nur die Events der gewählten Kategorie. |
| **Qualitäten** | [NFR-12a-02](N1-nichtfunktional.md) (Wirkung ohne Nachladen); [NFR-11d-01](N1-nichtfunktional.md) (Kategorie als Text erkennbar). |

#### Hauptablauf

1. Die Nutzer:in wählt in der Filterleiste eine Kategorie.
2. Lifeline reduziert die bereits geladenen Events auf diese Kategorie ([AF-03](F3-anwendungsfunktionen.md#af-03--timeline-filterung)).
3. Timeline und Event-Liste werden aktualisiert.

#### Alternativabläufe

- Die Nutzer:in wählt „Alle“ und hebt den Filter auf.

#### Ausnahmefälle

- Keine passenden Events: Lifeline zeigt einen leeren Zustand mit dem Hinweis, dass ein Filter aktiv ist, und bietet an, ihn aufzuheben. Das ist kein Fehler.

---

### UC-06 – Statistik berechnen

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-06 |
| **Name** | Statistik berechnen |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in erhält eine verdichtete Übersicht über den eigenen Bestand. |
| **Trigger** | Die Nutzer:in öffnet die Timeline; die Statistik wird darunter angezeigt und nach jeder Änderung aktualisiert. |
| **Vorbedingung** | Bestehende Session. |
| **Nachbedingung** | Die Kennzahlen aus [AF-02](F3-anwendungsfunktionen.md#af-02--statistik-aggregation) werden angezeigt. |
| **Qualitäten** | [NFR-15a-01](N1-nichtfunktional.md) (nur eigene Events fließen ein). |

#### Hauptablauf

1. Lifeline ermittelt für die eigenen Events die Kennzahlen: Anzahl insgesamt, Zeitspanne vom ältesten bis zum jüngsten Event ([AF-01](F3-anwendungsfunktionen.md#af-01--zeitspanne-berechnen)), Anzahl und Tendenz der Bedeutung je Kategorie ([AF-02](F3-anwendungsfunktionen.md#af-02--statistik-aggregation)).
2. Lifeline zeigt die Kennzahlen an.

#### Ausnahmefälle

- Keine Events vorhanden: neutrale Werte (0), kein Fehler.
- Ein Filter ist aktiv: Die Statistik betrachtet trotzdem den vollständigen Bestand; ein Hinweis macht das kenntlich.
- Fehler beim Ermitteln: Die Statistik wird nicht angezeigt; die Timeline bleibt nutzbar.

---

## F2.5 Sicherung

### UC-09 – Sicherung exportieren

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-09 |
| **Name** | Sicherung exportieren |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in lädt ihre Kategorien und Events als Sicherungsdatei herunter. |
| **Trigger** | Die Nutzer:in möchte eine Kopie ihrer Daten behalten oder auf ein anderes Konto übertragen. |
| **Vorbedingung** | Bestehende Session. |
| **Nachbedingung** | Die Nutzer:in hat eine JSON-Datei mit ihren Kategorien (Name, Farbe) und Events; der Bestand in Lifeline ist unverändert. |
| **Qualitäten** | [NFR-17a-01](N1-nichtfunktional.md) (eigene Inhalte einsehen). |

#### Hauptablauf

1. Die Nutzer:in wählt im Menü „Daten exportieren“.
2. Lifeline erzeugt die Sicherungsdatei aus den geladenen Daten und bietet sie zum Herunterladen an.

#### Ausnahmefälle

- Keine.

---

### UC-10 – Sicherung importieren

| Merkmal | Beschreibung |
|---|---|
| **Identifier** | UC-10 |
| **Name** | Sicherung importieren |
| **Akteur** | Nutzer:in |
| **Beschreibung** | Die Nutzer:in übernimmt die Events einer zuvor exportierten Sicherung zusätzlich zum vorhandenen Bestand. |
| **Trigger** | Die Nutzer:in möchte Daten aus einer Sicherung wiederherstellen oder übertragen. |
| **Vorbedingung** | Bestehende Session; eine mit UC-09 erzeugte Sicherungsdatei. |
| **Nachbedingung** | Die Events der Sicherung sind zusätzlich zum vorhandenen Bestand gespeichert; fehlende Kategorien sind angelegt. |
| **Qualitäten** | [NFR-11c-01](N1-nichtfunktional.md) (verständliche Rückmeldung über Erfolg und Fehler). |

#### Hauptablauf

1. Die Nutzer:in wählt im Menü „Daten importieren“ und eine Sicherungsdatei.
2. Lifeline prüft die Datei und fragt nach, ob die enthaltenen Events zusätzlich importiert werden sollen.
3. Nach Bestätigung ordnet Lifeline jede Kategorie der Sicherung über ihren Namen einer vorhandenen Kategorie zu oder legt sie neu an (UC-08).
4. Lifeline legt jedes Event neu an (wie UC-01), einschließlich seines Bildes, sofern es noch abrufbar ist.
5. Lifeline meldet, wie viele Events importiert wurden, und aktualisiert Timeline und Statistik.

#### Ausnahmefälle

- Die Datei ist keine gültige Sicherung: kein Import, Fehlermeldung.
- Die Sicherung enthält keine Events: Hinweis, kein Import.
- Einzelne Events lassen sich nicht anlegen: Die übrigen werden importiert; die Meldung nennt die Anzahl der fehlgeschlagenen Events.
- Die Nutzer:in bestätigt nicht: kein Import.

Der Import legt Events immer zusätzlich an. Wird dieselbe Sicherung zweimal importiert, entstehen Duplikate; eine Duplikaterkennung ist nicht vorgesehen.

---

## F2.6 Nicht Teil von F2

- **Statistik-Aggregation, Filter-Berechnung, Zeitspanne, PNG-Export.** Systeminterne Algorithmen ohne eigenen Entscheidungspunkt der Nutzer:in – siehe [F3](F3-anwendungsfunktionen.md).
- **Eingabevalidierung.** Querschnittskonzept – siehe [N2.2](N2-querschnittskonzepte.md#n22-validierung).
- **Persistenz und technische Abläufe.** Siehe [A05](../arch/A05-Bausteinansicht.md) und [A06](../arch/A06-Laufzeitansicht.md).
- **Umbenennen, Umfärben und Löschen von Kategorien.** Nicht Teil des Funktionsumfangs ([OP-06](../OFFENE-PUNKTE.md)).

## F2.7 Querverweise

| Baustein | Bezug zu F2 |
|---|---|
| F1 | Entfällt nach Abstimmung mit dem Betreuer; die fachlichen Abläufe werden direkt in diesem Baustein F2 beschrieben. |
| [P1](P1-ziele-rahmenbedingungen.md) | P1.4.1 stuft jeden Anwendungsfall als Muss oder Erweiterung ein. |
| [F3](F3-anwendungsfunktionen.md) | UC-06 nutzt AF-01 und AF-02, UC-05 nutzt AF-03, UC-04 nutzt AF-04. |
| [D1](D1-datenmodell.md) | `USERS`, `CATEGORIES` und `EVENTS` werden von den UCs gelesen bzw. geschrieben; nur UC-03 löscht Events. |
| [B1](B1-dialogspezifikation.md) | Bildschirmgestaltung und Dialogablauf je UC (Zuordnung in B1.1). |
| [N1](N1-nichtfunktional.md) | Die Zeile *Qualitäten* je UC verweist auf die geltenden Anforderungen. |
| [N2](N2-querschnittskonzepte.md) | N2.3 *Authentifizierung und Session* ist Voraussetzung für jeden UC außer UC-07. |
| [S1](S1-nachbarsysteme.md) | UC-04 Schritt 4 nutzt S1.3 (Feiertagsdienst), nicht-blockierend. |
| [A05](../arch/A05-Bausteinansicht.md) | Kapitel 5.3 ordnet jedem UC die umsetzenden Bausteine zu. |
