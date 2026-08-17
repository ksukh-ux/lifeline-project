import type { LifeEvent } from '../types'

export const sampleEvents: LifeEvent[] = [
  {
    id: crypto.randomUUID(),
    title: 'Erstes Fahrrad',
    description: 'Der Nervenkitzel, zum ersten Mal auf zwei Rädern das Gleichgewicht zu halten.',
    date: '2007-06-15',
    category: 'meilenstein',
    significance: 40,
  },
  {
    id: crypto.randomUUID(),
    title: 'Erster Schultag',
    description: 'Ein neues Kapitel beginnt — aufgeregt und ein bisschen ängstlich zugleich.',
    date: '2008-09-01',
    category: 'bildung',
    significance: 60,
  },
  {
    id: crypto.randomUUID(),
    title: 'Abitur',
    description: 'Meilenstein erreicht — mit Stolz, Freude und ein bisschen Wehmut.',
    date: '2015-06-20',
    category: 'bildung',
    significance: 95,
  },
  {
    id: crypto.randomUUID(),
    title: 'Erster Job',
    description: 'Der erste Arbeitstag — der Übergang in die berufliche Eigenständigkeit.',
    date: '2016-08-01',
    category: 'karriere',
    significance: 90,
  },
  {
    id: crypto.randomUUID(),
    title: 'Erste Solo-Reise',
    description: 'Neue Orte entdecken, neue Menschen treffen — und dabei wachsen.',
    date: '2018-05-10',
    category: 'reise',
    significance: 85,
  },
  {
    id: crypto.randomUUID(),
    title: 'Beförderung',
    description: 'Jahre der Arbeit werden anerkannt — der nächste Schritt beginnt.',
    date: '2022-11-03',
    category: 'karriere',
    significance: 88,
  },
]
