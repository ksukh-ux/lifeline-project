import { Pencil, Trash2 } from 'lucide-react'
import type { LifeEvent } from '../types'
import { getCategory } from '../types'

interface Props {
  event: LifeEvent
  onEdit: (event: LifeEvent) => void
  onDelete: (id: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export default function EventCard({ event, onEdit, onDelete }: Props) {
  const cat = getCategory(event.category)

  return (
    <div className="group relative rounded-lg border border-white/8 bg-ink-900 p-4 transition hover:border-white/15">
      <div className="absolute left-0 top-4 h-8 w-0.5 rounded-r" style={{ backgroundColor: cat.color }} />
      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
              style={{ backgroundColor: `${cat.color}22`, color: cat.color }}
            >
              {cat.label}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {dateFormatter.format(new Date(event.date))}
            </span>
          </div>
          <h3 className="mt-1.5 truncate font-display text-base font-medium text-slate-100">
            {event.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">{event.description}</p>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{ width: `${event.significance}%`, backgroundColor: cat.color }}
              />
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              Bedeutung {event.significance}%
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => onEdit(event)}
            className="rounded p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
            aria-label="Ereignis bearbeiten"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="rounded p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
            aria-label="Ereignis löschen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
