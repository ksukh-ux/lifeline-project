import { useMemo, useRef, useState } from 'react'
import type { Category, Holiday, LifeEvent } from '../types'
import { getCategory } from '../types'

interface Props {
  categories: Category[]
  events: LifeEvent[]
  holidays?: Holiday[]
  selectedYear: number
  onSelectedYearChange: (year: number) => void
  onSelect: (event: LifeEvent) => void
}

type ViewMode = 'overview' | 'year'

const MONTHS = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))

export default function Timeline({
  categories,
  events,
  holidays = [],
  selectedYear,
  onSelectedYearChange,
  onSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [zoom, setZoom] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('overview')

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  )

  // Ohne Ereignisse wird automatisch die Monatsansicht gezeigt.
  const effectiveViewMode: ViewMode =
    sorted.length === 0 ? 'year' : viewMode

  const eventsInSelectedYear = useMemo(
    () =>
      sorted.filter(
        (event) => new Date(event.date).getFullYear() === selectedYear,
      ),
    [selectedYear, sorted],
  )

  const displayedEvents =
    effectiveViewMode === 'year' ? eventsInSelectedYear : sorted

  const eventYears = sorted.map((event) =>
    new Date(event.date).getFullYear(),
  )
  const overviewStartYear =
    eventYears.length > 0 ? Math.min(...eventYears) : selectedYear
  const overviewEndYear =
    eventYears.length > 0 ? Math.max(...eventYears) : selectedYear
  const startYear =
    effectiveViewMode === 'year' ? selectedYear : overviewStartYear
  const endYear =
    effectiveViewMode === 'year' ? selectedYear : overviewEndYear

  const minTime = new Date(startYear, 0, 1).getTime()
  const maxTime = new Date(
    endYear, 11, 31, 23, 59, 59, 999,
  ).getTime()
  const span = Math.max(maxTime - minTime, 1)

  const posFor = (date: string) => {
    const time = new Date(date).getTime()
    return 5 + ((time - minTime) / span) * 90
  }

  const overviewYears = Array.from(
    { length: overviewEndYear - overviewStartYear + 1 },
    (_, index) => overviewStartYear + index,
  )

  const zoomFactor = 1 + zoom

  const timelineWidth =
    effectiveViewMode === 'year'
      ? Math.max(960, 1200 * zoomFactor)
      : Math.max(
          960,
          overviewYears.length * 80 * zoomFactor,
        )

  const visibleHolidays =
    effectiveViewMode === 'year'
      ? holidays.filter(
          (holiday) =>
            new Date(holiday.date).getFullYear() === selectedYear,
        )
      : []

  const resetScroll = () => {
    setScrollProgress(0)
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }

  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode)
    resetScroll()
  }

  const changeYear = (year: number) => {
    if (!Number.isFinite(year) || year < 1900 || year > 2100) return
    onSelectedYearChange(year)
    resetScroll()
  }

  const handleScroll = () => {
    const element = scrollRef.current
    if (!element) return
    const maximum = element.scrollWidth - element.clientWidth
    setScrollProgress(
      maximum > 0 ? (element.scrollLeft / maximum) * 100 : 0,
    )
  }

  const handleSliderChange = (value: number) => {
    const element = scrollRef.current
    if (!element) return
    const maximum = element.scrollWidth - element.clientWidth
    element.scrollLeft = (value / 100) * maximum
    setScrollProgress(value)
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-white/10 bg-ink-900/60 p-1">
          <button
            type="button"
            onClick={() => changeViewMode('overview')}
            disabled={sorted.length === 0}
            className={`rounded-md px-3 py-1.5 text-xs transition ${
              effectiveViewMode === 'overview'
                ? 'bg-white/10 text-brass-400'
                : 'text-slate-500 hover:text-slate-300'
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Übersicht
          </button>
          <button
            type="button"
            onClick={() => changeViewMode('year')}
            className={`rounded-md px-3 py-1.5 text-xs transition ${
              effectiveViewMode === 'year'
                ? 'bg-white/10 text-brass-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Jahresansicht
          </button>
        </div>

        {effectiveViewMode === 'year' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeYear(selectedYear - 1)}
              className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:text-white"
              aria-label="Vorheriges Jahr"
            >
              ‹
            </button>
            <label className="sr-only" htmlFor="timeline-year">
              Jahr auswählen
            </label>
            <input
              id="timeline-year"
              type="number"
              min="1900"
              max="2100"
              value={selectedYear}
              onChange={(event) => changeYear(Number(event.target.value))}
              className="w-24 rounded-md border border-white/10 bg-ink-900/60 px-3 py-1.5 text-center font-mono text-sm text-slate-200 outline-none focus:border-brass-500/50"
            />
            <button
              type="button"
              onClick={() => changeYear(selectedYear + 1)}
              className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate-400 hover:text-white"
              aria-label="Nächstes Jahr"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hidden scroll-smooth overflow-x-auto pb-2"
      >
        <div
          className="relative h-64 px-4"
          style={{ minWidth: `${timelineWidth}px` }}
        >
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-brass-500/40 to-transparent" />

          {effectiveViewMode === 'overview' &&
            overviewYears.map((year) => (
              <div
                key={year}
                className="absolute bottom-6 top-6 w-px bg-white/10"
                style={{ left: `${posFor(`${year}-01-01`)}%` }}
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] text-slate-500">
                  {year}
                </span>
              </div>
            ))}

          {effectiveViewMode === 'year' &&
            MONTHS.map((month, index) => {
              const monthDate = new Date(selectedYear, index, 1)
              return (
                <div
                  key={month}
                  className="absolute bottom-6 top-6 w-px bg-white/10"
                  style={{ left: `${posFor(monthDate.toISOString())}%` }}
                >
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] text-slate-500">
                    {month}
                  </span>
                </div>
              )
            })}

          {visibleHolidays.map((holiday) => (
            <div
              key={`${holiday.date}-${holiday.name}`}
              className="group/holiday absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{ left: `${posFor(holiday.date)}%` }}
            >
              <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-amber-400/80" />
              <span className="block h-5 w-px border-l border-dashed border-amber-400/70" />
              <span className="pointer-events-none absolute bottom-7 hidden whitespace-nowrap rounded border border-amber-400/20 bg-ink-950/95 px-2 py-1 font-mono text-[9px] text-amber-300 shadow-lg group-hover/holiday:block">
                {holiday.name} · {formatDate(holiday.date)}
              </span>
            </div>
          ))}

          {displayedEvents.map((event, index) => {
            const category = getCategory(categories, event.category)
            const pointsUp = index % 2 === 0
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onSelect(event)}
                className="group absolute top-1/2 z-20 -translate-x-1/2 focus:outline-none"
                style={{ left: `${posFor(event.date)}%` }}
              >
                <div
                  className="absolute left-1/2 w-px -translate-x-1/2 bg-white/15 transition group-hover:bg-white/30"
                  style={pointsUp ? { bottom: 4, height: 44 } : { top: 4, height: 44 }}
                />
                <span
                  className="absolute left-1/2 top-1/2 h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 group-hover:h-14 group-hover:w-1.5"
                  style={{
                    backgroundColor: category.color,
                    boxShadow: `0 0 8px ${category.color}`,
                  }}
                />
                <div
                  className="absolute left-1/2 w-32 -translate-x-1/2 text-left"
                  style={pointsUp ? { bottom: 52 } : { top: 52 }}
                >
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-slate-200 group-hover:text-brass-400">
                    {event.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {displayedEvents.length === 0 && (
        <p className="mt-2 text-center text-sm text-slate-500">
          Keine Ereignisse im Jahr {selectedYear}.
        </p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="100"
          value={scrollProgress}
          onChange={(event) => handleSliderChange(Number(event.target.value))}
          className="timeline-slider flex-1"
          aria-label="Position auf der Timeline"
        />
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[9px] uppercase tracking-wide text-slate-500">Zoom</span>
          <span className="text-[10px] text-slate-500">−</span>
          <input
            type="range"
            min="0"
            max="1.3"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="timeline-slider w-20"
            aria-label="Timeline-Zoom"
          />
          <span className="text-[10px] text-slate-500">+</span>
        </div>
      </div>
    </div>
  )
}
