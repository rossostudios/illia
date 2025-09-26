import { unstable_noStore as noStore } from 'next/cache'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import CommunityHub from '@/components/community/CommunityHub'
import {
  type CommunityEventSummary,
  type MemberSummary,
  mapMember,
  mapThread,
  type ThreadListItem,
  type ThreadRowWithAuthor,
} from '@/components/community/normalize'
import { createClient } from '@/lib/supabase/server'

type CommunityPageProps = {
  params: Promise<{ locale: string }>
}

function FallbackPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-teal-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <output aria-live="polite" className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-12 w-12 animate-spin rounded-full border-teal-600 border-b-2"
        />
        <span className="sr-only">Loading</span>
      </output>
    </div>
  )
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  noStore()
  const { locale } = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!locale) {
    notFound()
  }

  const [threads, members, events] = await Promise.all([
    fetchInitialThreads(supabase),
    fetchFeaturedMembers(supabase),
    fetchUpcomingEvents(supabase),
  ])

  return (
    <Suspense fallback={<FallbackPlaceholder />}>
      <CommunityHub
        initialEvents={events}
        initialMembers={members}
        initialThreads={threads}
        locale={locale}
        session={session ?? null}
      />
    </Suspense>
  )
}

async function fetchInitialThreads(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<ThreadListItem[]> {
  const { data, error } = await supabase
    .from('community_threads')
    .select(
      `
        id,
        title,
        body,
        category,
        city_tag,
        created_at,
        last_activity_at,
        views_count,
        replies_count,
        is_pinned,
        user_id,
        author:profiles!community_threads_user_id_fkey (
          full_name,
          avatar_url,
          tier,
          city
        )
      `
    )
    .order('is_pinned', { ascending: false })
    .order('last_activity_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    return []
  }

  return (data ?? []).map((row) => mapThread(row as any))
}

async function fetchFeaturedMembers(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<MemberSummary[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('onboarding_completed', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(24)

  if (error) {
    return []
  }

  return (data ?? []).map(mapMember)
}

async function fetchUpcomingEvents(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<CommunityEventSummary[]> {
  // Community events table now exists, fetch real data
  try {
    const { data, error } = await supabase
      .from('community_events')
      .select(
        'id, title, description, start_at, end_at, host_id, location, tags, capacity, attendees_count'
      )
      .order('start_at', { ascending: true })
      .gte('start_at', new Date().toISOString())
      .limit(12)

    if (error) {
      return buildFallbackEvents()
    }

    const mapped = ((data ?? []) as Array<{
      id: string
      title: string
      description: string | null
      start_at: string
      end_at: string
      host_id: string | null
      location: string | null
      tags: string[] | null
      capacity: number | null
      attendees_count: number | null
    }>).map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description || null,
      startAt: event.start_at,
      endAt: event.end_at || null,
      location: event.location || null,
      tags: event.tags || [],
      capacity: event.capacity || null,
      attendeesCount: event.attendees_count || 0,
      hostId: event.host_id || null,
      isOnline: false,
      meetingLink: null,
    }))
    return mapped.length > 0 ? mapped : buildFallbackEvents()
  } catch (_error) {
    return buildFallbackEvents()
  }
}

function buildFallbackEvents(): CommunityEventSummary[] {
  const now = new Date()
  return [1, 2, 3].map((offset) => {
    const start = new Date(now)
    start.setDate(start.getDate() + offset * 3)
    start.setHours(17, 0, 0, 0)
    const end = new Date(start)
    end.setHours(start.getHours() + 1)
    let title = 'Launch Lab: Feedback Friday'
    if (offset === 1) {
      title = 'Community AMA: Scaling AI-driven Collaboration'
    } else if (offset === 2) {
      title = 'Creator Circle: Workflow Show & Tell'
    }

    return {
      id: `placeholder-${offset}`,
      title,
      description:
        'Join fellow Illia creators to swap tactics, share wins, and get real-time support from the team.',
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      location: offset === 2 ? 'Virtual – Illia Spaces' : 'Illia Creator Studio, Medellín',
      tags: ['community', 'collaboration', offset === 3 ? 'feedback' : 'live'],
      capacity: 50,
      attendeesCount: offset * 7,
      hostId: null,
    }
  })
}
