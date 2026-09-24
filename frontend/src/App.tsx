import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import Header from './components/Header'
import Timeline from './components/Timeline'
import CategoryFilter from './components/CategoryFilter'
import EventCard from './components/EventCard'
import EventFormModal from './components/EventFormModal'
import StatsDashboard from './components/StatsDashboard'
import AuthForms from './components/AuthForms'
import {
  createCategory,
  createEvent,
  deleteEvent as deleteEventOnServer,
  fetchCategories,
  fetchEvents,
  fetchHolidays,
  fetchStats,
  getCurrentUser,
  imageUrlToDataUri,
  logout as logoutOnServer,
  UNAUTHORIZED_EVENT,
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
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchStats>> | null>(null)
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [filter, setFilter] = useState<number | 'alle'>('alle')
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear(),
  )

  const [modalEvent, setModalEvent] = useState<
    LifeEvent | null | undefined
  >(undefined)

  const timelineRef = useRef<HTMLDivElement>(null)

  // Feiertage erst laden, wenn eine Session besteht (die Route ist geschützt),
  // und nach jeder Anmeldung erneut. Vorher gab es eine abgewiesene Anfrage
  // vor dem Login und danach keine Feiertage bis zum ersten Jahreswechsel.
  const userId = user?.id
  useEffect(() => {
    if (userId === undefined) {
      setHolidays([])
      return
    }

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
  }, [selectedYear, userId])

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

      try {
        setStats(await fetchStats())
      } catch {
        // Statistik ist eine Erweiterung und darf die Timeline nicht blockieren.
        setStats(null)
      }
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : 'Deine Ereignisse konnten nicht geladen werden.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const resetSession = () => {
    setUser(null)
    setEvents([])
    setCategories([])
    setStats(null)
    setFilter('alle')
    setModalEvent(undefined)
  }

  // B1.4.1: Ist die Session abgelaufen (z. B. nach einem Serverneustart),
  // führt jede abgewiesene Anfrage zurück zum Anmeldeformular.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, resetSession)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, resetSession)
  }, [])

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
    try {
      await logoutOnServer()
    } finally {
      resetSession()
    }
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
      setStats(await fetchStats())

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
    const shouldDelete = confirm('Dieses Ereignis wirklich löschen?')
    if (!shouldDelete) return

    try {
      await deleteEventOnServer(id)

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event.id !== id),
      )
      setStats(await fetchStats())
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
      setStats(await fetchStats())
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

    // Lokales Datum im Format YYYY-MM-DD (sv-SE), nicht UTC.
    link.download = `lifeline-sicherung-${new Date().toLocaleDateString('sv-SE')}.json`

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

      // Exportierte Events verweisen auf bereits gespeicherte Bilder. Damit
      // sie beim Import nicht verloren gehen, werden sie geladen und als
      // neues Bild mitgeschickt; ist ein Bild nicht mehr abrufbar, wird das
      // Event ohne Bild importiert.
      const eventsWithImages = await Promise.all(
        eventsForImport.map(async (event) =>
          event.image && !event.image.startsWith('data:')
            ? { ...event, image: await imageUrlToDataUri(event.image) }
            : event,
        ),
      )

      const results = await Promise.allSettled(
        eventsWithImages.map((event) => createEvent(event)),
      )

      const failedImports = results.filter(
        (result) => result.status === 'rejected',
      ).length

      const successfulImports = eventsForImport.length - failedImports

      // Den tatsächlichen Datenbankstand neu laden.
      const updatedEvents = await fetchEvents()

      setEvents(updatedEvents)
      setFilter('alle')
      setStats(await fetchStats().catch(() => null))

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
          // B1 DLG-01: Meldung mit der Möglichkeit, erneut zu laden.
          <div role="alert" className="mt-6 flex flex-wrap items-center gap-3 text-sm text-red-400">
            <span>{loadError}</span>
            <button
              type="button"
              onClick={loadEvents}
              className="rounded-md border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/5"
            >
              Erneut laden
            </button>
          </div>
        ) : events.length === 0 ? (
          // B1.4.4: leerer Bestand mit direktem Weg zum Anlegen.
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Du hast noch keine Ereignisse erfasst.</span>
            <button
              type="button"
              onClick={() => setModalEvent(null)}
              className="rounded-md border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/5"
            >
              Erstes Ereignis anlegen
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...filtered]
              .sort((a, b) =>
                // Gleiche Ordnung wie die Zeitachse: ohne Uhrzeit am Tagesende (D2.6).
                `${b.date}T${b.time ?? '23:59'}`.localeCompare(`${a.date}T${a.time ?? '23:59'}`),
              )
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
          // B1.4.4: leere Filtermenge ist kein Fehler; Filter aufheben anbieten.
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Keine Ereignisse in dieser Kategorie. Ein Filter ist aktiv.</span>
            <button
              type="button"
              onClick={() => setFilter('alle')}
              className="rounded-md border border-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/5"
            >
              Filter aufheben
            </button>
          </div>
        )}

        {stats && <StatsDashboard stats={stats} isFiltered={filter !== 'alle'} />}
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
