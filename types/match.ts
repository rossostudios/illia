export type MatchProvider = {
  name: string
  service: string
  location: string
  rating: number
  reviews: number
  hourlyRate: number
  image: string
  languages: string[]
  verified: boolean
  experience: string
}

export type TimelineEvent = {
  date: string
  event: string
  type: 'request' | 'view' | 'response' | 'contact' | 'hire'
}

export type Note = {
  date: string
  content: string
}

export type Match = {
  id: number
  provider: MatchProvider
  status: 'pending' | 'contacted' | 'hired' | 'archived' | 'declined'
  introRequested: string
  lastContact: string | null
  hiredDate?: string
  declinedDate?: string
  notes: Note[]
  timeline: TimelineEvent[]
}

export const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: 'Clock',
    description: 'Waiting for response',
  },
  contacted: {
    label: 'Contacted',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    icon: 'MessageSquare',
    description: 'In conversation',
  },
  hired: {
    label: 'Hired',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    icon: 'CheckCircle',
    description: 'Service active',
  },
  archived: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    icon: 'Archive',
    description: 'Past service',
  },
  declined: {
    label: 'Declined',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    icon: 'X',
    description: 'Not proceeding',
  },
}
