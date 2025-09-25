// Match types that align with database schema
export interface Match {
  id: string // Database uses string IDs
  user_id: string
  provider_id: string
  score: number
  explanation: string
  ai_model: string | null
  created_at: string | null
  viewed_at: string | null
  dismissed_at: string | null

  // Computed/display properties
  status: 'pending' | 'contacted' | 'hired' | 'dismissed' | 'viewed'
  createdAt: string | null
  lastContact: string | null
  matchScore: number
  introRequested: boolean
  notes: string

  // Nested provider data
  provider: {
    id: string
    name: string
    email: string
    service: string
    location: string
    city: string
    rating: number
    verified: boolean
    avatar_url?: string
  }

  // Timeline for UI
  timeline: Array<{
    date: string | null
    event: string
    type: string
  }>
}

export type MatchAction = 'contact' | 'save' | 'view' | 'dismiss' | 'delete' | 'hire' | 'message'
