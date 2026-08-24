import type { CategoryId, LifeEvent } from '../types'

// Verbindung zu unserem Backend (siehe backend/, Branch feat/backend-db).
// Adresse per .env konfigurierbar (VITE_API_URL), Standard ist der lokale
// Entwicklungsserver aus "npm run dev" im backend/-Ordner.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// --- Übergangslösung: automatische Demo-Anmeldung ---
// Es gibt noch keine echte Registrierungs-/Login-Seite im Frontend. Damit
// man trotzdem end-to-end testen kann ("Eintrag auf der Webseite anlegen
// -> landet wirklich in der Datenbank"), meldet sich die App beim Start
// automatisch mit einem festen Demo-Konto an (wird beim allerersten Mal
// automatisch im Backend angelegt). Das ist bewusst eine Übergangslösung
// für lokales Testen, KEIN Ersatz für eine echte Login-Seite — die ist
// weiterhin offen und sollte vor einem echten Launch ergänzt werden.
const DEMO_EMAIL = 'demo@lifeline.local'
const DEMO_PASSWORD = 'lifeline-demo-2026'

interface ApiEventRow {
  id: number
  user_id: number
  category: CategoryId
  title: string
  description: string | null
  start_date: string
  end_date: string
  location: string | null
  tags: string | null
  significance: number | null
  image_path: string | null
  created_at: string
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
}

// Stellt sicher, dass eine angemeldete Session besteht (siehe Kommentar
// oben). Sollte einmal beim Start der App aufgerufen werden.
export async function ensureSession(): Promise<void> {
  const me = await apiFetch('/api/auth/me')
  if (me.ok) return

  const login = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  })
  if (login.ok) return

  const register = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  })
  if (!register.ok) {
    throw new Error('Konnte keine Verbindung zum Backend herstellen (Anmeldung fehlgeschlagen).')
  }
}

function toImageUrl(imagePath: string | null): string | undefined {
  if (!imagePath) return undefined
  return `${API_BASE_URL}${imagePath}`
}

// Backend-Zeile -> Frontend-Datentyp. Das Backend trennt start_date/end_date
// (Zeitraum), das Frontend kennt bisher nur ein einzelnes "date" — wir
// verwenden hier start_date. Diese Vereinfachung ist ein bekannter,
// dokumentierter Unterschied (siehe D1/D2 vs. frontend/src/types.ts) und
// müsste bei einer echten Zeitraum-Unterstützung im Frontend nachgezogen
// werden.
function fromApiRow(row: ApiEventRow): LifeEvent {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description ?? '',
    date: row.start_date,
    image: toImageUrl(row.image_path),
    category: row.category,
    significance: row.significance ?? 50,
  }
}

// Frontend-Datentyp -> Anfrage an das Backend.
function toApiImageField(image: string | undefined): string | null | undefined {
  if (!image) return null // kein Bild gewünscht
  if (image.startsWith('data:')) return image // neu ausgewähltes Bild (Base64)
  return undefined // bereits eine /uploads/-URL vom Backend -> unverändert lassen
}

function toApiPayload(event: LifeEvent) {
  return {
    category: event.category,
    title: event.title,
    description: event.description,
    start_date: event.date,
    end_date: event.date,
    significance: event.significance,
    image: toApiImageField(event.image),
  }
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json()
    return typeof body?.error === 'string' ? body.error : fallback
  } catch {
    return fallback
  }
}

export async function fetchEvents(): Promise<LifeEvent[]> {
  const response = await apiFetch('/api/events')
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Konnte Ereignisse nicht laden.'))
  }
  const rows: ApiEventRow[] = await response.json()
  return rows.map(fromApiRow)
}

export async function createEvent(event: LifeEvent): Promise<LifeEvent> {
  const response = await apiFetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(toApiPayload(event)),
  })
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Konnte Ereignis nicht anlegen.'))
  }
  return fromApiRow(await response.json())
}

export async function updateEvent(event: LifeEvent): Promise<LifeEvent> {
  const response = await apiFetch(`/api/events/${event.id}`, {
    method: 'PUT',
    body: JSON.stringify(toApiPayload(event)),
  })
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Konnte Ereignis nicht speichern.'))
  }
  return fromApiRow(await response.json())
}

export async function deleteEvent(id: string): Promise<void> {
  const response = await apiFetch(`/api/events/${id}`, { method: 'DELETE' })
  if (!response.ok && response.status !== 404) {
    throw new Error(await readErrorMessage(response, 'Konnte Ereignis nicht löschen.'))
  }
}
