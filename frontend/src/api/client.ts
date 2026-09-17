import type { CategoryId, LifeEvent } from '../types'

// Verbindung zu unserem Backend (siehe backend/, Branch feat/backend-db).
// Adresse per .env konfigurierbar (VITE_API_URL), Standard ist der lokale
// Entwicklungsserver aus "npm run dev" im backend/-Ordner.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export interface AuthUser {
  id: number
  email: string
  created_at: string
}

interface ApiEventRow {
  id: number
  user_id: number
  category: CategoryId
  title: string
  description: string | null
  date: string
  time: string | null
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

// Echte Registrierung/Anmeldung (UC-07, ADR-004). Ersetzt die frühere
// automatische Demo-Anmeldung — es gibt jetzt eine echte Login-/
// Registrierungsseite (siehe components/AuthForms.tsx).

// Prüft, ob bereits eine gültige Session besteht (z. B. nach einem
// Seiten-Reload). Gibt bei fehlender/abgelaufener Session `null` zurück,
// statt einen Fehler zu werfen — das ist der normale, erwartete Fall beim
// ersten Aufruf der Seite.
export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await apiFetch('/api/auth/me')
  if (!response.ok) return null
  return response.json()
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Anmeldung fehlgeschlagen.'))
  }
  return response.json()
}

export async function register(email: string, password: string): Promise<AuthUser> {
  const response = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Registrierung fehlgeschlagen.'))
  }
  return response.json()
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}

function toImageUrl(imagePath: string | null): string | undefined {
  if (!imagePath) return undefined
  return `${API_BASE_URL}${imagePath}`
}

// Backend-Zeile -> Frontend-Datentyp.
function fromApiRow(row: ApiEventRow): LifeEvent {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description ?? '',
    date: row.date,
    time: row.time ?? undefined,
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
    date: event.date,
    time: event.time || null,
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
