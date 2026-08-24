import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import Header from './components/Header'
import Timeline from './components/Timeline'
import CategoryFilter from './components/CategoryFilter'
import EventCard from './components/EventCard'
import EventFormModal from './components/EventFormModal'
import {
  createEvent,
  deleteEvent as deleteEventOnServer,
  ensureSession,
  fetchEvents,
  updateEvent as updateEventOnServer,
} from './api/client'
import type { CategoryId, LifeEvent } from './types'

interface LifelineBackup {
  version: 1
  exportedAt: string
  events: LifeEvent[]
}

const isLifeEvent = (value: unknown): value is LifeEvent => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const event = value as Partial<LifeEvent>

  const categories: CategoryId[] = [
    'meilenstein',
    'karriere',
    'bildung',
    'beziehung',
    'reise',
    'gesundheit',
    'sonstiges',
  ]

    return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.description === 'string' &&
    typeof event.date === 'string' &&
    typeof event.significance === 'number' &&
    categories.includes(event.category as CategoryId)
  )
}

export default function App() {
  // Einträge kommen jetzt vom Backend (SQLite), nicht mehr aus dem
  // localStorage des Browsers. Beim Start wird einmal geladen (siehe
  // useEffect unten); jede Änderung (Speichern/Löschen) geht sofort ans
  // Backend, die Anzeige wird danach mit der Antwort des Servers
  // aktualisiert.
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadFromBackend() {
      try {
        // Übergangslösung: automatische Demo-Anmeldung, siehe api/client.ts.
        // Es gibt noch keine echte Login-Seite im Frontend.
        await ensureSession()
        const loaded = await fetchEvents()
        if (!cancelled) {
          setEvents(loaded)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Verbindung zum Backend fehlgeschlagen. Läuft der Server (npm run dev im backend/-Ordner)?',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadFromBackend()

    return () => {
      cancelled = true
    }
  }, [])

  const [filter, setFilter] = useState<CategoryId | 'alle'>('alle')
  const [modalEvent, setModalEvent] = useState<
    LifeEvent | null | undefined
  >(undefined)

  const timelineRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () =>
      filter === 'alle'
        ? events
        : events.filter((event) => event.category === filter),
    [events, filter],
  )

  const handleSave = async (event: LifeEvent) => {
    const exists = events.some(
      (existingEvent) => existingEvent.id === event.id,
    )

    try {
      const saved = exists
        ? await updateEventOnServer(event)
        : await createEvent(event)

      setEvents((previousEvents) =>
        exists
          ? previousEvents.map((existingEvent) =>
              existingEvent.id === saved.id ? saved : existingEvent,
            )
          : [...previousEvents, saved],
      )

      setModalEvent(undefined)
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Ereignis konnte nicht gespeichert werden.',
      )
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEventOnServer(id)
      setEvents((previousEvents) =>
        previousEvents.filter((event) => event.id !== id),
      )
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Ereignis konnte nicht gelöscht werden.',
      )
    }
  }

  const handleClearAll = async () => {
    if (
      confirm(
        'Wirklich alle Ereignisse unwiderruflich löschen?',
      )
    ) {
      try {
        await Promise.all(events.map((event) => deleteEventOnServer(event.id)))
        setEvents([])
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : 'Ereignisse konnten nicht vollständig gelöscht werden.',
        )
      }
    }
  }

  const handleImageExport = async () => {
    if (!timelineRef.current) {
      return
    }

    const canvas = await html2canvas(timelineRef.current, {
      backgroundColor: '#0a0c10',
      scale: 2,
    })

    const link = document.createElement('a')
    link.download = 'lifeline-timeline.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleDataExport = () => {
    const backup: LifelineBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      events,
    }

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: 'application/json',
      },
    )

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.download =
      `lifeline-sicherung-${new Date().toISOString().slice(0, 10)}.json`
    link.href = url
    link.click()

    URL.revokeObjectURL(url)
  }

  // Hinweis für's Team: Der Import ersetzt aktuell nur die lokale Anzeige,
  // schreibt die importierten Einträge aber noch NICHT ins Backend — nach
  // einem Neuladen der Seite sind sie wieder weg, weil dann erneut vom
  // Server geladen wird. Für einen echten Import müssten die Einträge
  // hier per createEvent() einzeln ans Backend geschickt werden. Bewusst
  // nicht mit umgebaut, um den Eingriff klein zu halten.
  const handleDataImport = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text())

      const importedEvents = Array.isArray(parsed)
        ? parsed
        : (parsed as Partial<LifelineBackup>)?.events

      if (
        !Array.isArray(importedEvents) ||
        !importedEvents.every(isLifeEvent)
      ) {
        throw new Error('Ungültiges Sicherungsformat')
      }

      const shouldReplace = confirm(
        `Die Sicherung enthält ${importedEvents.length} Ereignis${
          importedEvents.length === 1 ? '' : 'se'
        }. Aktuelle Daten ersetzen?`,
      )

      if (shouldReplace) {
        setEvents(importedEvents)
        setFilter('alle')
      }
    } catch {
      alert(
        'Die Datei konnte nicht importiert werden. Bitte wähle eine Lifeline-Sicherung aus.',
      )
    }
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Header
        onAdd={() => setModalEvent(null)}
        onExport={handleImageExport}
        onDataExport={handleDataExport}
        onDataImport={handleDataImport}
        onClear={handleClearAll}
        eventCount={events.length}
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <div ref={timelineRef} className="w-full">
      <Timeline events={filtered} onSelect={setModalEvent} />
      </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-medium text-slate-100">
            Lebens-Ereignisse
          </h2>

          <CategoryFilter
            active={filter}
            onChange={setFilter}
          />
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-500">Lade Ereignisse …</p>
        ) : loadError ? (
          <p className="mt-6 text-sm text-red-400">{loadError}</p>
        ) : filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...filtered]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={setModalEvent}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-500">
            Keine Ereignisse in dieser Kategorie.
          </p>
        )}

        <p className="mt-10 text-center font-mono text-[11px] text-slate-600">
          Hinweis: Alle Daten werden im Backend gespeichert (SQLite).
        </p>
      </main>

    { modalEvent !== undefined && (
      <EventFormModal
        initial={modalEvent}
        onSave={handleSave}
        onClose={() => setModalEvent(undefined)}
      />
    )
}
    </div >
  )
}
