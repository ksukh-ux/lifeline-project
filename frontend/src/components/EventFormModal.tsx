import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, type CategoryId, type LifeEvent } from '../types'

interface Props {
  initial?: LifeEvent | null
  onSave: (event: LifeEvent) => void
  onClose: () => void
}

export default function EventFormModal({ initial, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState(initial?.time ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [category, setCategory] = useState<CategoryId>(initial?.category ?? 'meilenstein')
  const [significance, setSignificance] = useState(initial?.significance ?? 50)

  const isEdit = Boolean(initial)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      image,
      category,
      significance,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-ink-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-slate-100">
            {isEdit ? 'Ereignis bearbeiten' : 'Neues Ereignis'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Titel</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="z. B. Umzug nach Berlin"
              className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Beschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Was ist passiert, und warum zählt es?"
              className="w-full resize-none rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">
              Bild hinzufügen (optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return

                const reader = new FileReader()
                reader.onloadend = () => {
                  setImage(reader.result as string)
                }
                reader.readAsDataURL(file)
              }}
              className="w-full text-sm text-slate-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Datum</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Uhrzeit</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 flex justify-between text-xs font-medium text-slate-400">
              <span>Bedeutung</span>
              <span className="font-mono text-brass-400">{significance}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={significance}
              onChange={(e) => setSignificance(Number(e.target.value))}
              className="w-full accent-brass-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-brass-400"
            >
              {isEdit ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
