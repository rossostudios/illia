'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/hooks/useSession'
import { useToast } from '@/hooks/useToast'
import { createClient } from '@/lib/supabase/client'

export interface SavedSearch {
  id: string
  user_id: string
  name: string
  filters: Record<string, any>
  is_default: boolean
  search_count: number
  last_used: string | null
  created_at: string
  updated_at: string
}

interface UseSavedSearchesOptions {
  autoLoad?: boolean
}

export function useSavedSearches(options: UseSavedSearchesOptions = {}) {
  const { autoLoad = true } = options
  const { user } = useSession()
  const { showToast } = useToast()

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved searches
  const loadSavedSearches = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('last_used', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      setSavedSearches(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load saved searches'
      setError(errorMessage)
      console.error('Error loading saved searches:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && user) {
      loadSavedSearches()
    }
  }, [autoLoad, user, loadSavedSearches])

  // Save a new search
  const saveSearch = useCallback(
    async (
      name: string,
      filters: Record<string, any>,
      isDefault: boolean = false
    ): Promise<boolean> => {
      if (!user) return false

      try {
        const supabase = createClient()

        // If setting as default, unset other defaults
        if (isDefault) {
          await supabase.from('saved_searches').update({ is_default: false }).eq('user_id', user.id)
        }

        const { data, error: insertError } = await supabase
          .from('saved_searches')
          .insert({
            user_id: user.id,
            name,
            filters,
            is_default: isDefault,
          })
          .select()
          .single()

        if (insertError) {
          if (insertError.code === '23505') {
            // Unique constraint violation
            showToast('A search with this name already exists', 'error')
            return false
          }
          throw insertError
        }

        setSavedSearches((prev) => [data, ...prev])
        showToast(`Search "${name}" saved successfully`, 'success')
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to save search'
        setError(errorMessage)
        showToast(errorMessage, 'error')
        console.error('Error saving search:', err)
        return false
      }
    },
    [user, showToast]
  )

  // Update an existing search
  const updateSearch = useCallback(
    async (
      id: string,
      updates: Partial<Pick<SavedSearch, 'name' | 'filters' | 'is_default'>>
    ): Promise<boolean> => {
      if (!user) return false

      try {
        const supabase = createClient()

        // If setting as default, unset other defaults
        if (updates.is_default) {
          await supabase.from('saved_searches').update({ is_default: false }).eq('user_id', user.id)
        }

        const { data, error: updateError } = await supabase
          .from('saved_searches')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (updateError) throw updateError

        setSavedSearches((prev) => prev.map((search) => (search.id === id ? data : search)))
        showToast('Search updated successfully', 'success')
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update search'
        setError(errorMessage)
        showToast(errorMessage, 'error')
        console.error('Error updating search:', err)
        return false
      }
    },
    [user, showToast]
  )

  // Delete a search
  const deleteSearch = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user) return false

      try {
        const { error: deleteError } = await supabase
          .from('saved_searches')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id)

        if (deleteError) throw deleteError

        setSavedSearches((prev) => prev.filter((search) => search.id !== id))
        showToast('Search deleted successfully', 'success')
        return true
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete search'
        setError(errorMessage)
        showToast(errorMessage, 'error')
        console.error('Error deleting search:', err)
        return false
      }
    },
    [user, showToast]
  )

  // Use a saved search (updates usage stats)
  const useSavedSearch = useCallback(
    async (id: string): Promise<SavedSearch | null> => {
      if (!user) return null

      try {
        const supabase = createClient()
        const { data, error: updateError } = await supabase
          .from('saved_searches')
          .update({
            search_count: supabase.raw('search_count + 1'),
            last_used: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (updateError) throw updateError

        // Update local state
        setSavedSearches((prev) =>
          prev.map((search) =>
            search.id === id
              ? { ...data, search_count: data.search_count, last_used: data.last_used }
              : search
          )
        )

        return data
      } catch (err) {
        console.error('Error updating search usage:', err)
        return null
      }
    },
    [user]
  )

  // Get default search
  const getDefaultSearch = useCallback((): SavedSearch | null => {
    return savedSearches.find((search) => search.is_default) || null
  }, [savedSearches])

  // Check if a search name exists
  const searchNameExists = useCallback(
    (name: string, excludeId?: string): boolean => {
      return savedSearches.some(
        (search) => search.name.toLowerCase() === name.toLowerCase() && search.id !== excludeId
      )
    },
    [savedSearches]
  )

  return {
    savedSearches,
    loading,
    error,
    loadSavedSearches,
    saveSearch,
    updateSearch,
    deleteSearch,
    useSavedSearch,
    getDefaultSearch,
    searchNameExists,
  }
}
