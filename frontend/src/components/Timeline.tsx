import { useEffect, useMemo, useRef, useState } from 'react'
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

const eventSortKey = (event: LifeEvent): string =>
  `${event.date}T${event.time ?? '23:59'}`

const MONTHS = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
]

// Breite einer Event-Beschriftung (Tailwind w-32) plus Abstand und
// zusätzlicher Abstand der fernen Beschriftungsebenen zur Zeitachse.
const LABEL_WIDTH_PX = 136

// Gemeinsamer Übergang für den Morph-Effekt zwischen Übersicht und
// Jahresansicht; entfällt, wenn das System reduzierte Bewegung wünscht.
const MORPH = 'transition-[left,opacity,top,bottom,height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
const FAR_LANE_OFFSET = 76

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
  const isDraggingSlider = useRef(false)
  const scrollFrame = useRef<number | null>(null)
  // Ist die Zeitachse kaum breiter als der sichtbare Bereich, gibt es nichts
  // zu scrollen; der Positionsregler wird dann gesperrt, statt sich zu
  // bewegen, ohne dass die Zeitachse mitgeht.
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return
    const update = () => setCanScroll(element.scrollWidth - element.clientWidth > 24)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => observer.disconnect()
  }, [])
  const [zoom, setZoom] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [yearDraft, setYearDraft] = useState(String(selectedYear))

useEffect(() => {
  setYearDraft(String(selectedYear))
}, [selectedYear])

  const sorted = useMemo(
    () => [...events].sort((a, b) => eventSortKey(a).localeCompare(eventSortKey(b))),
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
    return 7 + ((time - minTime) / span) * 86
  }

  // Für den Morph-Effekt bleiben alle Elemente gerendert. Was außerhalb des
  // sichtbaren Bereichs liegt, wird knapp neben den Rand gelegt und
  // ausgeblendet, statt weit außerhalb (sonst würde die Zeitachse breiter).
  const clampedPos = (date: string) => Math.min(104, Math.max(-4, posFor(date)))
  const isInView = (event: LifeEvent) =>
    effectiveViewMode === 'overview' || new Date(event.date).getFullYear() === selectedYear

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

  // Beschriftungen nah beieinanderliegender Events würden sich überlappen.
  // Jedes Event bekommt deshalb eine von vier Ebenen (oben/unten, jeweils
  // nah/fern): die erste freie, deren letzte Beschriftung weit genug links
  // endet. Die Suche beginnt abwechselnd oben und unten, damit die
  // Beschriftungen gleichmäßig um die Zeitachse verteilt sind.
  const labelLanes = (() => {
    const laneEnds = [-Infinity, -Infinity, -Infinity, -Infinity]
    const lanes = new Map<string, number>()
    displayedEvents.forEach((event, index) => {
      const x = (posFor(event.date) / 100) * timelineWidth
      const preference = index % 2 === 0 ? [0, 1, 2, 3] : [1, 0, 3, 2]
      let lane = preference.find((candidate) => laneEnds[candidate] <= x - LABEL_WIDTH_PX) ?? -1
      if (lane === -1) lane = laneEnds.indexOf(Math.min(...laneEnds))
      laneEnds[lane] = x
      lanes.set(event.id, lane)
    })
    return lanes
  })()

  const yearHolidays = holidays.filter(
    (holiday) => new Date(holiday.date).getFullYear() === selectedYear,
  )
  const isYearView = effectiveViewMode === 'year'

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

  // Scroll-Ereignisse kommen sehr häufig; die Reglerposition wird höchstens
  // einmal pro Bild aktualisiert. Solange der Regler gezogen wird, führt er
  // selbst und die Rückmeldung aus dem Scrollen wird ignoriert, sonst ziehen
  // sich Regler und Scrollposition gegenseitig hin und her.
  const handleScroll = () => {
    if (isDraggingSlider.current || scrollFrame.current !== null) return
    scrollFrame.current = requestAnimationFrame(() => {
      scrollFrame.current = null
      const element = scrollRef.current
      if (!element) return
      const maximum = element.scrollWidth - element.clientWidth
      setScrollProgress(maximum > 0 ? (element.scrollLeft / maximum) * 100 : 0)
    })
  }

  const handleSliderChange = (value: number) => {
    const element = scrollRef.current
    if (!element) return
    const maximum = element.scrollWidth - element.clientWidth
    // Direkt springen statt animiert scrollen: der Regler liefert selbst
    // eine fließende Folge von Positionen.
    element.scrollTo({ left: (value / 100) * maximum, behavior: 'instant' })
    setScrollProgress(value)
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Umschalter als Schieberegler: die Markierung gleitet zur aktiven Ansicht. */}
        <div className="relative grid grid-cols-2 rounded-lg border border-white/10 bg-ink-900/60 p-1" role="group" aria-label="Ansicht der Zeitachse">
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-md bg-brass-500/20 shadow-[0_0_12px_rgba(96,165,250,0.35)] ring-1 ring-brass-400/40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: isYearView ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button
            type="button"
            onClick={() => changeViewMode('overview')}
            disabled={sorted.length === 0}
            aria-pressed={!isYearView}
            className={`relative z-10 rounded-md px-4 py-1.5 text-xs transition-colors duration-300 ${
              !isYearView ? 'text-brass-400' : 'text-slate-500 hover:text-slate-300'
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Übersicht
          </button>
          <button
            type="button"
            onClick={() => changeViewMode('year')}
            aria-pressed={isYearView}
            className={`relative z-10 rounded-md px-4 py-1.5 text-xs transition-colors duration-300 ${
              isYearView ? 'text-brass-400' : 'text-slate-500 hover:text-slate-300'
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
              type="text"
              onFocus={(e) => e.currentTarget.select()}
inputMode="numeric"
              min="1900"
              max="2100"
value={yearDraft}
onChange={(event) => {
  const value = event.currentTarget.value.replace(/\D/g, '').slice(0, 4)
  setYearDraft(value)

  if (value.length === 4) {
    const year = Number(value)
    if (year >= 1900 && year <= 2100) changeYear(year)
  }
}}
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
        className="scrollbar-hidden overflow-x-auto overscroll-x-contain pb-2"
      >
        <div
          className="relative h-[30rem] overflow-x-clip px-4 transition-[min-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ minWidth: `${timelineWidth}px` }}
        >
          {/* Zeitstrahl mit leichtem Leuchten */}
          <div aria-hidden="true" className="absolute left-[8%] right-[8%] top-1/2 h-6 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.28),transparent_70%)]" />
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-transparent via-brass-400/80 to-transparent" />

          {overviewYears.map((year) => (
              <div
                key={year}
                aria-hidden={isYearView}
                className={`${MORPH} absolute bottom-6 top-6 w-px bg-white/10 ${isYearView ? 'opacity-0' : 'opacity-100'}`}
                style={{ left: `${clampedPos(`${year}-01-01`)}%` }}
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] text-slate-500">
                  {year}
                </span>
              </div>
            ))}

          {MONTHS.map((month, index) => {
              const monthDate = new Date(selectedYear, index, 1)
              return (
                <div
                  key={month}
                  aria-hidden={!isYearView}
                  className={`${MORPH} absolute bottom-6 top-6 w-px bg-white/10 ${isYearView ? 'opacity-100' : 'opacity-0'}`}
                  style={{ left: `${clampedPos(monthDate.toISOString())}%` }}
                >
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 font-mono text-[10px] text-slate-500">
                    {month}
                  </span>
                </div>
              )
            })}

          {yearHolidays.map((holiday) => (
            <div
              key={`${holiday.date}-${holiday.name}`}
              tabIndex={isYearView ? 0 : -1}
              role="note"
              aria-hidden={!isYearView}
              aria-label={`Feiertag: ${holiday.name}, ${formatDate(holiday.date)}`}
              className={`${MORPH} group/holiday absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center focus:outline-none ${isYearView ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
              style={{ left: `${clampedPos(holiday.date)}%` }}
            >
              <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-amber-400/80" />
              <span className="block h-5 w-px border-l border-dashed border-amber-400/70" />
              <span className="pointer-events-none absolute bottom-7 hidden whitespace-nowrap rounded border border-amber-400/20 bg-ink-950/95 px-2 py-1 font-mono text-[9px] text-amber-300 shadow-lg group-hover/holiday:block group-focus/holiday:block">
                {holiday.name} · {formatDate(holiday.date)}
              </span>
            </div>
          ))}

          {sorted.map((event) => {
            const category = getCategory(categories, event.category)
            const inView = isInView(event)
            const lane = labelLanes.get(event.id) ?? 0
            const pointsUp = lane % 2 === 0
            // Visuelle Gewichtung nach Bedeutung (B1 DLG-01, D2.2): wichtigere
            // Events haben einen höheren und breiteren Marker.
            const markerHeight = 24 + Math.round((event.significance / 100) * 40)
            const markerWidth = event.significance >= 67 ? 6 : event.significance >= 34 ? 4 : 3
            const labelOffset = markerHeight / 2 + 30 + (lane >= 2 ? FAR_LANE_OFFSET : 0)
            return (
              <button
                key={event.id}
                type="button"
                onClick={() => onSelect(event)}
                tabIndex={inView ? 0 : -1}
                aria-hidden={!inView}
                aria-label={`${event.title}, ${formatDate(event.date)}, Kategorie ${category.label}, Bedeutung ${event.significance} von 100`}
                title={`${event.title} · ${formatDate(event.date)} · ${category.label}`}
                className={`${MORPH} group absolute top-1/2 z-20 -translate-x-1/2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 ${inView ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                style={{ left: `${clampedPos(event.date)}%` }}
              >
                <div
                  className={`${MORPH} absolute left-1/2 w-px -translate-x-1/2 bg-white/15 group-hover:bg-white/30`}
                  style={pointsUp ? { bottom: 4, height: labelOffset - 8 } : { top: 4, height: labelOffset - 8 }}
                />
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{
                    height: markerHeight,
                    width: markerWidth,
                    backgroundColor: category.color,
                    boxShadow: `0 0 8px ${category.color}`,
                  }}
                />
                <div
                  className={`${MORPH} absolute left-1/2 w-32 -translate-x-1/2 text-left`}
                  style={pointsUp ? { bottom: labelOffset } : { top: labelOffset }}
                >
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-slate-200 group-hover:text-brass-400">
                    {event.title}
                  </p>
                  {/* Kategorie auch als Text, nicht nur als Farbe (B1.4.7, NFR-11d-01) */}
                  <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-wide text-slate-500">
                    {category.label}
                  </p>
                  <p className="font-mono text-[9px] text-slate-500">
                    {formatDate(event.date)}
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
          step="0.1"
          disabled={!canScroll}
          title={canScroll ? undefined : 'Zum Verschieben zuerst hineinzoomen'}
          value={canScroll ? scrollProgress : 0}
          onChange={(event) => handleSliderChange(Number(event.target.value))}
          onPointerDown={() => { isDraggingSlider.current = true }}
          onPointerUp={() => { isDraggingSlider.current = false }}
          onPointerCancel={() => { isDraggingSlider.current = false }}
          onBlur={() => { isDraggingSlider.current = false }}
          className="timeline-slider flex-1 transition-opacity disabled:cursor-default disabled:opacity-30"
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
