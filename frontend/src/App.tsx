import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import Header from './components/Header'
import Timeline from './components/Timeline'
import CategoryFilter from './components/CategoryFilter'
import EventCard from './components/EventCard'
import EventFormModal from './components/EventFormModal'
import AuthForms from './components/AuthForms'
import {
  createCategory,
  createEvent,
  deleteEvent as deleteEventOnServer,
  fetchCategories,
  fetchEvents,
  fetchHolidays,
  getCurrentUser,
  logout as logoutOnServer,
  updateEvent as updateEventOnServer,
  type AuthUser,
} from './api/client'
import type { Category, Holiday, LifeEvent } from './types'

interface LifelineBackup {
  version: 1
  exportedAt: string
  events: LifeEvent[]
}

const isLifeEvent = (
  value: unknown,
  validCategoryIds: number[],
): value is LifeEvent => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const event = value as Partial<LifeEvent>

  return (
    typeof event.id === 'string' &&
    typeof event.title === 'string' &&
    typeof event.description === 'string' &&
    typeof event.date === 'string' &&
    typeof event.significance === 'number' &&
    typeof event.category === 'number' &&
    validCategoryIds.includes(event.category)
  )
}

export default function App() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [filter, setFilter] = useState<number | 'alle'>('alle')

  const [modalEvent, setModalEvent] = useState<
    LifeEvent | null | undefined
  >(undefined)

  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (events.length === 0) {
      setHolidays([])
      return
    }

    let cancelled = false

    const years = [
      ...new Set(
        events.map((event) => new Date(event.date).getFullYear()),
      ),
    ]

    Promise.all(years.map((year) => fetchHolidays(year))).then(
      (results) => {
        if (cancelled) {
          return
        }

        setHolidays(results.flat())
      },
    )

    return () => {
      cancelled = true
    }
  }, [events])

  const loadEvents = async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const [loadedCategories, loadedEvents] = await Promise.all([
        fetchCategories(),
        fetchEvents(),
      ])

      setCategories(loadedCategories)
      setEvents(loadedEvents)
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Verbindung zum Backend fehlgeschlagen. Läuft der Server (npm run dev im backend/-Ordner)?',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    getCurrentUser().then((currentUser) => {
      if (cancelled) {
        return
      }

      setUser(currentUser)

      if (currentUser) {
        loadEvents()
      } else {
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const handleAuthenticated = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser)
    loadEvents()
  }

  const handleLogout = async () => {
    await logoutOnServer()
    setUser(null)
    setEvents([])
    setCategories([])
  }

  const handleCreateCategory = async (
    label: string,
    color: string,
  ) => {
    const created = await createCategory(label, color)

    setCategories((previousCategories) => [
      ...previousCategories,
      created,
    ])
  }

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
              existingEvent.id === saved.id
                ? saved
                : existingEvent,
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
    const shouldDelete = confirm(
      'Wirklich alle Ereignisse unwiderruflich löschen?',
    )

    if (!shouldDelete) {
      return
    }

    try {
      await Promise.all(
        events.map((event) => deleteEventOnServer(event.id)),
      )

      setEvents([])
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Ereignisse konnten nicht vollständig gelöscht werden.',
      )
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

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.download = `lifeline-sicherung-${new Date()
      .toISOString()
      .slice(0, 10)}.json`

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

      const validCategoryIds = categories.map(
        (category) => category.id,
      )

      if (
        !Array.isArray(importedEvents) ||
        !importedEvents.every((event) =>
          isLifeEvent(event, validCategoryIds),
        )
      ) {
        throw new Error('Ungültiges Sicherungsformat')
      }

      if (importedEvents.length === 0) {
        alert('Die Sicherung enthält keine Ereignisse.')
        return
      }

      const shouldImport = confirm(
        `Die Sicherung enthält ${importedEvents.length} Ereignis${
          importedEvents.length === 1 ? '' : 'se'
        }. Zusätzlich zu den vorhandenen Ereignissen importieren?`,
      )

      if (!shouldImport) {
        return
      }

      const results = await Promise.allSettled(
        importedEvents.map((event) => createEvent(event)),
      )

      const failedImports = results.filter(
        (result) => result.status === 'rejected',
      ).length

      const successfulImports =
        importedEvents.length - failedImports

      // Den tatsächlichen Datenbankstand neu laden.
      const updatedEvents = await fetchEvents()

      setEvents(updatedEvents)
      setFilter('alle')

      if (failedImports === 0) {
        alert(
          `${successfulImports} Ereignis${
            successfulImports === 1 ? '' : 'se'
          } erfolgreich importiert.`,
        )
      } else {
        alert(
          `${successfulImports} Ereignis${
            successfulImports === 1 ? '' : 'se'
          } importiert. ${failedImports} Ereignis${
            failedImports === 1 ? ' konnte' : 'se konnten'
          } nicht importiert werden.`,
        )
      }
    } catch {
      alert(
        'Die Datei konnte nicht importiert werden. Bitte wähle eine gültige Lifeline-Sicherung aus.',
      )
    }
  }

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <p className="text-sm text-slate-500">Lade …</p>
      </div>
    )
  }

  if (user === null) {
    return <AuthForms onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Header
        userEmail={user.email}
        onLogout={handleLogout}
        onAdd={() => setModalEvent(null)}
        onExport={handleImageExport}
        onDataExport={handleDataExport}
        onDataImport={handleDataImport}
        onClear={handleClearAll}
        eventCount={events.length}
      />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <div ref={timelineRef} className="w-full">
          <Timeline
            categories={categories}
            events={filtered}
            holidays={holidays}
            onSelect={setModalEvent}
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-medium text-slate-100">
            Lebens-Ereignisse
          </h2>

          <CategoryFilter
            categories={categories}
            active={filter}
            onChange={setFilter}
            onCreateCategory={handleCreateCategory}
          />
        </div>

        {isLoading ? (
          <p className="mt-6 text-sm text-slate-500">
            Lade Ereignisse …
          </p>
        ) : loadError ? (
          <p className="mt-6 text-sm text-red-400">
            {loadError}
          </p>
        ) : filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...filtered]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((event) => (
                <EventCard
                  key={event.id}
                  categories={categories}
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
          Hinweis: Alle Daten werden im Backend gespeichert
          (SQLite).
        </p>
      </main>

      {modalEvent !== undefined && (
        <EventFormModal
          categories={categories}
          initial={modalEvent}
          onSave={handleSave}
          onClose={() => setModalEvent(undefined)}
        />
      )}
    </div>
  )
}