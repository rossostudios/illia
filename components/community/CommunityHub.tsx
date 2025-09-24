'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Session, SupabaseClient } from '@supabase/supabase-js'
import type { InfiniteData } from '@tanstack/react-query'
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  CalendarCheck,
  ChevronRight,
  Clock,
  Copy,
  Flag,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Send,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState, useTransition } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  buildReactionSummary,
  type CommunityEventSummary,
  type MemberSummary,
  mapEvent,
  mapMember,
  mapPost,
  mapThread,
  type PostRow,
  type ThreadListItem,
  type ThreadPostRowWithAuthor,
  type ThreadRowWithAuthor,
} from '@/components/community/normalize'
import PolarCheckoutButton from '@/components/PolarCheckoutButton'
import { useSessionContext } from '@/components/SessionProvider'
import { useSupabaseBrowserClient } from '@/hooks/use-supabase-browser-client'

type CommunityHubProps = {
  session: Session | null
  locale: string
  initialThreads: ThreadListItem[]
  initialMembers: MemberSummary[]
  initialEvents: CommunityEventSummary[]
}

type ThreadsPage = {
  items: ThreadListItem[]
  nextPage?: number
  total: number
}

type MembersPage = {
  items: MemberSummary[]
  nextPage?: number
}

const THREADS_PAGE_SIZE = 12
const MEMBERS_PAGE_SIZE = 18

const threadSchema = z.object({
  title: z.string().min(6).max(140),
  body: z.string().min(12),
  category: z.string().min(1),
  cityTag: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
})

const replySchema = z.object({
  body: z.string().min(2),
})

export default function CommunityHub({
  session,
  locale,
  initialThreads,
  initialMembers,
  initialEvents,
}: CommunityHubProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {session ? (
        <CommunityHubAuthenticated
          initialEvents={initialEvents}
          initialMembers={initialMembers}
          initialThreads={initialThreads}
          session={session}
        />
      ) : (
        <CommunityHubTeaser locale={locale} />
      )}
    </QueryClientProvider>
  )
}

type AuthenticatedProps = {
  session: Session
  initialThreads: ThreadListItem[]
  initialMembers: MemberSummary[]
  initialEvents: CommunityEventSummary[]
}

function CommunityHubAuthenticated({
  session,
  initialThreads,
  initialMembers,
  initialEvents,
}: AuthenticatedProps) {
  const supabase = useSupabaseBrowserClient()
  const queryClient = useQueryClient()
  const { user } = useSessionContext()
  const t = useTranslations('community')
  const [selectedThread, setSelectedThread] = useState<ThreadListItem | null>(
    initialThreads[0] ?? null
  )
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    city: 'all',
  })
  const [isEventsDrawerOpen, setEventsDrawerOpen] = useState(false)
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [, startTransition] = useTransition()
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const updateStatus = () => setIsOffline(typeof navigator !== 'undefined' && !navigator.onLine)
    updateStatus()
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  const threadsInitialData: InfiniteData<ThreadsPage> = {
    pages: [
      {
        items: initialThreads,
        nextPage: initialThreads.length === THREADS_PAGE_SIZE ? 1 : undefined,
        total: initialThreads.length,
      },
    ],
    pageParams: [0],
  }

  const membersInitialData: InfiniteData<MembersPage> = {
    pages: [
      {
        items: initialMembers,
        nextPage: initialMembers.length === MEMBERS_PAGE_SIZE ? 1 : undefined,
      },
    ],
    pageParams: [0],
  }

  const threadsQuery = useInfiniteQuery({
    queryKey: ['community', 'threads', filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * THREADS_PAGE_SIZE
      const to = from + THREADS_PAGE_SIZE - 1
      let query = supabase
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
          `,
          { count: 'exact' }
        )
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false, nullsLast: false })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      if (filters.city !== 'all') {
        query = query.eq('city_tag', filters.city)
      }

      if (filters.search) {
        const searchPattern = `%${filters.search}%`
        query = query.or(`title.ilike.${searchPattern},body.ilike.${searchPattern}`)
      }

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      const items = (data ?? []).map((row) => mapThread(row as ThreadRowWithAuthor))

      return {
        items,
        nextPage: items.length === THREADS_PAGE_SIZE ? pageParam + 1 : undefined,
        total: count ?? items.length,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: threadsInitialData,
  })

  const membersQuery = useInfiniteQuery({
    queryKey: ['community', 'members'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = pageParam * MEMBERS_PAGE_SIZE
      const to = from + MEMBERS_PAGE_SIZE - 1
      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, full_name, avatar_url, city, tier, languages, onboarding_completed, created_at'
        )
        .order('onboarding_completed', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) {
        throw error
      }

      const items = (data ?? []).map(mapMember)

      return {
        items,
        nextPage: items.length === MEMBERS_PAGE_SIZE ? pageParam + 1 : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialData: membersInitialData,
  })

  const eventsQuery = useQuery({
    queryKey: ['community', 'events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_events')
        .select(
          'id, title, description, start_at, end_at, location, tags, capacity, attendees_count, host_id'
        )
        .order('start_at', { ascending: true })
        .gte('start_at', new Date().toISOString())
        .limit(24)

      if (error) {
        return initialEvents
      }

      return (data ?? initialEvents).map(mapEvent)
    },
    initialData: initialEvents,
  })

  const createThreadMutation = useMutation({
    mutationFn: async (input: z.infer<typeof threadSchema>) => {
      const { data, error } = await supabase
        .from('community_threads')
        .insert({
          title: input.title,
          body: input.body,
          category: input.category,
          // biome-ignore lint/style/useNamingConvention: Supabase column
          city_tag: input.cityTag ?? null,
          tags: input.tags ?? [],
          // biome-ignore lint/style/useNamingConvention: Supabase column
          user_id: session.user.id,
        })
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
        .single()

      if (error) {
        throw error
      }

      return mapThread(data as ThreadRowWithAuthor)
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['community', 'threads', filters] })

      const previous = queryClient.getQueryData<InfiniteData<ThreadsPage>>([
        'community',
        'threads',
        filters,
      ])

      const optimisticThread: ThreadListItem = {
        id: `optimistic-${Date.now()}`,
        title: input.title,
        body: input.body,
        category: input.category,
        cityTag: input.cityTag ?? null,
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
        viewsCount: 0,
        repliesCount: 0,
        isPinned: false,
        userId: session.user.id,
        author: {
          fullName: user?.user_metadata?.name ?? session.user.email ?? 'You',
          avatarUrl: user?.user_metadata?.avatar_url ?? null,
          tier: (user?.user_metadata?.tier as string | undefined) ?? 'member',
          city: user?.user_metadata?.city ?? null,
        },
      }

      queryClient.setQueryData<InfiniteData<ThreadsPage>>(
        ['community', 'threads', filters],
        (old) => {
          if (!old) {
            return old
          }
          const [firstPage, ...rest] = old.pages
          const updatedFirstPage: ThreadsPage = {
            ...firstPage,
            items: [optimisticThread, ...(firstPage?.items ?? [])],
            total: (firstPage?.total ?? firstPage?.items.length ?? 0) + 1,
          }
          return {
            ...old,
            pages: [updatedFirstPage, ...rest],
          }
        }
      )

      return { previous } as { previous: InfiniteData<ThreadsPage> | undefined }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<InfiniteData<ThreadsPage>>(
          ['community', 'threads', filters],
          context.previous
        )
      }
      toast.error('Unable to create thread. Please try again.')
    },
    onSuccess: (thread) => {
      toast.success('Thread published to the community')
      queryClient.invalidateQueries({ queryKey: ['community', 'threads'] })
      setSelectedThread(thread)
    },
  })

  const followMutation = useMutation({
    mutationFn: async (memberId: string) => {
      try {
        const { error } = await supabase.rpc('upsert_follow_relationship', {
          // biome-ignore lint/style/useNamingConvention: Supabase RPC parameter
          target_user_id: memberId,
        })
        if (error) {
          throw error
        }
      } catch (_error) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      return memberId
    },
    onSuccess: (_memberId) => {
      toast.success('Member followed – updates will appear in your feed.')
      queryClient.invalidateQueries({ queryKey: ['community', 'members'] })
      queryClient.invalidateQueries({ queryKey: ['community', 'notifications'] })
    },
    onError: () => {
      toast.error('Unable to follow this member right now.')
    },
  })

  const handleThreadInserted = useCallback(
    (thread: ThreadListItem) => {
      const matchesFilters =
        (filters.category === 'all' || thread.category === filters.category) &&
        (filters.city === 'all' || thread.cityTag === filters.city) &&
        (!filters.search ||
          thread.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          thread.body?.toLowerCase().includes(filters.search.toLowerCase()))

      if (matchesFilters) {
        queryClient.setQueryData<InfiniteData<ThreadsPage>>(
          ['community', 'threads', filters],
          (old) => {
            if (!old) {
              return old
            }
            const [firstPage, ...rest] = old.pages
            const updatedFirstPage: ThreadsPage = {
              ...firstPage,
              items: [thread, ...(firstPage?.items ?? [])],
              total: (firstPage?.total ?? firstPage?.items.length ?? 0) + 1,
            }
            return {
              ...old,
              pages: [updatedFirstPage, ...rest],
            }
          }
        )
      }

      setSelectedThread((current) => current ?? thread)

      toast(t('notifications.newThread', { defaultMessage: 'New community thread' }), {
        description: thread.title,
        action: {
          label: t('notifications.open', { defaultMessage: 'Open thread' }),
          onClick: () => setSelectedThread(thread),
        },
      })
    },
    [filters, queryClient, t]
  )

  const handlePostInserted = useCallback(
    (post: PostRow) => {
      if (selectedThread && post.threadId === selectedThread.id) {
        queryClient.invalidateQueries({ queryKey: ['community', 'thread', selectedThread.id] })
      }
    },
    [queryClient, selectedThread]
  )

  useCommunityRealtime({
    supabase,
    onThreadInserted: handleThreadInserted,
    onPostInserted: handlePostInserted,
  })

  const threadForm = useForm<z.infer<typeof threadSchema>>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      title: '',
      body: '',
      category: 'general',
      cityTag: 'medellin',
      tags: [],
    },
  })

  const replyForm = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { body: '' },
  })

  const postsQuery = useQuery({
    queryKey: ['community', 'thread', selectedThread?.id],
    enabled: !!selectedThread,
    queryFn: async () => {
      if (!selectedThread) {
        return []
      }
      const { data, error } = await supabase
        .from('thread_posts')
        .select(
          `
            id,
            thread_id,
            user_id,
            body,
            created_at,
            edited_at,
            author:profiles!thread_posts_user_id_fkey (
              full_name,
              avatar_url,
              tier
            ),
            reactions:thread_reactions(reaction, user_id)
          `
        )
        .eq('thread_id', selectedThread.id)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      return (data ?? []).map((rawPost) => {
        const postRow = rawPost as ThreadPostRowWithAuthor
        const base = mapPost(postRow)
        const reactions = buildReactionSummary(postRow.reactions, session.user.id)
        return {
          ...base,
          reactions,
        }
      }) as PostRow[]
    },
  })

  const createReplyMutation = useMutation({
    mutationFn: async (input: z.infer<typeof replySchema>) => {
      if (!selectedThread) {
        throw new Error('No thread selected')
      }
      const { data, error } = await supabase
        .from('thread_posts')
        .insert({
          // biome-ignore lint/style/useNamingConvention: Supabase column
          thread_id: selectedThread.id,
          // biome-ignore lint/style/useNamingConvention: Supabase column
          user_id: session.user.id,
          body: input.body,
        })
        .select(
          `
            id,
            thread_id,
            user_id,
            body,
            created_at,
            edited_at,
            author:profiles!thread_posts_user_id_fkey (
              full_name,
              avatar_url,
              tier
            )
          `
        )
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['community', 'thread', selectedThread?.id] })
      const previous = queryClient.getQueryData<PostRow[]>([
        'community',
        'thread',
        selectedThread?.id,
      ])

      const optimisticPost: PostRow = {
        id: `optimistic-${Date.now()}`,
        threadId: selectedThread?.id ?? '',
        userId: session.user.id,
        body: input.body,
        createdAt: new Date().toISOString(),
        editedAt: null,
        author: {
          fullName: user?.user_metadata?.name ?? session.user.email ?? 'You',
          avatarUrl: user?.user_metadata?.avatar_url ?? null,
          tier: (user?.user_metadata?.tier as string | undefined) ?? 'member',
        },
        reactions: [],
      }

      queryClient.setQueryData<PostRow[]>(['community', 'thread', selectedThread?.id], (old) => {
        if (!old) {
          return [optimisticPost]
        }
        return [...old, optimisticPost]
      })

      return { previous } as { previous: PostRow[] | undefined }
    },
    onError: (_error, _values, context) => {
      if (context?.previous) {
        queryClient.setQueryData<PostRow[]>(
          ['community', 'thread', selectedThread?.id],
          context.previous
        )
      }
      toast.error('Unable to send reply. Please try again.')
    },
    onSuccess: () => {
      toast.success('Reply posted')
      replyForm.reset({ body: '' })
      queryClient.invalidateQueries({ queryKey: ['community', 'threads'] })
      queryClient.invalidateQueries({ queryKey: ['community', 'thread', selectedThread?.id] })
    },
  })

  useEffect(() => {
    if (initialThreads.length > 0 && !selectedThread) {
      setSelectedThread(initialThreads[0])
    }
  }, [initialThreads, selectedThread])

  const threads = threadsQuery.data?.pages.flatMap((page) => page.items) ?? []
  const members = membersQuery.data?.pages.flatMap((page) => page.items) ?? []
  const events = eventsQuery.data ?? initialEvents
  let membersButtonLabel = t('members.actions.viewAll', { defaultMessage: 'View more creators' })
  if (membersQuery.isFetchingNextPage) {
    membersButtonLabel = t('loading.more', { defaultMessage: 'Loading…' })
  } else if (!membersQuery.hasNextPage) {
    membersButtonLabel = t('members.actions.exhausted', { defaultMessage: 'All creators loaded' })
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <main className="space-y-8">
            {isOffline && (
              <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700 text-sm shadow-sm dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-100">
                <span>You&apos;re offline. Realtime updates will sync once you reconnect.</span>
                <button
                  className="font-semibold text-xs underline"
                  onClick={() => window.location.reload()}
                  type="button"
                >
                  Reload
                </button>
              </div>
            )}
            <header className="flex flex-col gap-6 rounded-3xl bg-white/90 p-6 shadow-lg ring-1 ring-slate-100 backdrop-blur lg:flex-row lg:items-center lg:justify-between dark:bg-slate-900/70 dark:ring-slate-800/50">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 font-semibold text-teal-700 text-xs uppercase tracking-wide dark:bg-teal-900/40 dark:text-teal-200">
                  {t('badge', { defaultMessage: 'Illia community' })}
                </span>
                <div>
                  <h1 className="font-semibold text-3xl text-slate-900 tracking-tight dark:text-white">
                    {t('heading', { defaultMessage: 'Creator Community' })}
                  </h1>
                  <p className="mt-2 max-w-4xl text-slate-600 dark:text-slate-300">
                    {t('subheading', {
                      defaultMessage:
                        'Swap playbooks, ship new drops, and connect with founders building on Illia — the AI-powered collaboration tool for creators.',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <button
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 text-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900"
                  onClick={() => setEventsDrawerOpen(true)}
                  type="button"
                >
                  <CalendarCheck className="h-4 w-4" />
                  {t('quickLinks.events', { defaultMessage: 'Events & Spaces' })}
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2 font-semibold text-sm text-white shadow-sm transition hover:bg-teal-700"
                  onClick={() => threadForm.reset()}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  {t('actions.startThread', { defaultMessage: 'Start a thread' })}
                </button>
              </div>
            </header>

            <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-5 w-5 text-teal-500 dark:text-teal-300" />
                  <input
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pr-4 pl-12 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                    name="search"
                    onChange={(event) =>
                      startTransition(() =>
                        setFilters((prev) => ({ ...prev, search: event.target.value }))
                      )
                    }
                    placeholder={t('filters.search', {
                      defaultMessage: 'Search by title or keyword…',
                    })}
                    value={filters.search}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                    onChange={(event) =>
                      startTransition(() =>
                        setFilters((prev) => ({ ...prev, category: event.target.value }))
                      )
                    }
                    value={filters.category}
                  >
                    <option value="all">
                      {t('filters.categories.all', { defaultMessage: 'All topics' })}
                    </option>
                    <option value="general">
                      {t('filters.categories.general', { defaultMessage: 'General' })}
                    </option>
                    <option value="services">
                      {t('filters.categories.services', { defaultMessage: 'Services' })}
                    </option>
                    <option value="recommendations">
                      {t('filters.categories.recommendations', {
                        defaultMessage: 'Recommendations',
                      })}
                    </option>
                    <option value="expat-life">
                      {t('filters.categories.expat', { defaultMessage: 'Expat life' })}
                    </option>
                    <option value="housing">
                      {t('filters.categories.housing', { defaultMessage: 'Housing' })}
                    </option>
                    <option value="visa">
                      {t('filters.categories.visa', { defaultMessage: 'Visa' })}
                    </option>
                  </select>
                  <select
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
                    onChange={(event) =>
                      startTransition(() =>
                        setFilters((prev) => ({ ...prev, city: event.target.value }))
                      )
                    }
                    value={filters.city}
                  >
                    <option value="all">
                      {t('filters.cities.all', { defaultMessage: 'All cities' })}
                    </option>
                    <option value="medellin">Medellín</option>
                    <option value="florianopolis">Florianópolis</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {threadsQuery.isError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200">
                    We couldn&apos;t load threads. Check your connection or
                    <button
                      className="ml-1 underline"
                      onClick={() => threadsQuery.refetch()}
                      type="button"
                    >
                      retry now
                    </button>
                    .
                  </div>
                )}
                <AnimatePresence mode="popLayout">
                  {threads.map((thread) => (
                    <motion.article
                      animate={{ opacity: 1, y: 0 }}
                      className={`hover:-translate-y-1 rounded-2xl border border-transparent bg-white/90 p-6 shadow-sm transition-all hover:shadow-xl dark:bg-slate-900/70 ${
                        selectedThread?.id === thread.id
                          ? 'border border-teal-400/70 shadow-xl ring-1 ring-teal-300/40'
                          : 'border-slate-200 dark:border-slate-800/60'
                      }`}
                      exit={{ opacity: 0, y: -8 }}
                      initial={{ opacity: 0, y: 8 }}
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            {thread.isPinned && (
                              <span className="rounded-full bg-teal-100 px-2 py-0.5 font-medium text-teal-700 text-xs dark:bg-teal-900/40 dark:text-teal-200">
                                {t('labels.pinned', { defaultMessage: 'Pinned' })}
                              </span>
                            )}
                            {thread.category && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 text-xs dark:bg-gray-800 dark:text-gray-300">
                                {thread.category}
                              </span>
                            )}
                          </div>
                          <h2 className="mt-2 font-semibold text-lg text-slate-900 dark:text-slate-50">
                            {thread.title}
                          </h2>
                          <p className="mt-1 line-clamp-2 text-slate-600 text-sm dark:text-slate-300">
                            {thread.body}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-500 text-xs dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {thread.repliesCount ?? 0} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {thread.viewsCount ?? 0} views
                            </span>
                            {thread.cityTag && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {thread.cityTag}
                              </span>
                            )}
                            {thread.lastActivityAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDistanceToNow(parseISO(thread.lastActivityAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="hidden rounded-full border border-transparent p-2 text-teal-600 transition hover:border-teal-200 hover:bg-teal-50 md:block dark:hover:bg-teal-900/20"
                          onClick={() => setSelectedThread(thread)}
                          type="button"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
                {threadsQuery.hasNextPage && (
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-teal-200 px-4 py-3 font-medium text-sm text-teal-600 transition hover:border-teal-300 hover:bg-teal-50 dark:border-gray-800 dark:text-teal-200 dark:hover:bg-teal-900/20"
                    disabled={threadsQuery.isFetchingNextPage}
                    onClick={() => threadsQuery.fetchNextPage()}
                    type="button"
                  >
                    {threadsQuery.isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('loading.more', { defaultMessage: 'Loading more' })}
                      </>
                    ) : (
                      <>
                        {t('actions.loadMore', { defaultMessage: 'Load more threads' })}
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-teal-100/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <ThreadComposer
                form={threadForm}
                isSubmitting={createThreadMutation.isPending}
                onSubmit={(values) => createThreadMutation.mutate(values)}
              />
            </section>

            {selectedThread && (
              <section className="rounded-2xl border border-teal-100/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <ThreadDetail
                  isLoading={postsQuery.isLoading}
                  isSubmitting={createReplyMutation.isPending}
                  onSubmitReply={(values) => {
                    createReplyMutation.mutate(values)
                  }}
                  posts={postsQuery.data ?? []}
                  replyForm={replyForm}
                  thread={selectedThread}
                />
              </section>
            )}
          </main>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                  {t('members.heading', { defaultMessage: 'Member directory' })}
                </h2>
                <button
                  className="rounded-full border border-transparent p-2 text-teal-600 transition hover:border-teal-200 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                  onClick={() => membersQuery.refetch()}
                  type="button"
                >
                  <RefreshIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-slate-600 text-sm dark:text-slate-300">
                {t('members.subtitle', {
                  defaultMessage:
                    'Discover collaborators, DM founders, or spin up a project space together.',
                })}
              </p>
              <div className="mt-4 space-y-4">
                {membersQuery.isError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-xs dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200">
                    We couldn&apos;t load members right now. Try refreshing in a moment.
                  </div>
                )}
                {members.slice(0, 8).map((member) => (
                  <div className="flex items-center justify-between gap-3" key={member.id}>
                    <div className="flex items-center gap-3">
                      <Avatar name={member.fullName ?? 'Founders'} src={member.avatarUrl} />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm dark:text-slate-50">
                          {member.fullName ?? 'Illia member'}
                        </p>
                        <p className="text-slate-500 text-xs dark:text-slate-400">
                          {[member.city, member.tier]?.filter(Boolean).join(' • ') || 'Creator'}
                        </p>
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-1 rounded-full border border-teal-200 px-3 py-1 font-medium text-teal-600 text-xs transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-800 dark:text-teal-200 dark:hover:bg-teal-900/20"
                      disabled={followMutation.isPending}
                      onClick={() => followMutation.mutate(member.id)}
                      type="button"
                    >
                      <Sparkles className="h-3 w-3" />
                      {t('members.actions.follow', { defaultMessage: 'Follow' })}
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 inline-flex items-center gap-2 font-medium text-sm text-teal-600 transition hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={membersQuery.isFetchingNextPage || !membersQuery.hasNextPage}
                onClick={() => membersQuery.fetchNextPage()}
                type="button"
              >
                {membersButtonLabel}
                <ChevronRight className="h-4 w-4" />
              </button>
            </section>

            <div className="space-y-6">
              <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-teal-500" />
                  <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                    {t('notifications.heading', { defaultMessage: 'Live activity' })}
                  </h2>
                </div>
                <p className="mt-1 text-slate-600 text-sm dark:text-slate-300">
                  {t('notifications.subtitle', {
                    defaultMessage: 'Stay on top of new replies, DMs, and upcoming drops.',
                  })}
                </p>
                <button
                  className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-teal-50 to-white px-4 py-3 text-left font-medium text-sm text-teal-700 transition hover:border-teal-300 hover:from-teal-100 hover:to-white dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 dark:text-teal-200"
                  onClick={() => setNotificationsOpen(true)}
                  type="button"
                >
                  <span>
                    {t('notifications.openDrawer', { defaultMessage: 'Open notifications panel' })}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70">
                <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
                  {t('events.heading', { defaultMessage: 'Upcoming spaces' })}
                </h2>
                <p className="mt-1 text-slate-600 text-sm dark:text-slate-300">
                  {t('events.subtitle', {
                    defaultMessage: 'Reserve your spot for AMAs, workshops, and launch clinics.',
                  })}
                </p>
                <div className="mt-4 space-y-4">
                  {eventsQuery.isError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-xs dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-200">
                      Calendar data is temporarily unavailable. We&apos;ll restore it shortly.
                    </div>
                  )}
                  {events.slice(0, 3).map((event) => (
                    <div
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-teal-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
                      key={event.id}
                    >
                      <h3 className="font-semibold text-sm text-teal-700 dark:text-teal-200">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-teal-700/80 text-xs dark:text-teal-200/80">
                        {event.startAt
                          ? formatDistanceToNow(parseISO(event.startAt), { addSuffix: true })
                          : ''}
                        {event.location ? ` • ${event.location}` : ''}
                      </p>
                      <p className="mt-2 line-clamp-2 text-teal-700/80 text-xs dark:text-teal-100/80">
                        {event.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-3 py-1 font-semibold text-white text-xs shadow-sm transition hover:bg-teal-700"
                          type="button"
                        >
                          <CalendarCheck className="h-3 w-3" />
                          {t('events.actions.rsvp', { defaultMessage: 'RSVP' })}
                        </button>
                        <button
                          className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-3 py-1 font-semibold text-teal-600 text-xs transition hover:border-teal-300 hover:bg-teal-50 dark:border-teal-900/60 dark:text-teal-100 dark:hover:bg-teal-900/20"
                          type="button"
                        >
                          <Copy className="h-3 w-3" />
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-4 inline-flex items-center gap-2 font-medium text-sm text-teal-600 transition hover:text-teal-700"
                  onClick={() => setEventsDrawerOpen(true)}
                  type="button"
                >
                  {t('events.actions.viewAll', { defaultMessage: 'View full calendar' })}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <EventsDrawer
        events={events}
        isOpen={isEventsDrawerOpen}
        onClose={() => setEventsDrawerOpen(false)}
      />
      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  )
}

type ThreadComposerProps = {
  form: UseFormReturn<z.infer<typeof threadSchema>>
  onSubmit: (values: z.infer<typeof threadSchema>) => void
  isSubmitting: boolean
}

function ThreadComposer({ form, onSubmit, isSubmitting }: ThreadComposerProps) {
  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
          Share what you need help with
        </h2>
        <p className="text-slate-600 text-sm dark:text-slate-300">
          Start a thread to unlock playbooks, intros, and real-time support from the Illia crew.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label
            className="block font-medium text-slate-700 text-sm dark:text-slate-200"
            htmlFor="thread-title"
          >
            Thread title
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            id="thread-title"
            {...form.register('title')}
            placeholder="What are you shipping?"
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-red-500 text-xs">{form.formState.errors.title.message}</p>
          )}
        </div>
        <div>
          <label
            className="block font-medium text-slate-700 text-sm dark:text-slate-200"
            htmlFor="thread-category"
          >
            Topic
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            id="thread-category"
            {...form.register('category')}
          >
            <option value="general">General</option>
            <option value="services">Services</option>
            <option value="recommendations">Recommendations</option>
            <option value="expat-life">Expat life</option>
            <option value="housing">Housing</option>
            <option value="visa">Visa</option>
          </select>
        </div>
        <div>
          <label
            className="block font-medium text-slate-700 text-sm dark:text-slate-200"
            htmlFor="thread-city"
          >
            City context
          </label>
          <select
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            id="thread-city"
            {...form.register('cityTag')}
          >
            <option value="medellin">Medellín</option>
            <option value="florianopolis">Florianópolis</option>
            <option value="">Remote</option>
          </select>
        </div>
      </div>
      <div>
        <label
          className="block font-medium text-slate-700 text-sm dark:text-slate-200"
          htmlFor="thread-body"
        >
          What&apos;s the context?
        </label>
        <textarea
          className="mt-1 min-h-[140px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          id="thread-body"
          {...form.register('body')}
          placeholder="Share the details, blockers, and what kind of support/feedback you need."
        />
        {form.formState.errors.body && (
          <p className="mt-1 text-red-500 text-xs">{form.formState.errors.body.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 text-xs dark:text-slate-400">
          Pro tip: outline what you&apos;ve tried and tag collaborators you&apos;re looking for
          (legal, ops, GTM etc.).
        </p>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2 font-semibold text-sm text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Publish thread
        </button>
      </div>
    </form>
  )
}

type ThreadDetailProps = {
  thread: ThreadListItem
  posts: PostRow[]
  replyForm: UseFormReturn<z.infer<typeof replySchema>>
  onSubmitReply: (values: z.infer<typeof replySchema>) => void
  isLoading: boolean
  isSubmitting: boolean
}

function ThreadDetail({
  thread,
  posts,
  replyForm,
  onSubmitReply,
  isLoading,
  isSubmitting,
}: ThreadDetailProps) {
  return (
    <div>
      <header className="flex flex-col gap-3 border-slate-200 border-b pb-5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-200">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-50">
              {thread.title}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-slate-500 text-xs dark:text-slate-400">
              {thread.author?.fullName && <span>{thread.author.fullName}</span>}
              {thread.createdAt && (
                <span>{formatDistanceToNow(parseISO(thread.createdAt), { addSuffix: true })}</span>
              )}
              {thread.cityTag && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {thread.cityTag}
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="whitespace-pre-wrap text-slate-600 text-sm dark:text-slate-200">
          {thread.body}
        </p>
      </header>

      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm dark:text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading thread…
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/70"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 6 }}
                key={post.id}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={post.author?.fullName ?? 'Member'}
                      src={post.author?.avatarUrl ?? null}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm dark:text-gray-100">
                        {post.author?.fullName ?? 'Illia member'}
                      </p>
                      <p className="text-gray-500 text-xs dark:text-gray-400">
                        {formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true })}
                        {post.editedAt ? ' • edited' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-full border border-transparent p-1 text-gray-400 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20"
                      type="button"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded-full border border-transparent p-1 text-gray-400 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20"
                      type="button"
                    >
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-gray-700 text-sm dark:text-gray-200">
                  {post.body}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <form className="mt-6 space-y-3" onSubmit={replyForm.handleSubmit(onSubmitReply)}>
        <label
          className="block font-medium text-slate-700 text-sm dark:text-slate-200"
          htmlFor="reply-body"
        >
          Drop a reply
        </label>
        <textarea
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
          id="reply-body"
          {...replyForm.register('body')}
          placeholder="Share your tactics, resources, or intros to unblock this thread."
          rows={3}
        />
        {replyForm.formState.errors.body && (
          <p className="text-red-500 text-xs">{replyForm.formState.errors.body.message}</p>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-500 text-xs dark:text-slate-400">
            Replies trigger notifications for everyone following the thread.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 font-semibold text-sm text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            <Send className="h-4 w-4" />
            Reply
          </button>
        </div>
      </form>
    </div>
  )
}

type EventsDrawerProps = {
  isOpen: boolean
  events: CommunityEventSummary[]
  onClose: () => void
}

function EventsDrawer({ isOpen, events, onClose }: EventsDrawerProps) {
  if (!isOpen) {
    return null
  }
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur">
      <motion.aside
        animate={{ x: 0, opacity: 1 }}
        className="relative flex h-full w-full max-w-3xl flex-col gap-6 overflow-hidden bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200 backdrop-blur dark:bg-slate-950/95 dark:ring-slate-800"
        initial={{ x: 80, opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 text-xl dark:text-slate-50">
            Community events
          </h2>
          <button
            className="rounded-full border border-transparent p-2 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-slate-600 text-sm dark:text-slate-300">
          RSVP to live AMAs, workshops, co-working lounges, and testing sprints hosted by the Illia
          team and community operators.
        </p>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5">
            {events.map((event) => (
              <div
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950"
                key={event.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-lg text-teal-700 dark:text-teal-200">
                    {event.title}
                  </h3>
                  <span className="rounded-full bg-teal-100 px-3 py-1 font-semibold text-teal-700 text-xs dark:bg-teal-900/40 dark:text-teal-100">
                    {event.capacity
                      ? `${event.attendeesCount ?? 0}/${event.capacity} spots`
                      : 'Open'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-teal-700/80 dark:text-teal-100/80">
                  {event.startAt
                    ? formatDistanceToNow(parseISO(event.startAt), { addSuffix: true })
                    : ''}
                  {event.location ? ` • ${event.location}` : ''}
                </p>
                {event.description && (
                  <p className="mt-3 text-slate-600 text-sm dark:text-slate-300">
                    {event.description}
                  </p>
                )}
                {event.tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        className="rounded-full bg-white px-3 py-1 font-medium text-teal-600 text-xs ring-1 ring-teal-100 dark:bg-teal-900/30 dark:text-teal-100 dark:ring-teal-900/60"
                        key={tag}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2 font-semibold text-sm text-white shadow-sm transition hover:bg-teal-700"
                    type="button"
                  >
                    <CalendarCheck className="h-4 w-4" /> RSVP now
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-4 py-2 font-semibold text-sm text-teal-600 transition hover:border-teal-300 hover:bg-teal-50 dark:border-teal-900/60 dark:text-teal-100 dark:hover:bg-teal-900/20"
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                    Save to calendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.aside>
    </div>
  )
}

type NotificationsPanelProps = {
  isOpen: boolean
  onClose: () => void
}

function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  if (!isOpen) {
    return null
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur">
      <motion.aside
        animate={{ x: 0, opacity: 1 }}
        className="h-full w-full max-w-md overflow-y-auto bg-white/95 p-6 shadow-2xl ring-1 ring-slate-200 backdrop-blur dark:bg-slate-950/95 dark:ring-slate-800"
        initial={{ x: 64, opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-50">Notifications</h2>
          <button
            className="rounded-full border border-transparent p-2 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <NotificationCard
            description="Paula shared a new visa checklist for Medellín"
            timestamp="Just now"
            title="New thread"
          />
          <NotificationCard
            description="Launch Lab RSVP reminder — bring your beta for feedback"
            timestamp="15 minutes ago"
            title="Event reminder"
          />
          <NotificationCard
            description="Ariel started following you. Send a DM to kick off collaboration."
            timestamp="1 hour ago"
            title="New follower"
          />
        </div>
      </motion.aside>
    </div>
  )
}

type NotificationCardProps = {
  title: string
  description: string
  timestamp: string
}

function NotificationCard({ title, description, timestamp }: NotificationCardProps) {
  return (
    <div className="hover:-translate-y-0.5 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm dark:text-slate-50">{title}</h3>
        <span className="text-slate-500 text-xs dark:text-slate-400">{timestamp}</span>
      </div>
      <p className="mt-2 text-slate-600 text-sm dark:text-slate-300">{description}</p>
      <div className="mt-3 flex gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-3 py-1 font-medium text-teal-600 text-xs transition hover:border-teal-300 hover:bg-teal-50 dark:border-teal-900/60 dark:text-teal-100 dark:hover:bg-teal-900/20"
          type="button"
        >
          View
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-1 font-medium text-slate-500 text-xs transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20"
          type="button"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

function Avatar({ src, name }: { src: string | null | undefined; name: string }) {
  if (src) {
    return (
      <Image
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
        height={40}
        sizes="40px"
        src={src}
        width={40}
      />
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-sm text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
      {name?.[0]?.toUpperCase() ?? 'I'}
    </div>
  )
}

type TeaserProps = {
  locale: string
}

function CommunityHubTeaser({ locale }: TeaserProps) {
  const t = useTranslations('community_teaser')
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-white via-teal-50/40 to-white px-6 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-3xl rounded-3xl border border-teal-100 bg-white p-10 text-center shadow-xl dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
          <Users className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-bold text-3xl text-gray-900 dark:text-gray-100">
          {t('headline', { defaultMessage: 'Unlock the Illia creator collective' })}
        </h1>
        <p className="mt-4 text-gray-600 text-lg dark:text-gray-300">
          {t('description', {
            defaultMessage:
              'Collaborate with founders scaling AI-driven experiences across Medellín and Florianópolis. Access battle-tested playbooks, vetted operators, and live product labs.',
          })}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-semibold text-sm text-white transition hover:bg-teal-700"
            href={`/${locale}/signup`}
          >
            <Sparkles className="h-4 w-4" />
            {t('cta.join', { defaultMessage: 'Join Illia' })}
          </Link>
          <PolarCheckoutButton
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 px-6 py-3 font-semibold text-sm text-teal-600 transition hover:border-teal-300 hover:bg-teal-50"
            productType="settler"
          >
            <Users className="h-4 w-4" />
            {t('cta.membership', { defaultMessage: 'Explore membership' })}
          </PolarCheckoutButton>
        </div>
        <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
          <TeaserStat
            description={t('stats.threads_desc', {
              defaultMessage: 'Playbooks posted in the last 90 days',
            })}
            label={t('stats.threads', { defaultMessage: 'Threads shipped' })}
            value="2.1k"
          />
          <TeaserStat
            description={t('stats.intros_desc', {
              defaultMessage: 'Warm intros between members this quarter',
            })}
            label={t('stats.intros', { defaultMessage: 'Operator intros' })}
            value="780"
          />
          <TeaserStat
            description={t('stats.events_desc', {
              defaultMessage: 'Strategy labs and AMAs hosted so far',
            })}
            label={t('stats.events', { defaultMessage: 'Live sessions' })}
            value="54"
          />
        </div>
      </div>
    </div>
  )
}

type TeaserStatProps = {
  label: string
  value: string
  description: string
}

function TeaserStat({ label, value, description }: TeaserStatProps) {
  return (
    <div className="rounded-2xl border border-teal-100 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <p className="font-medium text-sm text-teal-600 dark:text-teal-200">{label}</p>
      <p className="mt-2 font-semibold text-2xl text-gray-900 dark:text-gray-100">{value}</p>
      <p className="mt-2 text-gray-500 text-sm dark:text-gray-400">{description}</p>
    </div>
  )
}

type RealtimeConfig = {
  supabase: SupabaseClient<Database>
  onThreadInserted: (thread: ThreadListItem) => void
  onPostInserted: (post: PostRow) => void
}

function useCommunityRealtime({ supabase, onThreadInserted, onPostInserted }: RealtimeConfig) {
  useEffect(() => {
    const threadChannel = supabase
      .channel('community:threads-v2')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_threads' },
        (payload) => {
          onThreadInserted(mapThread(payload.new as ThreadRowWithAuthor))
        }
      )
      .subscribe()

    const postsChannel = supabase
      .channel('community:posts-v2')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'thread_posts' },
        (payload) => {
          onPostInserted(mapPost(payload.new as ThreadPostRowWithAuthor))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(threadChannel)
      supabase.removeChannel(postsChannel)
    }
  }, [supabase, onThreadInserted, onPostInserted])
}

function RefreshIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10" />
      <path d="M20.49 15a9 9 0 01-14.85 3.36L1 14" />
    </svg>
  )
}
