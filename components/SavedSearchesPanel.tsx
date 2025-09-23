'use client'

import { Bookmark, MoreVertical, Star, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { type SavedSearch, useSavedSearches } from '@/hooks/useSavedSearches'
import { useToast } from '@/hooks/useToast'

interface SavedSearchesPanelProps {
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
  const { savedSearches, loading, saveSearch, deleteSearch, setDefaultSearch } = useSavedSearches()
  const { showToast } = useToast()
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSearch = async () => {
    if (!saveName.trim()) {
      showToast('Please enter a name for your search', 'error')
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
    if (confirm(`Are you sure you want to delete "${searchName}"?`)) {
      try {
        await deleteSearch(searchId)
      } catch (_error) {
        // Error handling is done in the hook
      }
    }
  }

  const handleSetDefault = async (searchId: string) => {
    try {
      await setDefaultSearch(searchId)
    } catch (_error) {
      // Error handling is done in the hook
    }
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Saved Searches
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="text-sm"
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Save Current
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter search name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveSearch()
                if (e.key === 'Escape') setShowSaveDialog(false)
              }}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveSearch}
              loading={isSaving}
              disabled={!saveName.trim()}
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSaveDialog(false)
                setSaveName('')
              }}
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
                key={search.id}
                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => handleLoadSearch(search)}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 truncate"
                      >
                        {search.name}
                      </button>
                      {search.is_default && (
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Used {search.search_count} {search.search_count === 1 ? 'time' : 'times'}
                      </span>
                      {search.last_used && (
                        <span>Last used {new Date(search.last_used).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Show some filter preview */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {search.filters.location && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300">
                          📍 {search.filters.location}
                        </span>
                      )}
                      {search.filters.services?.length > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          🛠️ {search.filters.services.length} service
                          {search.filters.services.length === 1 ? '' : 's'}
                        </span>
                      )}
                      {search.filters.minRating && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                          ⭐ {search.filters.minRating}+ rating
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {!search.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(search.id)}
                        className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                        title="Set as default"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}

                    <div className="relative group">
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleDeleteSearch(search.id, search.name)}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 inline mr-2" />
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
