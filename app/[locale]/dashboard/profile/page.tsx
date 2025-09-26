'use client'

import { CreditCard, Loader2, Shield, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { MembershipTab } from '@/components/profile/MembershipTab'
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab'
import { PreferencesTab } from '@/components/profile/PreferencesTab'
import { PrivacyTab } from '@/components/profile/PrivacyTab'
import { useSessionContext } from '@/components/SessionProvider'
import { useProfile } from '@/hooks/use-profile'
import { createClient } from '@/lib/supabase/client'

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: UserCircle },
  { id: 'preferences', label: 'Preferences', icon: UserCircle },
  { id: 'membership', label: 'Membership', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Shield },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useSessionContext()
  const [activeTab, setActiveTab] = useState('personal')
  const supabase = createClient()

  // Use the profile hook
  const { profile, loading, error, updateProfile, deleteAccount, exportUserData } =
    useProfile()

  const handleProfileUpdate = async (updates: any) => {
    const result = await updateProfile(updates)
    if (result.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(result.error || 'Failed to update profile')
    }
  }

  const handleUpgrade = () => {
    toast.info('Redirecting to upgrade page...')
    router.push('/en/dashboard/membership')
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (!confirmed) {
      return
    }

    toast.error('Account deletion in progress...')
    const result = await deleteAccount()
    if (result.success) {
      router.push('/login')
    } else {
      toast.error(result.error || 'Failed to delete account')
    }
  }

  const handleLogout = async () => {
    toast.info('Signing out...')
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleExportData = async () => {
    toast.success('Preparing your data export...')
    const result = await exportUserData()
    if (result.success && result.data) {
      const dataStr = JSON.stringify(result.data, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
      const exportFileDefaultName = 'profile-data.json'

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } else {
      toast.error(result.error || 'Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-600" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error || 'Profile not found'}</p>
          <button
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Transform profile data to match frontend interface
  const userProfile: any = {
    ...profile,
    id: user?.id || '',
    email: user?.email || '',
    avatar: `https://i.pravatar.cc/150?u=${user?.id}`,
    name: (profile as any).full_name || (profile as any).name || user?.email?.split('@')[0] || 'User',
    bio: '',
    city: (profile as any).city || '',
    services: (profile as any).services || [],
    tier: ((profile as any).tier || 'free') as 'free' | 'premium' | 'professional',
    language: (profile as any).preferred_language || 'en',
    notifications: {
      email: true,
      matches: true,
      forum: false,
      marketing: false,
    },
    privacy: {
      discoverable: true,
      showInForums: true,
      shareLocation: false,
    },
    budget: [(profile as any).budget_min || 150, (profile as any).budget_max || 300] as [number, number],
    matchesUsed: (profile as any).matchesUsed || 0,
    matchesLimit: (profile as any).matchesLimit || 10,
    joinDate: (profile as any).created_at || new Date().toISOString(),
    billingHistory: [],
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-bold text-3xl text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {/* Tab Navigation */}
        <div className="mb-6 border-gray-200 border-b dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                  `}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-900">
          {activeTab === 'personal' && (
            <PersonalInfoTab
              onUpdate={handleProfileUpdate}
              profile={userProfile}
            />
          )}
          {activeTab === 'preferences' && (
            <PreferencesTab onUpdate={handleProfileUpdate} profile={userProfile} />
          )}
          {activeTab === 'membership' && (
            <MembershipTab onUpgrade={handleUpgrade} profile={userProfile} />
          )}
          {activeTab === 'privacy' && (
            <PrivacyTab
              onDeleteAccount={handleDeleteAccount}
              onExportData={handleExportData}
              onLogout={handleLogout}
              onUpdate={handleProfileUpdate}
              profile={userProfile}
            />
          )}
        </div>
      </div>
    </div>
  )
}
