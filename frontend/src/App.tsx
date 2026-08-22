import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import Header from './components/Header'
import Timeline from './components/Timeline'
import CategoryFilter from './components/CategoryFilter'
import EventCard from './components/EventCard'
import EventFormModal from './components/EventFormModal'
import { useLocalStorage } from './hooks/useLocalStorage'
import { sampleEvents } from './data/sampleEvents'
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
  const [events, setEvents] = useLocalStorage<LifeEvent[]>(
    'lifeline:events',
    sampleEvents,
  )

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

  const handleSave = (event: LifeEvent) => {
    setEvents((previousEvents) => {
      const exists = previousEvents.some(
        (existingEvent) => existingEvent.id === event.id,
      )

      return exists
        ? previousEvents.map((existingEvent) =>
            existingEvent.id === event.id ? event : existingEvent,
          )
        : [...previousEvents, event]
    })

    setModalEvent(undefined)
  }

  const handleDelete = (id: string) => {
    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== id),
    )
  }

  const handleClearAll = () => {
    if (
      confirm(
        'Wirklich alle Ereignisse unwiderruflich löschen?',
      )
    ) {
      setEvents([])
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
        <div
          ref={timelineRef}
          className="rounded-xl border border-white/8 bg-ink-900/40 p-4"
        >
          <Timeline
            events={filtered}
            onSelect={setModalEvent}
          />
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

        {filtered.length > 0 ? (
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
          Hinweis: Alle Daten werden lokal im Speicher deines Browsers
          abgelegt.
        </p>
      </main>

      {modalEvent !== undefined && (
        <EventFormModal
          initial={modalEvent}
          onSave={handleSave}
          onClose={() => setModalEvent(undefined)}
        />
      )}
    </div>
  )
}
