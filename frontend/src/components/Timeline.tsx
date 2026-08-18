import { useMemo, useRef, useState } from 'react'
import type { LifeEvent } from '../types'
import { getCategory } from '../types'

interface Props {
  events: LifeEvent[]
  onSelect: (event: LifeEvent) => void
}

export default function Timeline({ events, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 py-16 text-center">
        <p className="font-display text-lg text-slate-400">
          Noch keine Ereignisse
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Füge dein erstes Lifeline-Ereignis hinzu, um die Timeline zu füllen.
        </p>
      </div>
    )
  }

  const minTime = new Date(sorted[0].date).getTime()
  const maxTime = new Date(sorted[sorted.length - 1].date).getTime()
  const span = Math.max(maxTime - minTime, 1)

  const posFor = (date: string) => {
    const time = new Date(date).getTime()
    const percentage = ((time - minTime) / span) * 100

    return 7 + percentage * 0.86
  }

  const timelineWidth = Math.max(720, sorted.length * 220)
  const startYear = new Date(sorted[0].date).getFullYear()
  const endYear = new Date(sorted[sorted.length - 1].date).getFullYear()

const years = Array.from(
  { length: endYear - startYear + 1 },
  (_, index) => startYear + index,
)

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
          {sorted.map((event, index) => {
            const category = getCategory(event.category)
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

      {/* Eigener Timeline-Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={scrollProgress}
        onChange={(event) =>
          handleSliderChange(Number(event.target.value))
        }
        className="timeline-slider mt-2 w-full"
        aria-label="Position auf der Timeline"
      />
    </div>
  )
}