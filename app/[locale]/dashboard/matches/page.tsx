'use client'

import { AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Archive,
  CheckCircle,
  Clock,
  MessageSquare,
  Plus,
  User,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MatchCard } from '@/components/matches/MatchCard'
import { MatchDetailsModal } from '@/components/matches/MatchDetailsModal'
import { MatchFilters } from '@/components/matches/MatchFilters'
import { Button } from '@/components/ui/Button'
import { MOCK_MATCHES } from '@/data/mock-matches'
import type { Match } from '@/types/match'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    service: 'All Services',
  })

  // Filter matches based on filters
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (
          !(
            match.provider.name.toLowerCase().includes(searchLower) ||
            match.provider.service.toLowerCase().includes(searchLower) ||
            match.provider.location.toLowerCase().includes(searchLower)
          )
        ) {
          return false
        }
      }

      // Status filter
      if (filters.status !== 'all' && match.status !== filters.status) {
        return false
      }

      // Service filter
      if (filters.service !== 'All Services' && !match.provider.service.includes(filters.service)) {
        return false
      }

      return true
    })
  }, [matches, filters])

  // Stats
  const stats = {
    pending: matches.filter((m) => m.status === 'pending').length,
    contacted: matches.filter((m) => m.status === 'contacted').length,
    hired: matches.filter((m) => m.status === 'hired').length,
    total: matches.length,
  }

  const handleMatchAction = (matchId: number, action: string) => {
    const match = matches.find((m) => m.id === matchId)
    if (!match) return

    switch (action) {
      case 'contact':
        toast.success(`Opening conversation with ${match.provider.name}`)
        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  status: 'contacted',
                  lastContact: new Date().toISOString(),
                  timeline: [
                    ...m.timeline,
                    {
                      date: new Date().toISOString(),
                      event: 'Contacted provider',
                      type: 'contact',
                    },
                  ],
                }
              : m
          )
        )
        break

      case 'hire':
        toast.success(`${match.provider.name} has been hired!`)
        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  status: 'hired',
                  hiredDate: new Date().toISOString(),
                  timeline: [
                    ...m.timeline,
                    {
                      date: new Date().toISOString(),
                      event: 'Service agreement signed',
                      type: 'hire',
                    },
                  ],
                }
              : m
          )
        )
        break

      case 'decline':
        toast.info(`Match with ${match.provider.name} declined`)
        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  status: 'declined',
                  declinedDate: new Date().toISOString(),
                }
              : m
          )
        )
        break

      case 'archive':
        toast.info('Match archived')
        setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: 'archived' } : m)))
        break

      case 'message':
        toast.info('Opening messages...')
        break

      case 'view':
        setSelectedMatch(match)
        setShowModal(true)
        break

      default:
        if (action.startsWith('add-note:')) {
          const noteContent = action.substring(9)
          toast.success('Note added')
          setMatches((prev) =>
            prev.map((m) =>
              m.id === matchId
                ? {
                    ...m,
                    notes: [
                      ...m.notes,
                      {
                        date: new Date().toISOString(),
                        content: noteContent,
                      },
                    ],
                  }
                : m
            )
          )
          // Update the selected match if modal is open
          if (selectedMatch?.id === matchId) {
            setSelectedMatch((prev) =>
              prev
                ? {
                    ...prev,
                    notes: [
                      ...prev.notes,
                      {
                        date: new Date().toISOString(),
                        content: noteContent,
                      },
                    ],
                  }
                : null
            )
          }
        }
        break
    }
  }

  const handleMatchClick = (match: Match) => {
    setSelectedMatch(match)
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
            <Button variant="default">
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
                  <p className="text-gray-600 text-sm dark:text-gray-400">Hired</p>
                  <p className="mt-1 font-bold text-2xl text-gray-900 dark:text-white">
                    {stats.hired}
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
        {filteredMatches.length === 0 ? (
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
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <AnimatePresence mode="popLayout">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onAction={handleMatchAction}
                  onClick={() => handleMatchClick(match)}
                  viewMode="list"
                />
              ))}
            </AnimatePresence>
          </div>
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
