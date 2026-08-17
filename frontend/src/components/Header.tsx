import { Plus, Download, Trash2 } from 'lucide-react'

interface HeaderProps {
  onAdd: () => void
  onExport: () => void
  onClear: () => void
  eventCount: number
}

export default function Header({ onAdd, onExport, onClear, eventCount }: HeaderProps) {
  return (
    <header className="border-b border-white/5 px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brass-500">
            {eventCount} Ereignis{eventCount === 1 ? '' : 'se'} erfasst
          </p>
          <h1 className="mt-2 bg-gradient-to-r from-orange-400 via-pink-500 to-violet-500 bg-clip-text font-display text-4xl font-medium text-transparent sm:text-5xl">
           Lifeline
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Deine Reise, chronologisch erzählt. Halte fest, was zählt.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-brass-400"
          >
            <Plus size={16} strokeWidth={2.5} />
            Ereignis hinzufügen
          </button>
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-ink-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-ink-700"
          >
            <Download size={16} />
            Als Bild exportieren
          </button>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-ink-800 px-4 py-2 text-sm font-medium text-rose-300/80 transition hover:border-rose-400/30 hover:text-rose-300"
          >
            <Trash2 size={16} />
            Alle Daten löschen
          </button>
        </div>
      </div>
    </header>
  )
}
