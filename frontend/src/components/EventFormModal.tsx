import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Category, LifeEvent } from '../types'

// Muss mit backend/src/utils/image.ts übereinstimmen (D2.3).
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

interface Props {
  categories: Category[]
  initial?: LifeEvent | null
  onSave: (event: LifeEvent) => void
  onClose: () => void
}

export default function EventFormModal({ categories, initial, onSave, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().slice(0, 10))
  // Die Uhrzeit ist optional (D1.4) und wird deshalb nicht vorbelegt; sonst
  // hätte jedes neue Event die Uhrzeit der Erfassung (NFR-12c-01).
  const [time, setTime] = useState(initial?.time ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [category, setCategory] = useState<number>(initial?.category ?? categories[0]?.id ?? -1)
  const [significance, setSignificance] = useState(initial?.significance ?? 50)

  // Das Einlesen eines Bildes (FileReader) läuft asynchron ab. Ohne diese
  // Sperre konnte man vor Fertigstellung schon auf "Speichern" klicken —
  // dann wurde das Ereignis ohne Bild angelegt (image war noch leer),
  // besonders auffällig bei größeren Foto-Dateien, die länger zum Einlesen
  // brauchen als kleine Testbilder.
  const [isReadingImage, setIsReadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const isEdit = Boolean(initial)

  const isDirty =
    title !== (initial?.title ?? '') ||
    description !== (initial?.description ?? '') ||
    time !== (initial?.time ?? '') ||
    image !== (initial?.image ?? '') ||
    (initial !== undefined && initial !== null &&
      (date !== initial.date ||
        category !== initial.category ||
        significance !== initial.significance))

  // B1.4.3: Bereits eingegebene Werte werden nur nach Rückfrage verworfen.
  const handleCancel = () => {
    if (isDirty && !confirm('Ungespeicherte Eingaben verwerfen?')) return
    onClose()
  }

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleCancel()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date || isReadingImage) return
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
    <div role="dialog" aria-modal="true" aria-labelledby="event-form-heading" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-ink-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="event-form-heading" className="font-display text-lg font-medium text-slate-100">
            {isEdit ? 'Ereignis bearbeiten' : 'Neues Ereignis'}
          </h2>
          <button type="button" onClick={handleCancel} aria-label="Formular schließen" className="rounded p-1 text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="event-title" className="mb-1 block text-xs font-medium text-slate-400">Titel</label>
            <input
              id="event-title"
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="z. B. Umzug nach Berlin"
              className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
            />
          </div>

          <div>
            <label htmlFor="event-description" className="mb-1 block text-xs font-medium text-slate-400">Beschreibung</label>
            <textarea
              id="event-description"
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Was ist passiert, und warum zählt es?"
              className="w-full resize-none rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
            />
          </div>
          <div>
            <label htmlFor="event-image" className="mb-1 block text-xs font-medium text-slate-400">
              Bild hinzufügen (optional, JPEG/PNG/WEBP, max. 5 MB)
            </label>

            <input
              id="event-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setImageError(null)
                if (!file) return

                // Frühe Rückmeldung am Bildfeld (B1 DLG-02); verbindlich
                // prüft weiterhin das Backend inkl. Dateisignatur (D2.3).
                if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_BYTES) {
                  setImageError('Bitte ein JPEG-, PNG- oder WEBP-Bild bis 5 MB wählen.')
                  e.target.value = ''
                  return
                }

                setIsReadingImage(true)
                const reader = new FileReader()
                reader.onloadend = () => {
                  setImage(reader.result as string)
                  setIsReadingImage(false)
                }
                reader.onerror = () => {
                  setIsReadingImage(false)
                  alert('Bild konnte nicht gelesen werden. Bitte versuche es erneut.')
                }
                reader.readAsDataURL(file)
              }}
              className="w-full text-sm text-slate-300"
            />
            {image && !isReadingImage && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Bildvorschau"
                  className="h-16 w-16 rounded-md border border-white/10 object-cover"
                />
                <div className="flex flex-col items-start gap-1">
                  <p className="text-xs text-slate-500">
                    {isEdit ? 'Aktuelles Bild. Neue Datei wählen, um es zu ersetzen.' : 'Ausgewähltes Bild.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="text-xs text-slate-500 hover:text-rose-300"
                  >
                    Bild entfernen
                  </button>
                </div>
              </div>
            )}
            {isReadingImage && (
              <p className="mt-1 text-xs text-slate-500">Bild wird geladen …</p>
            )}
            {imageError && (
              <p role="alert" className="mt-1 text-xs text-rose-400">{imageError}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="event-date" className="mb-1 block text-xs font-medium text-slate-400">Datum</label>
              <input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
              />
            </div>
            <div>
              <label htmlFor="event-time" className="mb-1 block text-xs font-medium text-slate-400">Uhrzeit</label>
              <input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label htmlFor="event-category" className="mb-1 block text-xs font-medium text-slate-400">Kategorie</label>
              <select
                id="event-category"
                value={category}
                onChange={(e) => setCategory(Number(e.target.value))}
                className="w-full rounded-md border border-white/10 bg-ink-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brass-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="event-significance" className="mb-1 flex justify-between text-xs font-medium text-slate-400">
              <span>Bedeutung</span>
              <span className="font-mono text-brass-400">{significance} / 100</span>
            </label>
            <input
              id="event-significance"
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
              onClick={handleCancel}
              className="rounded-md border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isReadingImage}
              className="rounded-md bg-brass-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-brass-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReadingImage ? 'Bild wird geladen …' : isEdit ? 'Speichern' : 'Hinzufügen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
