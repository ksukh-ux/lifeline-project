export type CategoryId =
  | 'meilenstein'
  | 'karriere'
  | 'bildung'
  | 'beziehung'
  | 'reise'
  | 'gesundheit'
  | 'sonstiges'

export interface Category {
  id: CategoryId
  label: string
  color: string // hex, used for dots/lines/badges
}

export interface LifeEvent {
  id: string
  title: string
  description: string
  date: string // ISO date, e.g. 2025-06-14
  category: CategoryId
  significance: number // 0-100
}

export const CATEGORIES: Category[] = [
  { id: 'meilenstein', label: 'Meilenstein', color: '#38BDF8' },
  { id: 'karriere', label: 'Karriere', color: '#FB923C' },
  { id: 'bildung', label: 'Bildung', color: '#8B5CF6' },
  { id: 'beziehung', label: 'Beziehung', color: '#EC4899' },
  { id: 'reise', label: 'Reise', color: '#14B8A6' },
  { id: 'gesundheit', label: 'Gesundheit', color: '#F43F5E' },
  { id: 'sonstiges', label: 'Sonstiges', color: '#94A3B8' },
]

export const getCategory = (id: CategoryId): Category =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
