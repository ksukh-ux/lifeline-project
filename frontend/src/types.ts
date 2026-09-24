// Kategorie ist eine eigene Entität (siehe docs/spec/D1-datenmodell.md, D1.3;
// N1 NFR-14c-01 "Erweiterbarkeit der Kategorien"): keine feste Werteliste
// mehr im Code, sondern pro Person vom Backend geladen (GET /api/categories)
// und über die Oberfläche erweiterbar (POST /api/categories), ganz ohne
// Code-Änderung oder Neu-Deployment.
export interface Category {
  id: number
  label: string
  color: string // hex, used for dots/lines/badges
}

// S1.3 NB-02 — Feiertagsdienst: rein informative Anreicherung der Timeline,
// nie persistiert und kein Attribut irgendeiner Entität (siehe S1.3, „Ausgaben“).
export interface Holiday {
  date: string // ISO date, e.g. 2026-01-01
  name: string
}

export interface LifeEvent {
  id: string
  title: string
  description: string
  date: string // ISO date, e.g. 2025-06-14
  time?: string // e.g. 14:30
  image?: string
  category: number // Fremdschlüssel auf Category.id
  significance: number // 0-100
}

const FALLBACK_CATEGORY: Category = {
  id: -1,
  label: 'Unbekannt',
  color: '#94A3B8',
}

// Sucht eine Kategorie in der (vom Backend geladenen) Liste der Kategorien
// dieser Person. Fällt auf einen neutralen Platzhalter zurück, falls die ID
// nicht (mehr) existiert, z. B. weil sie gerade erst geladen wird.
export const getCategory = (categories: Category[], id: number): Category =>
  categories.find((c) => c.id === id) ?? FALLBACK_CATEGORY
