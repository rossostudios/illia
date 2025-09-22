import { calculateEventBoost, getEventContext, getNicheEventBoost } from '@/lib/charleston-events'

export interface LeadScore {
  baseScore: number
  eventBoost: number
  finalScore: number
  intent: 'high' | 'medium' | 'low'
  eventContext?: string
  scoringFactors: string[]
}

export function calculateLeadScore(
  lead: {
    name: string
    niche?: string
    zipCode?: string
    hasWebsite?: boolean
    hasReviews?: boolean
    reviewCount?: number
    rating?: number
    lastUpdated?: Date
    socialPresence?: boolean
  }
): LeadScore {
  const scoringFactors: string[] = []
  let baseScore = 50 // Start at baseline

  // Website presence (important for digital readiness)
  if (lead.hasWebsite) {
    baseScore += 15
    scoringFactors.push('Has website (+15)')
  } else {
    baseScore -= 10
    scoringFactors.push('No website (-10)')
  }

  // Review signals (indicates active business)
  if (lead.hasReviews && lead.reviewCount) {
    if (lead.reviewCount > 50) {
      baseScore += 20
      scoringFactors.push(`Strong review presence (${lead.reviewCount} reviews, +20)`)
    } else if (lead.reviewCount > 10) {
      baseScore += 10
      scoringFactors.push(`Moderate reviews (${lead.reviewCount} reviews, +10)`)
    } else {
      baseScore += 5
      scoringFactors.push(`Few reviews (${lead.reviewCount} reviews, +5)`)
    }
  }

  // Rating quality
  if (lead.rating) {
    if (lead.rating >= 4.5) {
      baseScore += 10
      scoringFactors.push(`High rating (${lead.rating}★, +10)`)
    } else if (lead.rating >= 3.5) {
      baseScore += 5
      scoringFactors.push(`Good rating (${lead.rating}★, +5)`)
    } else {
      baseScore -= 5
      scoringFactors.push(`Low rating (${lead.rating}★, -5)`)
    }
  }

  // Recency (fresh data = higher intent)
  if (lead.lastUpdated) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - lead.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceUpdate < 30) {
      baseScore += 10
      scoringFactors.push('Recently updated (+10)')
    } else if (daysSinceUpdate < 90) {
      baseScore += 5
      scoringFactors.push('Updated within 90 days (+5)')
    }
  }

  // Social media presence
  if (lead.socialPresence) {
    baseScore += 8
    scoringFactors.push('Active social media (+8)')
  }

  // Apply Charleston event boost
  let eventBoost = 0
  let finalScore = baseScore

  if (lead.zipCode) {
    // Calculate event-based boost
    finalScore = calculateEventBoost(baseScore, lead.zipCode)
    eventBoost = finalScore - baseScore

    if (eventBoost > 0) {
      scoringFactors.push(`Event boost (+${eventBoost})`)
    }

    // Apply niche-specific multiplier if available
    if (lead.niche) {
      const nicheMultiplier = getNicheEventBoost(lead.niche, lead.zipCode)
      if (nicheMultiplier > 1.0) {
        const additionalBoost = Math.round(finalScore * (nicheMultiplier - 1))
        finalScore += additionalBoost
        eventBoost += additionalBoost
        scoringFactors.push(`${lead.niche} seasonal demand (+${additionalBoost})`)
      }
    }
  }

  // Ensure score is within bounds
  finalScore = Math.max(0, Math.min(100, finalScore))

  // Determine intent level
  let intent: 'high' | 'medium' | 'low'
  if (finalScore >= 85) {
    intent = 'high'
  } else if (finalScore >= 60) {
    intent = 'medium'
  } else {
    intent = 'low'
  }

  // Get event context if available
  const eventContext = lead.zipCode ? getEventContext(lead.zipCode) : undefined

  return {
    baseScore,
    eventBoost,
    finalScore,
    intent,
    eventContext: eventContext || undefined,
    scoringFactors
  }
}

// Batch scoring for multiple leads
export function scoreLeads<T extends Parameters<typeof calculateLeadScore>[0]>(
  leads: T[]
): (T & { score: LeadScore })[] {
  return leads.map(lead => ({
    ...lead,
    score: calculateLeadScore(lead)
  }))
}

// Filter leads by intent level
export function filterByIntent<T extends { score: LeadScore }>(
  leads: T[],
  minIntent: 'high' | 'medium' | 'low' = 'medium'
): T[] {
  const intentLevels = { high: 3, medium: 2, low: 1 }
  const minLevel = intentLevels[minIntent]

  return leads.filter(lead => intentLevels[lead.score.intent] >= minLevel)
}

// Sort leads by score
export function sortByScore<T extends { score: LeadScore }>(
  leads: T[],
  descending = true
): T[] {
  return [...leads].sort((a, b) => {
    const diff = a.score.finalScore - b.score.finalScore
    return descending ? -diff : diff
  })
}