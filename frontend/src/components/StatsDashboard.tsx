import type { EventStats } from '../api/client'

interface Props {
  stats: EventStats
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const formatDate = (date: string | null) =>
  date ? dateFormatter.format(new Date(date)) : '–'

export default function StatsDashboard({ stats }: Props) {
  return (
    <section className="mt-10 border-t border-white/10 pt-6" aria-labelledby="stats-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass-500">Rückblick</p>
          <h2 id="stats-heading" className="mt-1 font-display text-xl font-medium text-slate-100">Statistik</h2>
        </div>
        <p className="text-xs text-slate-500">{formatDate(stats.oldestDate)} bis {formatDate(stats.newestDate)}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-white/10 bg-ink-900/70 p-3">
          <p className="text-xs text-slate-500">Ereignisse</p>
          <p className="mt-1 font-mono text-xl text-slate-100">{stats.totalCount}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-ink-900/70 p-3">
          <p className="text-xs text-slate-500">Zeitspanne</p>
          <p className="mt-1 font-mono text-xl text-slate-100">{stats.spanDays} Tage</p>
        </div>
        <div className="col-span-2 rounded-md border border-white/10 bg-ink-900/70 p-3 sm:col-span-2">
          <p className="text-xs text-slate-500">Nach Kategorie</p>
          {stats.categories.length === 0 ? (
            <p className="mt-1 text-sm text-slate-400">Noch keine Ereignisse.</p>
          ) : (
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {stats.categories.map((category) => (
                <div key={category.category_id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-slate-300">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: category.category_color }} />
                    <span className="truncate">{category.category_label}</span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-slate-500">{category.count} · {Math.round(category.avg_significance ?? 0)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}