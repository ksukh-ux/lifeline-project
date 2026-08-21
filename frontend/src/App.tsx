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

export default function App() {
  const [events, setEvents] = useLocalStorage<LifeEvent[]>('lifeline:events', sampleEvents)
  const [filter, setFilter] = useState<CategoryId | 'alle'>('alle')
  const [modalEvent, setModalEvent] = useState<LifeEvent | null | undefined>(undefined)
  const timelineRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => (filter === 'alle' ? events : events.filter((e) => e.category === filter)),
    [events, filter],
  )

  const handleSave = (event: LifeEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === event.id)
      return exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event]
    })
    setModalEvent(undefined)
  }

  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const handleClearAll = () => {
    if (confirm('Wirklich alle Ereignisse unwiderruflich löschen?')) {
      setEvents([])
    }
  }

  const handleExport = async () => {
    if (!timelineRef.current) return
    const canvas = await html2canvas(timelineRef.current, {
      backgroundColor: '#0a0c10',
      scale: 2,
    })
    const link = document.createElement('a')
    link.download = 'lifeline-timeline.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Header
        onAdd={() => setModalEvent(null)}
        onExport={handleExport}
        onClear={handleClearAll}
        eventCount={events.length}
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <div ref={timelineRef} className="w-full">
      <Timeline events={filtered} onSelect={setModalEvent} />
      </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-medium text-slate-100">Lebens-Ereignisse</h2>
          <CategoryFilter active={filter} onChange={setFilter} />
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
          Hinweis: Alle Daten werden lokal im Speicher deines Browsers abgelegt.
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
