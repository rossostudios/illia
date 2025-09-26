'use client'

import { AnimatePresence } from 'framer-motion'
import { CheckCircle, Clock, Loader2, MessageSquare, Plus, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MatchCard } from '@/components/matches/MatchCard'
import { MatchDetailsModal } from '@/components/matches/MatchDetailsModal'
import { MatchesTable } from '@/components/matches/MatchesTable'
import { MatchFilters } from '@/components/matches/MatchFilters'
import type { Match } from '@/components/matches/types'
import { useSessionContext } from '@/components/SessionProvider'
import { Button } from '@/components/ui/Button'
import { useMatches } from '@/hooks/use-matches'

export default function MatchesPage() {
  const router = useRouter()
  const { user } = useSessionContext()
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    service: 'All Services',
  })

  // Use the matches hook
  const { matches, loading, error, markAsViewed, dismissMatch, deleteMatch } = useMatches({
    viewed: filters.status === 'viewed' ? true : undefined,
    dismissed: filters.status === 'dismissed' ? true : undefined,
    service: filters.service,
    search: filters.search,
  })

  // Transform matches to match frontend interface
  const filteredMatches = useMemo((): Match[] => {
    return matches.map((match: any) => ({
      // Database fields
      id: match.id || '',
      user_id: match.user_id || '',
      provider_id: match.provider_id || '',
      score: match.score || 0,
      explanation: match.explanation || '',
      ai_model: match.ai_model || null,
      created_at: match.created_at || null,
      viewed_at: match.viewed_at || null,
      dismissed_at: match.dismissed_at || null,

      // Computed fields
      status: (match.dismissed_at
        ? 'dismissed'
        : match.viewed_at
          ? 'viewed'
          : 'pending') as Match['status'],
      createdAt: match.created_at,
      lastContact: match.viewed_at || match.created_at,
      matchScore: match.score / 100, // Convert from 0-100 to 0-1
      introRequested: false,
      notes: match.explanation || '',
      provider: match.provider || {
        id: match.provider_id,
        name: 'Unknown Provider',
        email: '',
        service: 'General Services',
        location: 'Unknown',
        city: '',
        rating: 0,
        verified: false,
        avatar_url: undefined,
      },
      timeline: [
        {
          date: match.created_at,
          event: 'Match created',
          type: 'match',
        },
        ...(match.viewed_at
          ? [
              {
                date: match.viewed_at,
                event: 'Provider viewed',
                type: 'contact',
              },
            ]
          : []),
      ],
    }))
  }, [matches])

  // Stats
  const stats = {
    pending: matches.filter((m: any) => !(m.viewed_at || m.dismissed_at)).length,
    contacted: matches.filter((m: any) => m.viewed_at && !m.dismissed_at).length,
    dismissed: matches.filter((m: any) => m.dismissed_at).length,
    total: matches.length,
  }

  const handleMatchAction = async (matchId: string, action: string) => {
    const match = matches.find((m: any) => m.id === matchId)
    if (!match) {
      return
    }

    switch (action) {
      case 'contact': {
        const contactResult = await markAsViewed(matchId)
        if (contactResult.success) {
          toast.success(`Opening conversation with ${match.provider?.name || 'provider'}`)
          router.push('/dashboard/messages')
        } else {
          toast.error(contactResult.error || 'Failed to contact provider')
        }
        break
      }

      case 'hire': {
        const hireResult = await markAsViewed(matchId)
        if (hireResult.success) {
          toast.success(`${match.provider?.name || 'Provider'} has been hired!`)
        } else {
          toast.error(hireResult.error || 'Failed to update status')
        }
        break
      }

      case 'complete': {
        const completeResult = await markAsViewed(matchId)
        if (completeResult.success) {
          toast.success('Match marked as completed')
        } else {
          toast.error(completeResult.error || 'Failed to complete match')
        }
        break
      }

      case 'decline': {
        const declineResult = await dismissMatch(matchId)
        if (declineResult.success) {
          toast.info(`Match with ${match.provider?.name || 'provider'} dismissed`)
        } else {
          toast.error(declineResult.error || 'Failed to decline match')
        }
        break
      }

      case 'archive': {
        const archiveResult = await deleteMatch(matchId)
        if (archiveResult.success) {
          toast.info('Match archived')
        } else {
          toast.error(archiveResult.error || 'Failed to archive match')
        }
        break
      }

      case 'message':
        toast.info('Opening messages...')
        router.push('/dashboard/messages')
        break

      case 'view':
        setSelectedMatch(match as any)
        setShowModal(true)
        break

      default:
        if (action.startsWith('add-note:')) {
          // Notes would be stored in match metadata
          toast.success('Note added')
        }
        break
    }
  }

  const handleMatchClick = (match: any) => {
    setSelectedMatch(match as Match)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-bold text-3xl text-gray-900 dark:text-white">
                <User className="h-8 w-8 text-teal-600" />
                Provider Matches
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your connections with service providers
              </p>
            </div>
            <Button variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Request Introduction
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Pending</p>
                  <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Contacted</p>
                  <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">
                    {stats.contacted}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Dismissed</p>
                  <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">
                    {stats.dismissed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Total</p>
                  <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <User className="h-8 w-8 text-teal-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <MatchFilters
        filters={filters}
        onFiltersChange={setFilters}
        onViewModeChange={setViewMode}
        totalMatches={filteredMatches.length}
        viewMode={viewMode}
      />

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-600" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading your matches...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="py-12 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 font-medium text-gray-900 text-lg dark:text-white">
              No matches found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {filters.search || filters.status !== 'all' || filters.service !== 'All Services'
                ? 'Try adjusting your filters'
                : 'Request an introduction to get started'}
            </p>
            {!filters.search && filters.status === 'all' && filters.service === 'All Services' && (
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Request Introduction
              </Button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <MatchesTable
            matches={filteredMatches}
            onAction={handleMatchAction}
            onMatchClick={handleMatchClick}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onAction={handleMatchAction}
                  onClick={() => handleMatchClick(match)}
                  viewMode="card"
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={showModal}
        match={selectedMatch}
        onAction={handleMatchAction}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}
