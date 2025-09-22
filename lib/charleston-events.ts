interface CharlestonEvent {
  name: string
  startDate: Date
  endDate: Date
  type: 'festival' | 'sports' | 'conference' | 'seasonal'
  impactScore: number // 1-5 scale for business impact
  affectedZips: string[]
}

export const CHARLESTON_EVENTS_2025: CharlestonEvent[] = [
  {
    name: 'Spoleto Festival USA',
    startDate: new Date('2025-05-23'),
    endDate: new Date('2025-06-08'),
    type: 'festival',
    impactScore: 5,
    affectedZips: ['29401', '29403', '29424']
  },
  {
    name: 'Charleston Wine + Food Festival',
    startDate: new Date('2025-03-05'),
    endDate: new Date('2025-03-09'),
    type: 'festival',
    impactScore: 4,
    affectedZips: ['29401', '29403', '29405']
  },
  {
    name: 'Cooper River Bridge Run',
    startDate: new Date('2025-04-05'),
    endDate: new Date('2025-04-06'),
    type: 'sports',
    impactScore: 3,
    affectedZips: ['29401', '29403', '29405', '29464']
  },
  {
    name: 'Summer Tourism Peak',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-31'),
    type: 'seasonal',
    impactScore: 5,
    affectedZips: ['29401', '29403', '29405', '29407', '29412', '29418']
  },
  {
    name: 'Holiday Shopping Season',
    startDate: new Date('2025-11-15'),
    endDate: new Date('2025-12-31'),
    type: 'seasonal',
    impactScore: 4,
    affectedZips: ['29401', '29403', '29405', '29407', '29414']
  },
  {
    name: 'Charleston Fashion Week',
    startDate: new Date('2025-03-18'),
    endDate: new Date('2025-03-22'),
    type: 'festival',
    impactScore: 3,
    affectedZips: ['29401', '29403']
  },
  {
    name: 'SEWE (Southeastern Wildlife Expo)',
    startDate: new Date('2025-02-14'),
    endDate: new Date('2025-02-16'),
    type: 'conference',
    impactScore: 3,
    affectedZips: ['29401', '29403', '29407']
  },
  {
    name: 'Charleston Marathon',
    startDate: new Date('2025-01-11'),
    endDate: new Date('2025-01-12'),
    type: 'sports',
    impactScore: 2,
    affectedZips: ['29401', '29403', '29405']
  }
]

export function getActiveEvents(date: Date = new Date()): CharlestonEvent[] {
  return CHARLESTON_EVENTS_2025.filter(event =>
    date >= event.startDate && date <= event.endDate
  )
}

export function getEventImpactForZip(zipCode: string, date: Date = new Date()): number {
  const activeEvents = getActiveEvents(date)
  const relevantEvents = activeEvents.filter(event =>
    event.affectedZips.includes(zipCode)
  )

  if (relevantEvents.length === 0) return 0

  // Return the highest impact score from relevant events
  return Math.max(...relevantEvents.map(e => e.impactScore))
}

export function calculateEventBoost(baseScore: number, zipCode: string, date: Date = new Date()): number {
  const impactScore = getEventImpactForZip(zipCode, date)

  // Apply boost: 4% per impact point (max 20% for impact score of 5)
  const boostPercentage = impactScore * 0.04
  return Math.round(baseScore * (1 + boostPercentage))
}

export function getEventContext(zipCode: string, date: Date = new Date()): string | null {
  const activeEvents = getActiveEvents(date)
  const relevantEvents = activeEvents.filter(event =>
    event.affectedZips.includes(zipCode)
  )

  if (relevantEvents.length === 0) return null

  const eventNames = relevantEvents.map(e => e.name).join(', ')
  return `Active during: ${eventNames}`
}

// Niche-specific event impact multipliers
export const NICHE_EVENT_MULTIPLIERS: Record<string, Record<string, number>> = {
  'restaurants': {
    'festival': 1.5,
    'sports': 1.2,
    'conference': 1.3,
    'seasonal': 1.4
  },
  'cafes': {
    'festival': 1.4,
    'sports': 1.1,
    'conference': 1.2,
    'seasonal': 1.3
  },
  'plumbers': {
    'festival': 1.1,
    'sports': 1.0,
    'conference': 1.0,
    'seasonal': 1.3 // Summer AC issues
  },
  'hvac': {
    'festival': 1.1,
    'sports': 1.0,
    'conference': 1.0,
    'seasonal': 1.5 // Summer peak demand
  },
  'hotels': {
    'festival': 1.6,
    'sports': 1.3,
    'conference': 1.5,
    'seasonal': 1.4
  },
  'cleaning': {
    'festival': 1.3,
    'sports': 1.1,
    'conference': 1.2,
    'seasonal': 1.4
  }
}

export function getNicheEventBoost(niche: string, zipCode: string, date: Date = new Date()): number {
  const activeEvents = getActiveEvents(date)
  const relevantEvents = activeEvents.filter(event =>
    event.affectedZips.includes(zipCode)
  )

  if (relevantEvents.length === 0) return 1.0

  const nicheMultipliers = NICHE_EVENT_MULTIPLIERS[niche.toLowerCase()] || {}
  let maxMultiplier = 1.0

  for (const event of relevantEvents) {
    const multiplier = nicheMultipliers[event.type] || 1.0
    maxMultiplier = Math.max(maxMultiplier, multiplier)
  }

  return maxMultiplier
}