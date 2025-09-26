import type { Database } from '@/types/database'

type ThreadRow = Database['public']['Tables']['community_threads']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ThreadPostRow = Database['public']['Tables']['thread_posts']['Row']

export type ThreadRowWithAuthor = ThreadRow & {
  author?: ProfileRow | ProfileRow[] | null
}

export type ThreadPostRowWithAuthor = ThreadPostRow & {
  author?: ProfileRow | ProfileRow[] | null
  // biome-ignore lint/style/useNamingConvention: Supabase column naming
  reactions?: { reaction: string; user_id: string }[] | null
}

export type ThreadListItem = {
  id: string
  title: string
  body: string
  category: string
  cityTag: string | null
  createdAt: string | null
  lastActivityAt: string | null
  viewsCount: number
  repliesCount: number
  isPinned: boolean
  userId: string
  author?: {
    fullName: string | null
    avatarUrl: string | null
    tier: string | null
    city: string | null
  }
}

export type ReactionSummary = {
  reaction: string
  count: number
  userReacted: boolean
}

export type PostRow = {
  id: string
  threadId: string
  userId: string
  body: string
  createdAt: string
  editedAt: string | null
  author?: {
    fullName: string | null
    avatarUrl: string | null
    tier: string | null
  }
  reactions?: ReactionSummary[]
}

export type MemberSummary = {
  id: string
  fullName: string | null
  avatarUrl: string | null
  city: string | null
  tier: string | null
  languages: string[] | null
  onboardingCompleted: boolean | null
  createdAt: string | null
}

export type CommunityEventSummary = {
  id: string
  title: string
  description: string | null
  startAt: string
  endAt: string | null
  location: string | null
  tags: string[] | null
  capacity: number | null
  attendeesCount: number | null
  hostId: string | null
}

export function mapThread(row: ThreadRowWithAuthor): ThreadListItem {
  const authorRaw = Array.isArray(row.author) ? row.author?.[0] : row.author
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    cityTag: row.city_tag ?? null,
    createdAt: row.created_at,
    lastActivityAt: row.last_activity_at,
    viewsCount: row.views_count ?? 0,
    repliesCount: row.replies_count ?? 0,
    isPinned: Boolean(row.is_pinned),
    userId: row.user_id,
    author: authorRaw
      ? {
          fullName: authorRaw.full_name ?? null,
          avatarUrl: authorRaw.avatar_url ?? null,
          tier: authorRaw.tier ?? null,
          city: authorRaw.city ?? null,
        }
      : undefined,
  }
}

export function mapPost(row: ThreadPostRowWithAuthor): PostRow {
  const authorRaw = Array.isArray(row.author) ? row.author?.[0] : row.author
  return {
    id: row.id,
    threadId: row.thread_id || '',
    userId: row.user_id || '',
    body: row.body,
    createdAt: row.created_at || '',
    editedAt: row.edited_at,
    author: authorRaw
      ? {
          fullName: authorRaw.full_name ?? null,
          avatarUrl: authorRaw.avatar_url ?? null,
          tier: authorRaw.tier ?? null,
        }
      : undefined,
    reactions: [],
  }
}

export function buildReactionSummary(
  // biome-ignore lint/style/useNamingConvention: Supabase column naming
  reactions: { reaction: string; user_id: string }[] | null | undefined,
  currentUserId?: string
): ReactionSummary[] {
  if (!reactions || reactions.length === 0) {
    return []
  }

  const grouped = new Map<string, ReactionSummary>()

  for (const reaction of reactions) {
    const existing = grouped.get(reaction.reaction)
    if (existing) {
      existing.count += 1
      if (currentUserId && reaction.user_id === currentUserId) {
        existing.userReacted = true
      }
    } else {
      grouped.set(reaction.reaction, {
        reaction: reaction.reaction,
        count: 1,
        userReacted: currentUserId ? reaction.user_id === currentUserId : false,
      })
    }
  }

  return Array.from(grouped.values())
}

export function mapMember(row: Database['public']['Tables']['profiles']['Row']): MemberSummary {
  return {
    id: row.id,
    fullName: row.full_name ?? null,
    avatarUrl: row.avatar_url ?? null,
    city: row.city ?? null,
    tier: row.tier ?? null,
    languages: row.languages ?? null,
    onboardingCompleted: row.onboarding_complete ?? null,
    createdAt: row.created_at,
  }
}

export function mapEvent(row: Record<string, unknown>): CommunityEventSummary {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    startAt: (row.start_at as string) ?? (row.startAt as string) ?? '',
    endAt: (row.end_at as string | null) ?? (row.endAt as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    tags: (row.tags as string[] | null) ?? null,
    capacity: (row.capacity as number | null) ?? null,
    attendeesCount: (row.attendees_count as number | null) ?? (row.attendeesCount as number | null) ?? null,
    hostId: (row.host_id as string | null) ?? (row.hostId as string | null) ?? null,
  }
}
