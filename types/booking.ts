export type Booking = {
  id: string
  user_id: string
  provider_id: string
  service_type: string[]
  booking_date: string
  start_time: string
  end_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'rescheduled'
  hourly_rate: number
  total_amount: number
  currency: string
  payment_status: string
  is_recurring: boolean
  recurring_pattern?: Record<string, unknown>
  special_instructions?: string
  location_details?: Record<string, unknown>
  cancellation_fee?: number
  cancelled_at?: string
  cancellation_reason?: string
  created_at: string
  user?: {
    id: string
    name: string
    email: string
    avatar_url?: string
  }
  provider?: {
    id: string
    name: string
    email: string
    phone?: string
    whatsapp?: string
    photo_url?: string
  }
  booking_reviews?: {
    rating: number
    review_text: string
  }[]
}

export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
  rescheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

export const statusIcons = {
  pending: 'Clock',
  confirmed: 'CheckCircle',
  cancelled: 'X',
  completed: 'Check',
  no_show: 'AlertCircle',
  rescheduled: 'RefreshCw',
}
