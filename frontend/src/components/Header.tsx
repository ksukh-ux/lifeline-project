import { useEffect, useRef, useState } from 'react'
import {
  Download,
  EllipsisVertical,
  FileDown,
  FileUp,
  Plus,
  Trash2,
} from 'lucide-react'

interface HeaderProps {
  onAdd: () => void
  onExport: () => void
  onDataExport: () => void
  onDataImport: (file: File) => void
  onClear: () => void
  eventCount: number
}

export default function Header({
  onAdd,
  onExport,
  onDataExport,
  onDataImport,
  onClear,
  eventCount,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const runAndClose = (action: () => void) => {
    action()
    setMenuOpen(false)
  }

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-brass-400"
          >
            <Plus size={16} strokeWidth={2.5} />
            Ereignis hinzufügen
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-ink-800 text-slate-300 transition hover:border-white/20 hover:bg-ink-700 hover:text-white"
              aria-label="Weitere Optionen"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <EllipsisVertical size={18} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-lg border border-white/10 bg-ink-800 p-1.5 shadow-2xl shadow-black/40"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => runAndClose(onExport)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                >
                  <Download size={16} className="text-slate-400" />
                  Timeline als Bild exportieren
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => runAndClose(onDataExport)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                >
                  <FileDown size={16} className="text-slate-400" />
                  Daten exportieren
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    fileInputRef.current?.click()
                    setMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5"
                >
                  <FileUp size={16} className="text-slate-400" />
                  Daten importieren
                </button>

                <div className="my-1.5 border-t border-white/10" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => runAndClose(onClear)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-rose-300/90 transition hover:bg-rose-400/10 hover:text-rose-300"
                >
                  <Trash2 size={16} />
                  Alle Daten löschen
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]

                if (file) {
                  onDataImport(file)
                }

                event.target.value = ''
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}