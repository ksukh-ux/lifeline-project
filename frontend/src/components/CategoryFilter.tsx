import { CATEGORIES, type CategoryId } from '../types'

interface Props {
  active: CategoryId | 'alle'
  onChange: (value: CategoryId | 'alle') => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
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
      {CATEGORIES.map((cat) => (
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
    </div>
  )
}
