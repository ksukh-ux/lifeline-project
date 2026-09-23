import { useState } from 'react'
import type { EventStats, EventStatsCategory } from '../api/client'

interface Props {
  stats: EventStats
  isFiltered: boolean
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const percentFormatter = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 })

const formatDate = (date: string | null) =>
  date ? dateFormatter.format(new Date(date)) : '–'

// Geometrie des Rings (SVG-Einheiten).
const RADIUS = 80
const STROKE = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
// Lücke zwischen den Segmenten: Einige Kategoriefarben sind bei
// Farbfehlsichtigkeit schwer zu unterscheiden; die Lücke trennt sie sichtbar.
const SEGMENT_GAP = 3

export default function StatsDashboard({ stats, isFiltered }: Props) {
  const [activeId, setActiveId] = useState<number | null>(null)

  // Größte Kategorie zuerst, bei Gleichstand in Anlagereihenfolge wie in der
  // Filterleiste; so bleibt die Reihenfolge der Farben überall gleich.
  const categories = [...stats.categories].sort(
    (a, b) => b.count - a.count || a.category_id - b.category_id,
  )
  const total = categories.reduce((sum, category) => sum + category.count, 0)
  const share = (count: number) =>
    `${percentFormatter.format(total > 0 ? (count / total) * 100 : 0)} %`
  const active = categories.find((category) => category.category_id === activeId) ?? null

  return (
    <section className="mt-10 border-t border-white/10 pt-6" aria-labelledby="stats-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass-500">Rückblick</p>
          <h2 id="stats-heading" className="mt-1 font-display text-xl font-medium text-slate-100">Statistik</h2>
        </div>
        {stats.totalCount > 0 && (
          <p className="text-xs text-slate-500">{formatDate(stats.oldestDate)} bis {formatDate(stats.newestDate)}</p>
        )}
      </div>

      {/* B1 DLG-04: Die Auswertung betrachtet immer den vollständigen Bestand. */}
      {isFiltered && (
        <p className="mt-2 text-xs text-amber-300/80">
          Hinweis: Der Kategoriefilter wirkt nicht auf die Statistik. Sie zeigt immer alle Ereignisse.
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[180px_minmax(240px,300px)_1fr]">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="rounded-md border border-white/10 bg-ink-900/70 p-3">
            <p className="text-xs text-slate-500">Ereignisse</p>
            <p className="mt-1 font-mono text-xl text-slate-100">{stats.totalCount}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-ink-900/70 p-3">
            <p className="text-xs text-slate-500">Zeitspanne</p>
            <p className="mt-1 font-mono text-xl text-slate-100">{stats.spanDays} Tage</p>
          </div>
        </div>

        <div className="flex flex-col items-center rounded-md border border-white/10 bg-ink-900/70 p-3">
          <p className="self-start text-xs text-slate-500">Anteil je Kategorie</p>
          <CategoryDonut
            categories={categories}
            total={total}
            active={active}
            share={share}
            onActivate={setActiveId}
          />
        </div>

        <div className="overflow-x-auto rounded-md border border-white/10 bg-ink-900/70 p-3">
          {categories.length === 0 ? (
            <p className="text-sm text-slate-400">Noch keine Ereignisse.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Anzahl, Anteil und Tendenz der Bedeutung je Kategorie</caption>
              <thead>
                <tr className="text-[11px] text-slate-500">
                  <th scope="col" className="whitespace-nowrap px-1.5 pb-2 text-left font-medium">Kategorie</th>
                  <th scope="col" className="whitespace-nowrap px-1.5 pb-2 text-right font-medium">Anzahl</th>
                  <th scope="col" className="whitespace-nowrap px-1.5 pb-2 text-right font-medium">Anteil</th>
                  <th scope="col" className="whitespace-nowrap px-1.5 pb-2 text-right font-medium">Tendenz Bedeutung</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  const isActive = category.category_id === activeId
                  const trend = Math.round(category.avg_significance ?? 0)
                  return (
                    <tr
                      key={category.category_id}
                      tabIndex={0}
                      onMouseEnter={() => setActiveId(category.category_id)}
                      onMouseLeave={() => setActiveId(null)}
                      onFocus={() => setActiveId(category.category_id)}
                      onBlur={() => setActiveId(null)}
                      className={`cursor-default border-t border-white/5 outline-none transition-colors focus-visible:ring-1 focus-visible:ring-brass-400 ${
                        isActive ? 'bg-white/[0.04] text-slate-100' : 'text-slate-400'
                      }`}
                    >
                      <td className="whitespace-nowrap px-1.5 py-1.5">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ backgroundColor: category.category_color }} />
                        <span className="text-slate-200">{category.category_label}</span>
                      </td>
                      <td className="whitespace-nowrap px-1.5 py-1.5 text-right font-mono">{category.count}</td>
                      <td className="whitespace-nowrap px-1.5 py-1.5 text-right font-mono">{share(category.count)}</td>
                      <td className="whitespace-nowrap px-1.5 py-1.5 text-right font-mono">
                        <span className="inline-flex items-center gap-2">
                          <span className="hidden h-1 w-11 overflow-hidden rounded-full bg-white/10 sm:inline-block" aria-hidden="true">
                            <span className="block h-full rounded-full bg-slate-400" style={{ width: `${trend}%` }} />
                          </span>
                          Ø {trend}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {categories.length > 0 && (
            <p className="mt-2 px-1.5 text-[11px] text-slate-500">
              Tendenz = Mittelwert der Bedeutung (0–100), nur als grobe Orientierung.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

interface DonutProps {
  categories: EventStatsCategory[]
  total: number
  active: EventStatsCategory | null
  share: (count: number) => string
  onActivate: (id: number | null) => void
}

// Ringdiagramm der Anteile je Kategorie. Jedes Segment ist ein Kreis, von dem
// per stroke-dasharray nur ein Bogen sichtbar ist; stroke-dashoffset
// verschiebt den Bogen hinter das vorherige Segment. Beim ersten Anzeigen
// baut sich der Ring einmal auf (Animation in index.css).
function CategoryDonut({ categories, total, active, share, onActivate }: DonutProps) {
  let offset = 0
  return (
    <svg
      viewBox="-110 -110 220 220"
      className="mt-1 h-52 w-52 overflow-visible"
      role="img"
      aria-label={`Anteil der ${total} Ereignisse je Kategorie; Werte in der Tabelle daneben`}
    >
      {/* Hintergrundring, sichtbar solange keine Events vorhanden sind */}
      <circle r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
      <g transform="rotate(-90)">
        {categories.map((category, index) => {
          const length = total > 0 ? (category.count / total) * CIRCUMFERENCE : 0
          const dashOffset = -offset
          offset += length
          const isActive = active?.category_id === category.category_id
          return (
            <circle
              key={category.category_id}
              r={RADIUS}
              fill="none"
              stroke={category.category_color}
              strokeWidth={isActive ? STROKE + 8 : STROKE}
              strokeDasharray={`${Math.max(length - SEGMENT_GAP, 0)} ${CIRCUMFERENCE}`}
              strokeDashoffset={dashOffset}
              className={`donut-segment cursor-default transition-[stroke-width,opacity] duration-200 motion-reduce:transition-none ${
                active && !isActive ? 'opacity-25' : 'opacity-100'
              }`}
              style={{ animationDelay: `${index * 70}ms` }}
              onMouseEnter={() => onActivate(category.category_id)}
              onMouseLeave={() => onActivate(null)}
            />
          )
        })}
      </g>
      <text textAnchor="middle" y={6} className="fill-slate-100 font-mono text-[30px]">
        {active ? active.count : total}
      </text>
      <text textAnchor="middle" y={28} className="fill-slate-500 text-[11px]">
        {active ? `${active.category_label} · ${share(active.count)}` : 'Ereignisse'}
      </text>
    </svg>
  )
}
