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

interface BackupCategory {
  id: number
  label: string
  color: string
}

interface LifelineBackup {
  version: 2
  exportedAt: string
  categories: BackupCategory[]
  events: LifeEvent[]
}

const isLifeEvent = (value: unknown): value is LifeEvent => {
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
    typeof event.category === 'number'
  )
}

const isBackupCategory = (value: unknown): value is BackupCategory => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const category = value as Partial<BackupCategory>

  return (
    typeof category.id === 'number' &&
    typeof category.label === 'string' &&
    typeof category.color === 'string'
  )
}

const normalizeCategoryLabel = (label: string) =>
  label.trim().toLocaleLowerCase('de-DE')

export default function App() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined)
  const [events, setEvents] = useState<LifeEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [filter, setFilter] = useState<number | 'alle'>('alle')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear(),
  )

  const [modalEvent, setModalEvent] = useState<
    LifeEvent | null | undefined
  >(undefined)

  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    fetchHolidays(selectedYear).then(
      (result) => {
        if (cancelled) {
          return
        }

        setHolidays(result)
      },
    )

    return () => {
      cancelled = true
    }
  }, [selectedYear])

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

  const handleCreateCategory = async (label: string, color: string) => {
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
      version: 2,
      exportedAt: new Date().toISOString(),
      categories: categories.map(({ id, label, color }) => ({
        id,
        label,
        color,
      })),
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

      const parsedBackup =
        !Array.isArray(parsed) && parsed && typeof parsed === 'object'
          ? (parsed as Partial<LifelineBackup>)
          : null

      const importedEvents = Array.isArray(parsed)
        ? parsed
        : parsedBackup?.events

      if (
        !Array.isArray(importedEvents) ||
        !importedEvents.every(isLifeEvent)
      ) {
        throw new Error(
          'Die Datei enthält keine gültigen Lifeline-Ereignisse.',
        )
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

      let eventsForImport: LifeEvent[] = importedEvents

      // Version 2 enthält Kategorien mit Namen und Farbe. Die alten IDs
      // werden auf die Kategorien des aktuell angemeldeten Benutzers abgebildet.
      if (parsedBackup?.version === 2) {
        const importedCategories = parsedBackup.categories

        if (
          !Array.isArray(importedCategories) ||
          !importedCategories.every(isBackupCategory)
        ) {
          throw new Error(
            'Die Sicherung enthält keine gültigen Kategorien.',
          )
        }

        const localCategories = [...categories]
        const categoryIdMap = new Map<number, number>()

        for (const importedCategory of importedCategories) {
          const normalizedLabel = normalizeCategoryLabel(
            importedCategory.label,
          )

          let localCategory = localCategories.find(
            (category) =>
              normalizeCategoryLabel(category.label) === normalizedLabel,
          )

          if (!localCategory) {
            localCategory = await createCategory(
              importedCategory.label,
              importedCategory.color,
            )
            localCategories.push(localCategory)
          }

          categoryIdMap.set(importedCategory.id, localCategory.id)
        }

        eventsForImport = importedEvents.map((event) => {
          const localCategoryId = categoryIdMap.get(event.category)

          if (localCategoryId === undefined) {
            throw new Error(
              `Für das Ereignis „${event.title}“ fehlt die Kategorie in der Sicherung.`,
            )
          }

          return {
            ...event,
            category: localCategoryId,
          }
        })

        setCategories(localCategories)
      } else {
        // Alte Version-1-Dateien enthalten nur Datenbank-IDs. Sie können
        // weiterhin importiert werden, wenn diese IDs beim Benutzer existieren.
        const validCategoryIds = new Set(
          categories.map((category) => category.id),
        )
        const hasUnknownCategory = importedEvents.some(
          (event) => !validCategoryIds.has(event.category),
        )

        if (hasUnknownCategory) {
          throw new Error(
            'Diese ältere Sicherung enthält Kategorie-IDs eines anderen Benutzerkontos. Bitte verwende eine Sicherung im neuen Format.',
          )
        }
      }

      const results = await Promise.allSettled(
        eventsForImport.map((event) => createEvent(event)),
      )

      const failedImports = results.filter(
        (result) => result.status === 'rejected',
      ).length

      const successfulImports = eventsForImport.length - failedImports

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
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Die Datei konnte nicht importiert werden. Bitte wähle eine gültige Lifeline-Sicherung aus.',
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
            selectedYear={selectedYear}
            onSelectedYearChange={setSelectedYear}
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
          <p className="mt-6 text-sm text-red-400">{loadError}</p>
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
          Hinweis: Alle Daten werden im Backend gespeichert (SQLite).
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
