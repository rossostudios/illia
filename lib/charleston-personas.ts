export interface CharlestonPersona {
  id: string
  title: string
  description: string
  icon: string
  niche: string
  zipCode: string
  radius: number
  tips: string[]
  seasonalFactors: string[]
  avgLeadValue: number
}

export const CHARLESTON_PERSONAS: CharlestonPersona[] = [
  {
    id: 'downtown-plumber',
    title: 'Downtown Charleston Plumber',
    description: 'Target historic homes & tourist businesses',
    icon: '🔧',
    niche: 'plumbers',
    zipCode: '29401',
    radius: 3,
    tips: [
      'Historic homes need specialized pipe knowledge',
      'Tourist season (Mar-Oct) brings 40% more emergency calls',
      'Partner with property management companies on King Street'
    ],
    seasonalFactors: [
      'Hurricane season prep (Jun-Nov)',
      'Winter freeze warnings (rare but lucrative)',
      'Spring tourist influx'
    ],
    avgLeadValue: 500
  },
  {
    id: 'west-ashley-hvac',
    title: 'West Ashley HVAC Specialist',
    description: 'Suburban homes & shopping centers',
    icon: '❄️',
    niche: 'hvac',
    zipCode: '29407',
    radius: 5,
    tips: [
      'Target newer subdivisions with 10-15 year old systems',
      'Citadel Mall area businesses need commercial HVAC',
      'Maintenance contracts popular in Avondale/Byrnes Down'
    ],
    seasonalFactors: [
      'May-Sept peak AC season (70% annual revenue)',
      'Humidity issues year-round',
      'Pre-summer tune-up campaigns in April'
    ],
    avgLeadValue: 750
  },
  {
    id: 'folly-beach-restaurant',
    title: 'Folly Beach Restaurant Owner',
    description: 'Beach tourists & local seafood lovers',
    icon: '🍤',
    niche: 'restaurants',
    zipCode: '29439',
    radius: 2,
    tips: [
      '3M+ annual beach visitors = high foot traffic',
      'Seafood & beach casual dining most profitable',
      'Partner with vacation rental companies'
    ],
    seasonalFactors: [
      'Summer peak (May-Aug): 60% annual revenue',
      'Spring break surge (March)',
      'Off-season locals focus (Nov-Feb)'
    ],
    avgLeadValue: 250
  },
  {
    id: 'mt-pleasant-realtor',
    title: 'Mount Pleasant Real Estate Agent',
    description: 'Upscale homes & growing families',
    icon: '🏡',
    niche: 'real-estate',
    zipCode: '29464',
    radius: 4,
    tips: [
      'Focus on $500K-$1.5M family homes',
      'School districts are top selling point',
      'Tech workers relocating from Northeast'
    ],
    seasonalFactors: [
      'Spring market (Mar-May) hottest',
      'Back-to-school moves (Jul-Aug)',
      'Year-end tax planning purchases (Nov-Dec)'
    ],
    avgLeadValue: 3000
  },
  {
    id: 'park-circle-cafe',
    title: 'Park Circle Cafe Owner',
    description: 'Hip neighborhood, young professionals',
    icon: '☕',
    niche: 'cafes',
    zipCode: '29405',
    radius: 2,
    tips: [
      'Remote workers need WiFi & workspace',
      'Weekend brunch is 40% of revenue',
      'Partner with local breweries for events'
    ],
    seasonalFactors: [
      'Festival season brings crowds',
      'Summer slowdown when locals travel',
      'Holiday coffee gift sales (Nov-Dec)'
    ],
    avgLeadValue: 150
  },
  {
    id: 'james-island-landscaper',
    title: 'James Island Landscaping Pro',
    description: 'Residential yards & HOA contracts',
    icon: '🌳',
    niche: 'landscaping',
    zipCode: '29412',
    radius: 4,
    tips: [
      'HOA contracts provide steady revenue',
      'Palmetto trees & coastal plants specialty',
      'Hurricane cleanup services essential'
    ],
    seasonalFactors: [
      'Spring planting (Mar-May)',
      'Summer maintenance contracts',
      'Fall leaf removal & prep'
    ],
    avgLeadValue: 400
  },
  {
    id: 'summerville-electrician',
    title: 'Summerville Electrician',
    description: 'Growing suburbs & new construction',
    icon: '⚡',
    niche: 'electricians',
    zipCode: '29483',
    radius: 8,
    tips: [
      'New construction boom = wiring opportunities',
      'EV charger installations growing 50% YoY',
      'Generator sales spike during hurricane season'
    ],
    seasonalFactors: [
      'Hurricane prep (generator installs)',
      'Holiday lighting (Nov-Dec)',
      'Spring home improvement wave'
    ],
    avgLeadValue: 600
  },
  {
    id: 'kiawah-cleaning',
    title: 'Kiawah Island Cleaning Service',
    description: 'Luxury vacation rentals & second homes',
    icon: '🧹',
    niche: 'cleaning',
    zipCode: '29455',
    radius: 10,
    tips: [
      'Vacation rental turnovers = recurring revenue',
      'Premium pricing for luxury properties',
      'Partner with property management companies'
    ],
    seasonalFactors: [
      'Summer rental season peak',
      'Golf tournament deep cleans',
      'Holiday home prep (Nov-Dec)'
    ],
    avgLeadValue: 350
  }
]

export function getPersonaByNiche(niche: string): CharlestonPersona[] {
  return CHARLESTON_PERSONAS.filter(p =>
    p.niche.toLowerCase() === niche.toLowerCase()
  )
}

export function getPersonaById(id: string): CharlestonPersona | undefined {
  return CHARLESTON_PERSONAS.find(p => p.id === id)
}

export function getRecommendedPersona(
  niche?: string,
  zipCode?: string
): CharlestonPersona | undefined {
  if (niche && zipCode) {
    // Try exact match first
    const exactMatch = CHARLESTON_PERSONAS.find(p =>
      p.niche.toLowerCase() === niche.toLowerCase() &&
      p.zipCode === zipCode
    )
    if (exactMatch) return exactMatch

    // Then try niche match
    const nicheMatch = CHARLESTON_PERSONAS.find(p =>
      p.niche.toLowerCase() === niche.toLowerCase()
    )
    if (nicheMatch) return nicheMatch
  }

  // Default to first persona
  return CHARLESTON_PERSONAS[0]
}