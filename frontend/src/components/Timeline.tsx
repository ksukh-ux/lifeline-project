import { useMemo, useRef, useState } from 'react'
import type { Category, Holiday, LifeEvent } from '../types'
import { getCategory } from '../types'

interface Props {
  categories: Category[]
  events: LifeEvent[]
  holidays?: Holiday[]
  onSelect: (event: LifeEvent) => void
}

export default function Timeline({
  categories,
  events,
  holidays = [],
  onSelect,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [zoom, setZoom] = useState(1)

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events],
  )

  const handleScroll = () => {
    const element = scrollRef.current
    if (!element) return

    const maximum = element.scrollWidth - element.clientWidth
    const progress =
      maximum > 0 ? (element.scrollLeft / maximum) * 100 : 0

    setScrollProgress(progress)
  }

  const handleSliderChange = (value: number) => {
    const element = scrollRef.current
    if (!element) return

    const maximum = element.scrollWidth - element.clientWidth
    element.scrollLeft = (value / 100) * maximum
    setScrollProgress(value)
  }

  const currentYear = new Date().getFullYear()

  // Die Timeline zeigt mindestens das aktuelle Kalenderjahr.
  // Vorhandene Ereignisse können den Zeitraum erweitern.
  const eventTimes = sorted.map((event) =>
    new Date(event.date).getTime(),
  )

  const defaultMinTime = new Date(currentYear, 0, 1).getTime()
  const defaultMaxTime = new Date(
    currentYear,
    11,
    31,
    23,
    59,
    59,
    999,
  ).getTime()

  const minTime =
    eventTimes.length > 0
      ? Math.min(defaultMinTime, ...eventTimes)
      : defaultMinTime

  const maxTime =
    eventTimes.length > 0
      ? Math.max(defaultMaxTime, ...eventTimes)
      : defaultMaxTime

  const span = Math.max(maxTime - minTime, 1)

  const posFor = (date: string) => {
    const time = new Date(date).getTime()
    const percentage = ((time - minTime) / span) * 100

    return 7 + percentage * 0.86
  }

  const startYear = new Date(minTime).getFullYear()
  const endYear = new Date(maxTime).getFullYear()

  const timelineWidth = Math.max(
    720,
    (endYear - startYear + 1) * 240 * zoom,
    sorted.length * 220 * zoom,
  )

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index,
  )

  // S1.3 NB-02 — Feiertagsdienst: rein dekorative Hintergrundmarkierung.
  // Nur Feiertage innerhalb des dargestellten Zeitraums werden positioniert.
  const visibleHolidays = holidays.filter((holiday) => {
    const time = new Date(holiday.date).getTime()
    return time >= minTime && time <= maxTime
  })

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hidden scroll-smooth overflow-x-auto pb-2"
      >
        <div
          className="relative h-56 px-4"
          style={{ minWidth: `${timelineWidth}px` }}
        >
          {/* Horizontale Timeline-Linie */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-brass-500/40 to-transparent" />

          {/* Zeitraster */}
          {years.map((year) => {
            const yearTime = new Date(`${year}-01-01`).getTime()
            const percentage = ((yearTime - minTime) / span) * 100
            const left = 7 + percentage * 0.86

            return (
              <div
                key={year}
                className="absolute top-4 bottom-4 w-px bg-white/10"
                style={{ left: `${left}%` }}
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] text-slate-500">
                  {year}
                </span>
              </div>
            )
          })}

          {/* Feiertage (S1.3, NB-02) */}
          {visibleHolidays.map((holiday) => {
            const left = `${posFor(holiday.date)}%`

            return (
              <div
                key={holiday.date}
                title={holiday.name}
                className="group/holiday absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left }}
              >
                <span className="block h-5 w-px border-l border-dashed border-amber-400/70" />
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                <span className="pointer-events-none absolute top-6 hidden whitespace-nowrap rounded bg-ink-950/90 px-1.5 py-0.5 font-mono text-[9px] text-amber-300 group-hover/holiday:block">
                  {holiday.name}
                </span>
              </div>
            )
          })}

          {/* Ereignisse */}
          {sorted.map((event, index) => {
            const category = getCategory(categories, event.category)
            const pointsUp = index % 2 === 0
            const left = `${posFor(event.date)}%`

            return (
              <button
                key={event.id}
                onClick={() => onSelect(event)}
                className="group absolute top-1/2 -translate-x-1/2 focus:outline-none"
                style={{ left }}
              >
                {/* Verbindung zwischen Balken und Beschriftung */}
                <div
                  className="absolute left-1/2 w-px -translate-x-1/2 bg-white/15 transition group-hover:bg-white/30"
                  style={
                    pointsUp
                      ? { bottom: 4, height: 44 }
                      : { top: 4, height: 44 }
                  }
                />

                {/* Leuchtender Ereignisbalken */}
                <span
                  className="absolute left-1/2 top-1/2 h-12 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out group-hover:h-14 group-hover:w-1.5 group-hover:scale-125"
                  style={{
                    backgroundColor: category.color,
                    boxShadow: `0 0 8px ${category.color}`,
                  }}
                />

                {/* Beschriftung */}
                <div
                  className="absolute left-1/2 w-32 -translate-x-1/2 text-left"
                  style={pointsUp ? { bottom: 52 } : { top: 52 }}
                >
                  <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-slate-200 group-hover:text-brass-400">
                    {event.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {sorted.length === 0 && (
        <p className="mt-3 text-center text-sm text-slate-500">
          Noch keine Ereignisse – füge dein erstes Lifeline-Ereignis hinzu.
        </p>
      )}

      {/* Timeline-Steuerung */}
      <div className="mt-3 flex items-center gap-4">
        {/* Position auf der Timeline */}
        <input
          type="range"
          min="0"
          max="100"
          value={scrollProgress}
          onChange={(event) =>
            handleSliderChange(Number(event.target.value))
          }
          className="timeline-slider flex-1"
          aria-label="Position auf der Timeline"
        />

        {/* Zoom */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[9px] uppercase tracking-wide text-slate-500">
            Zoom
          </span>

          <span className="text-[10px] text-slate-500">−</span>

          <input
            type="range"
            min="0.7"
            max="2"
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
