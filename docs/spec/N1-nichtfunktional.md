# N1 – Nichtfunktionale Anforderungen

Die nichtfunktionalen Anforderungen beschreiben die Qualitätsanforderungen an die Lifeline-Anwendung. Sie basieren auf den in der Architektur definierten Qualitätszielen und Qualitätsszenarien aus A01 und A10.

## N1.1 Benutzbarkeit

| ID | Anforderung | Priorität |
|---|---|---|
| NFA-01 | Das Anlegen eines Events soll ohne zusätzliche Anleitung verständlich und durchführbar sein. | Hoch |

**Messkriterium:** Eine neue Nutzer:in soll ein Event innerhalb von weniger als 2 Minuten anlegen können.

## N1.2 Nachvollziehbarkeit und Korrektheit

| ID | Anforderung | Priorität |
|---|---|---|
| NFA-02 | Das System soll ungültige Event-Daten erkennen und die Speicherung verhindern. | Hoch |

**Messkriterium:** Wird ein Event mit einem Enddatum vor dem Startdatum übermittelt, lehnt der Server die Eingabe ab und gibt eine verständliche Fehlermeldung zurück.

## N1.3 Erweiterbarkeit

| ID | Anforderung | Priorität |
|---|---|---|
| NFA-03 | Neue Event-Kategorien sollen ohne Änderungen an der zentralen Kernlogik ergänzt werden können. | Hoch |

**Messkriterium:** Eine neue Event-Kategorie soll innerhalb von weniger als 30 Minuten und mit Änderungen an weniger als 3 Dateien ergänzt werden können.

## N1.4 Sicherheit

| ID | Anforderung | Priorität |
|---|---|---|
| NFA-04 | Nutzer:innen dürfen nur auf die für sie vorgesehenen Daten zugreifen. | Mittel |

**Messkriterium:** Der direkte Zugriff einer Nutzer:in auf ein Event einer anderen Nutzer:in über dessen ID wird mit HTTP 403 abgelehnt.

## N1.5 Performance

| ID | Anforderung | Priorität |
|---|---|---|
| NFA-05 | Die Timeline soll auch bei einer größeren Anzahl von Events ohne spürbare Verzögerung dargestellt werden. | Mittel |

**Messkriterium:** Die Timeline eines Nutzers mit 200 Events soll innerhalb von weniger als 2 Sekunden geladen werden.