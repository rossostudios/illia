import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSessionContext } from '@/components/SessionProvider'
import type { Database } from '@/types/database'

type User = Database['public']['Tables']['users']['Row']

export interface UserProfile extends User {
  matchesUsed?: number
  matchesLimit?: number
  billingHistory?: Array<{
    date: string
    amount: string
    description: string
  }>
}

export interface ProfileUpdateData {
  name?: string
  email?: string
  bio?: string
  city?: string
  services?: string[]
  languages?: string[]
  budget_min?: number
  budget_max?: number
  avatar_url?: string
  preferences?: Record<string, any>
  notification_settings?: {
    email?: boolean
    matches?: boolean
    messages?: boolean
    marketing?: boolean
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSessionContext()
  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      let profileData = userData

      if (userError) {
        // If profile doesn't exist, create one
        if (userError.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.name || '',
              email: user.email || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single()

          if (createError) {
            throw createError
          }

          profileData = newProfile
        } else {
          throw userError
        }
      }

      // Fetch match statistics
      const { count: matchCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', new Date(new Date().setDate(1)).toISOString())

      // Set tier-based limits
      const tierLimits = {
        free: 3,
        explorer: 3,
        settler: 20,
        local: -1, // unlimited
      }

      // Map database fields to frontend fields
      const profile: UserProfile = {
        ...profileData,
        name: profileData?.full_name || '',
        language: profileData?.languages?.[0] || 'en',
        matchesUsed: matchCount || 0,
        matchesLimit: tierLimits[profileData?.tier as keyof typeof tierLimits] || 3,
      }

      setProfile(profile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }, [user?.id, supabase])

  // Update profile
  const updateProfile = useCallback(async (updates: ProfileUpdateData) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      // Map frontend field names to database column names
      const mappedUpdates: any = {}
      if ('name' in updates) {
        mappedUpdates.full_name = updates.name
      }
      if ('bio' in updates) {
        mappedUpdates.bio = updates.bio
      }
      if ('city' in updates) {
        mappedUpdates.city = updates.city
      }
      if ('language' in updates) {
        mappedUpdates.languages = [updates.language]
      }

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...mappedUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      setProfile(prev => prev ? { ...prev, ...data } : null)
      return { success: true, data }
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMessage = err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
        ? String(err.message)
        : 'Failed to update profile'

      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [user?.id, supabase])

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with avatar URL
      const result = await updateProfile({ avatar_url: publicUrl })
      return result
    } catch (err) {
      console.error('Error uploading avatar:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to upload avatar',
      }
    }
  }, [user?.id, supabase, updateProfile])

  // Delete account
  const deleteAccount = useCallback(async () => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      // Mark user as deleted (soft delete)
      const { error: deleteError } = await supabase
        .from('users')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (deleteError) {
        throw deleteError
      }

      // Sign out
      await supabase.auth.signOut()
      return { success: true }
    } catch (err) {
      console.error('Error deleting account:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete account',
      }
    }
  }, [user?.id, supabase])

  // Export user data
  const exportUserData = useCallback(async () => {
    if (!user?.id || !profile) {
      return { success: false, error: 'No profile data available' }
    }

    try {
      // Fetch all user-related data
      const [
        { data: matches },
        { data: messages },
        { data: bookings },
      ] = await Promise.all([
        supabase.from('matches').select('*').eq('user_id', user.id),
        supabase.from('direct_messages').select('*').or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`),
        supabase.from('bookings').select('*').eq('user_id', user.id),
      ])

      const exportData = {
        profile,
        matches,
        messages,
        bookings,
        exportedAt: new Date().toISOString(),
      }

      return { success: true, data: exportData }
    } catch (err) {
      console.error('Error exporting data:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to export data',
      }
    }
  }, [user?.id, profile, supabase])

  // Set up real-time subscription
  useEffect(() => {
    fetchProfile()

    if (!user?.id) return

    const channel = supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile change received:', payload)
          setProfile(prev => prev ? { ...prev, ...payload.new } : null)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, fetchProfile, supabase])

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAccount,
    exportUserData,
    refetch: fetchProfile,
  }
}