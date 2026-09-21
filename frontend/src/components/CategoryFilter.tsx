import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { Category } from '../types'

interface Props {
  categories: Category[]
  active: number | 'alle'
  onChange: (value: number | 'alle') => void
  onCreateCategory: (label: string, color: string) => Promise<void>
}

// Vorschlagsfarbe für eine neue Kategorie: rotiert durch eine kleine Palette,
// damit nicht jede neue Kategorie zufällig dieselbe Farbe wie eine
// bestehende bekommt.
const SUGGESTED_COLORS = [
  '#38BDF8', '#FB923C', '#8B5CF6', '#EC4899',
  '#14B8A6', '#F43F5E', '#94A3B8', '#A3E635', '#FACC15', '#F472B6',
]

export default function CategoryFilter({ categories, active, onChange, onCreateCategory }: Props) {
  const [isAdding, setIsAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [color, setColor] = useState(
    SUGGESTED_COLORS[categories.length % SUGGESTED_COLORS.length],
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    setIsSubmitting(true)
    setError(null)
    try {
      await onCreateCategory(label.trim(), color)
      setLabel('')
      setIsAdding(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategorie konnte nicht angelegt werden.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange('alle')}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
          active === 'alle'
            ? 'border-brass-500 bg-brass-500/15 text-brass-400'
            : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
        }`}
      >
        Alle
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
            active === cat.id
              ? 'border-white/20 bg-white/10 text-slate-100'
              : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
          }`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: cat.color }}
          />
          {cat.label}
        </button>
      ))}

      {isAdding ? (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-ink-900 py-1 pl-1 pr-2"
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-5 w-5 cursor-pointer rounded-full border-0 bg-transparent p-0"
            aria-label="Farbe der neuen Kategorie"
          />
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Neue Kategorie"
            maxLength={40}
            className="w-28 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isSubmitting || !label.trim()}
            className="rounded-full bg-brass-500 px-2 py-0.5 text-[11px] font-medium text-ink-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? '…' : 'OK'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false)
              setError(null)
            }}
            className="text-[11px] text-slate-500 hover:text-slate-300"
          >
            Abbrechen
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-white/15 px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-white/30 hover:text-slate-300"
        >
          <Plus size={12} />
          Neue Kategorie
        </button>
      )}

      {error && (
        <p className="w-full text-xs text-rose-400">{error}</p>
      )}
    </div>
  )
}
