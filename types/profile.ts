export type UserProfile = {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  city: string
  services: string[]
  budget: [number, number]
  tier: 'free' | 'premium' | 'professional'
  matchesUsed: number
  matchesLimit: number
  language: string
  notifications: {
    email: boolean
    matches: boolean
    forum: boolean
    marketing: boolean
  }
  privacy: {
    discoverable: boolean
    showInForums: boolean
    shareLocation: boolean
  }
  joinDate: string
  billingHistory: Array<{
    date: string
    amount: string
    description: string
  }>
}

export const SERVICES = [
  { id: 'cleaning', label: 'House Cleaning', icon: 'Home' },
  { id: 'cooking', label: 'Cooking', icon: 'Utensils' },
  { id: 'meal-prep', label: 'Meal Prep', icon: 'Utensils' },
  { id: 'laundry', label: 'Laundry', icon: 'Home' },
  { id: 'organization', label: 'Organization', icon: 'Home' },
]

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
]
