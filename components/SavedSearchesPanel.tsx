'use client'

import { Bookmark, MoreVertical, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { useConfirm } from '@/components/ui/ConfirmDialog'
import { type SavedSearch, useSavedSearches } from '@/hooks/use-saved-searches'

type SavedSearchesPanelProps = {
  currentFilters: Record<string, unknown>
  onLoadSearch: (filters: Record<string, unknown>) => void
  onClose: () => void
  className?: string
}

export function SavedSearchesPanel({
  currentFilters,
  onLoadSearch,
  onClose,
  className = '',
}: SavedSearchesPanelProps) {
  const { savedSearches, loading, saveSearch, deleteSearch } = useSavedSearches()
  const { confirm } = useConfirm()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSearch = async () => {
    if (!saveName.trim()) {
      toast.error('Please enter a name for your search')
      return
    }

    setIsSaving(true)
    try {
      const success = await saveSearch(saveName.trim(), currentFilters)
      if (success) {
        setShowSaveDialog(false)
        setSaveName('')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoadSearch = (search: SavedSearch) => {
    onLoadSearch(search.filters)
    onClose()
  }

  const handleDeleteSearch = async (searchId: string, searchName: string) => {
    confirm({
      title: 'Delete saved search?',
      description: `Are you sure you want to delete "${searchName}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await deleteSearch(searchId)
          toast.success('Search deleted successfully')
        } catch (_error) {
          toast.error('Failed to delete search')
        }
      },
    })
  }

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-gray-200 border-b p-4 dark:border-gray-700">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 text-lg dark:text-white">
          <Bookmark className="h-5 w-5" />
          Saved Searches
        </h3>
        <div className="flex items-center gap-2">
          <Button
            className="text-sm"
            onClick={() => setShowSaveDialog(true)}
            size="sm"
            variant="outline"
          >
            <Bookmark className="mr-1 h-4 w-4" />
            Save Current
          </Button>
          <Button className="p-1" onClick={onClose} size="sm" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="border-gray-200 border-b bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <div className="mb-2 flex items-center gap-2">
            <input
              className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 text-sm focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveSearch()
                }
                if (e.key === 'Escape') {
                  setShowSaveDialog(false)
                }
              }}
              placeholder="Enter search name..."
              type="text"
              value={saveName}
            />
            <Button
              disabled={!saveName.trim()}
              loading={isSaving}
              onClick={handleSaveSearch}
              size="sm"
              variant="primary"
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setShowSaveDialog(false)
                setSaveName('')
              }}
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading saved searches...
          </div>
        ) : savedSearches.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No saved searches yet. Save your current search to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {savedSearches.map((search) => (
              <div
                className="p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                key={search.id}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <button
                        className="truncate font-medium text-gray-900 text-sm hover:text-teal-600 dark:text-white dark:hover:text-teal-400"
                        onClick={() => handleLoadSearch(search)}
                      >
                        {search.name}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-gray-500 text-xs dark:text-gray-400">
                      <span>
                        Used {search.search_count} {search.search_count === 1 ? 'time' : 'times'}
                      </span>
                      {search.last_used && (
                        <span>Last used {new Date(search.last_used).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Show some filter preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {search.filters.location && (
                        <span className="inline-flex items-center rounded bg-teal-100 px-2 py-0.5 text-teal-800 text-xs dark:bg-teal-900/30 dark:text-teal-300">
                          📍 {search.filters.location}
                        </span>
                      )}
                      {search.filters.services?.length > 0 && (
                        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-300">
                          🛠️ {search.filters.services.length} service
                          {search.filters.services.length === 1 ? '' : 's'}
                        </span>
                      )}
                      {search.filters.minRating && (
                        <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          ⭐ {search.filters.minRating}+ rating
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ml-2 flex items-center gap-1">
                    <div className="group relative">
                      <button className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      <div className="pointer-events-none absolute top-full right-0 z-10 mt-1 rounded-md border border-gray-200 bg-white opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-900">
                        <div className="py-1">
                          <button
                            className="w-full px-3 py-2 text-left text-red-600 text-sm transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteSearch(search.id, search.name)}
                          >
                            <Trash2 className="mr-2 inline h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
