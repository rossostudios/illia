#!/usr/bin/env node

import { config } from 'dotenv'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

// Load environment variables
config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function generateTypes() {
  console.log('🔧 Generating TypeScript types from Supabase schema...')

  if (!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    console.log('\n📝 To generate types manually:')
    console.log('1. Go to your Supabase project dashboard')
    console.log('2. Navigate to Settings > API')
    console.log('3. Copy the service role key')
    console.log('4. Add to .env: SUPABASE_SERVICE_ROLE_KEY=your_key')
    process.exit(1)
  }

  try {
    // Extract project ref from URL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

    if (!projectRef) {
      console.error('❌ Could not extract project ref from SUPABASE_URL')
      process.exit(1)
    }

    console.log(`📦 Project: ${projectRef}`)

    // Generate types using Supabase CLI
    const command = `npx supabase gen types typescript --project-id ${projectRef} --schema public`

    console.log('⏳ Running type generation...')
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    if (stderr && !stderr.includes('Warning')) {
      console.error('⚠️ Warnings:', stderr)
    }

    // Write the generated types to file
    const outputPath = path.join(process.cwd(), 'utils', 'database.types.ts')
    fs.writeFileSync(outputPath, stdout)

    console.log(`✅ Types generated successfully at: ${outputPath}`)

    // Also create a types file with additional custom types
    const customTypesContent = `// Custom type extensions for the application
import type { Database } from '@/utils/database.types'

// Re-export database types
export type { Database }

// Table row types
export type User = Database['public']['Tables']['users']['Row']
export type ServiceProvider = Database['public']['Tables']['service_providers']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type CommunityThread = Database['public']['Tables']['community_threads']['Row']
export type DirectMessage = Database['public']['Tables']['direct_messages']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type ServiceProviderInsert = Database['public']['Tables']['service_providers']['Insert']
export type MatchInsert = Database['public']['Tables']['matches']['Insert']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type ServiceProviderUpdate = Database['public']['Tables']['service_providers']['Update']
export type MatchUpdate = Database['public']['Tables']['matches']['Update']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// Enum types
export type UserTier = Database['public']['Enums']['user_tier']
export type ProviderStatus = Database['public']['Enums']['provider_status']
export type BookingStatus = Database['public']['Enums']['booking_status']
export type ThreadCategory = Database['public']['Enums']['thread_category']
export type IntroStatus = Database['public']['Enums']['intro_status']

// Extended types with relationships
export interface MatchWithProvider extends Match {
  provider: ServiceProvider
}

export interface BookingWithDetails extends Booking {
  user: User
  provider: ServiceProvider
}

export interface ReviewWithUser extends Review {
  user: User
}

export interface ThreadWithAuthor extends CommunityThread {
  user: User
  replies?: ThreadReply[]
}

export interface ThreadReply {
  id: string
  thread_id: string
  user_id: string
  body: string
  created_at: string
  user: User
}

export interface ConversationWithParticipants {
  id: string
  last_message_at: string | null
  last_message_preview: string | null
  participants: User[]
  unread_count: number
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Filter types
export interface ProviderFilters {
  search?: string
  service?: string
  location?: string
  city?: string
  rating?: number
  verified?: boolean
  limit?: number
  offset?: number
}

export interface MatchFilters {
  dismissed?: boolean
  viewed?: boolean
  service?: string
  search?: string
}

export interface BookingFilters {
  status?: BookingStatus
  dateFrom?: Date
  dateTo?: Date
  providerId?: string
}

// Form types
export interface BookingFormData {
  provider_id: string
  service_type: string
  booking_date: string
  booking_time: string
  duration_minutes: number
  notes?: string
  location?: string
  address?: string
}

export interface ReviewFormData {
  provider_id: string
  rating: number
  comment?: string
  services_used: string[]
  would_recommend: boolean
}

// Analytics types
export interface AnalyticsEvent {
  event_name: string
  event_category?: string
  event_properties?: Record<string, any>
  page_path?: string
  page_title?: string
}

// Notification types
export interface NotificationData {
  type: 'match' | 'booking' | 'message' | 'review' | 'system'
  title: string
  message: string
  data?: Record<string, any>
}
`

    const customTypesPath = path.join(process.cwd(), 'types', 'database-extended.ts')
    fs.writeFileSync(customTypesPath, customTypesContent)
    console.log(`✅ Custom types created at: ${customTypesPath}`)

    // Update the main database.ts to use the extended types
    const mainTypesContent = `// Re-export all database types from the generated and extended files

export type { Database as default } from '@/utils/database.types'
export * from '@/utils/database.types'
export * from './database-extended'
`

    const mainTypesPath = path.join(process.cwd(), 'types', 'database.ts')
    fs.writeFileSync(mainTypesPath, mainTypesContent)
    console.log(`✅ Main types file updated at: ${mainTypesPath}`)

    console.log('\n✨ Type generation complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Review the generated types in utils/database.types.ts')
    console.log('2. Check custom types in types/database-extended.ts')
    console.log('3. Update any components using old type definitions')
  } catch (error: any) {
    console.error('❌ Failed to generate types:', error.message)

    console.log('\n📝 Alternative method:')
    console.log('Run this command directly:')
    console.log(`npx supabase gen types typescript --project-id YOUR_PROJECT_ID > utils/database.types.ts`)

    process.exit(1)
  }
}

// Run the script
generateTypes().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})