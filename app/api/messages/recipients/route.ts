import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

type RecipientRow = {
  id: string
  email: string | null
  name: string | null
  city: string | null
  tier: string | null
  specialties?: string[] | null
  services?: string[] | null
  languages?: string[] | null
  bio?: string | null
}

type RecipientResponse = {
  id: string
  name: string
  email: string | null
  city: string | null
  tier: string | null
  avatar_url: string | null
  languages: string[]
  services: string[]
  specialties: string[]
  bio: string | null
  rating_avg: number | null
  reviews_count: number | null
  status: string | null
}

function sanitizeSearchTerm(term: string) {
  return term.replace(/%/g, '\\%').replace(/_/g, '\\_')
}

function normalize(value: string | null | undefined) {
  return value?.toLowerCase() ?? null
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') ?? undefined
  const query = searchParams.get('q')?.trim() ?? ''
  const limitParam = Number.parseInt(searchParams.get('limit') || '20', 10)
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20

  const supabase = await createServiceClient()

  try {
    if (id) {
      const recipients = await fetchRecipientsByIds(supabase, [id])
      const record = recipients[0]
      if (!record) {
        return NextResponse.json({ recipient: null }, { status: 404 })
      }
      return NextResponse.json({ recipient: record })
    }

    const recipients = await searchRecipients(supabase, query, limit)
    return NextResponse.json({ recipients })
  } catch (error) {
    console.error('[api/messages/recipients] error', error)
    return NextResponse.json({ error: 'Unable to load recipients' }, { status: 500 })
  }
}

async function searchRecipients(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  query: string,
  limit: number
) {
  let usersQuery = supabase
    .from('users')
    .select(
      'id, email, name, city, tier, approval_status, is_provider, is_deleted, specialties, services, languages, bio'
    )
    .eq('is_provider', true)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (query) {
    const escaped = sanitizeSearchTerm(query)
    usersQuery = usersQuery.or(`name.ilike.%${escaped}%,email.ilike.%${escaped}%`)
  }

  const { data: userRows, error } = await usersQuery
  if (error) {
    throw error
  }

  if (!userRows || userRows.length === 0) {
    return [] as RecipientResponse[]
  }

  return mergeRecipientDetails(supabase, userRows)
}

async function fetchRecipientsByIds(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  ids: string[]
) {
  if (ids.length === 0) {
    return [] as RecipientResponse[]
  }

  const { data: userRows, error } = await supabase
    .from('users')
    .select(
      'id, email, name, city, tier, approval_status, is_provider, is_deleted, specialties, services, languages, bio'
    )
    .in('id', ids)

  if (error) {
    throw error
  }

  if (!userRows || userRows.length === 0) {
    return [] as RecipientResponse[]
  }

  return mergeRecipientDetails(supabase, userRows)
}

async function mergeRecipientDetails(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  users: RecipientRow[]
): Promise<RecipientResponse[]> {
  const ids = users.map((u) => u.id)
  const emails = users.map((u) => normalize(u.email)).filter(Boolean) as string[]

  const [profilesRes, providersRes] = await Promise.all([
    ids.length
      ? supabase.from('profiles').select('id, full_name, avatar_url, city, languages').in('id', ids)
      : Promise.resolve({ data: [], error: null }),
    emails.length
      ? supabase
          .from('service_providers')
          .select(
            'email, name, bio, city, languages, services, specialties, rate_hourly, rate_monthly, rating_avg, reviews_count, avatar_url, status'
          )
          .in('email', emails)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (profilesRes.error) {
    throw profilesRes.error
  }
  if (providersRes.error) {
    throw providersRes.error
  }

  const profilesById = new Map(
    (profilesRes.data ?? []).map((profile: any) => [profile.id, profile])
  )
  const providersByEmail = new Map(
    (providersRes.data ?? []).map((provider: any) => [normalize(provider.email), provider])
  )

  return users.map((user) => {
    const profile = profilesById.get(user.id) as any
    const provider = providersByEmail.get(normalize(user.email)) as any

    const languages = provider?.languages || profile?.languages || user.languages || []
    const services = provider?.services || user.services || []
    const specialties = provider?.specialties || user.specialties || []

    const displayName =
      user.name ||
      profile?.full_name ||
      provider?.name ||
      user.email?.split('@')[0] ||
      'Illia provider'

    return {
      id: user.id,
      name: displayName,
      email: user.email,
      city: provider?.city || profile?.city || user.city,
      tier: user.tier,
      avatar_url: provider?.avatar_url || profile?.avatar_url || null,
      languages,
      services,
      specialties,
      bio: provider?.bio || user.bio || null,
      rating_avg: provider?.rating_avg ?? null,
      reviews_count: provider?.reviews_count ?? null,
      status: provider?.status ?? null,
    }
  })
}
