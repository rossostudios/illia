'use client'

import { CreditCard, Shield, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { MembershipTab } from '@/components/profile/MembershipTab'
import { PersonalInfoTab } from '@/components/profile/PersonalInfoTab'
import { PreferencesTab } from '@/components/profile/PreferencesTab'
import { PrivacyTab } from '@/components/profile/PrivacyTab'
import type { UserProfile } from '@/types/profile'

// Mock user data
const MOCK_USER: UserProfile = {
  id: '123',
  name: 'Christopher',
  email: 'chris@example.com',
  avatar: 'https://i.pravatar.cc/150?img=8',
  bio: 'Digital nomad exploring Latin America. Looking for reliable home help to focus on my remote work.',
  city: 'medellin',
  services: ['cleaning', 'cooking'],
  budget: [150, 300],
  tier: 'free',
  matchesUsed: 3,
  matchesLimit: 5,
  language: 'en',
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
  joinDate: '2024-08-15',
  billingHistory: [
    { date: '2024-09-01', amount: '$0.00', description: 'Free Plan' },
    { date: '2024-08-01', amount: '$0.00', description: 'Free Plan' },
  ],
}

const TABS = [
  { id: 'personal', label: 'Personal Info', icon: UserCircle },
  { id: 'preferences', label: 'Preferences', icon: UserCircle },
  { id: 'membership', label: 'Membership', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Shield },
]

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER)

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
    toast.success('Profile updated successfully')
  }

  const handleUpgrade = () => {
    toast.info('Redirecting to upgrade page...')
    router.push('/en/dashboard/membership')
  }

  const handleDeleteAccount = () => {
    toast.error('Account deletion in progress...')
    // In production, this would call Supabase to delete the account
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  const handleLogout = () => {
    toast.info('Signing out...')
    // In production, this would call Supabase auth signOut
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }

  const handleExportData = () => {
    toast.success('Preparing your data export...')
    // In production, this would generate and download a JSON file
    const dataStr = JSON.stringify(profile, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`
    const exportFileDefaultName = 'profile-data.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
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
            <PersonalInfoTab onUpdate={handleProfileUpdate} profile={profile} />
          )}
          {activeTab === 'preferences' && (
            <PreferencesTab onUpdate={handleProfileUpdate} profile={profile} />
          )}
          {activeTab === 'membership' && (
            <MembershipTab onUpgrade={handleUpgrade} profile={profile} />
          )}
          {activeTab === 'privacy' && (
            <PrivacyTab
              onDeleteAccount={handleDeleteAccount}
              onExportData={handleExportData}
              onLogout={handleLogout}
              onUpdate={handleProfileUpdate}
              profile={profile}
            />
          )}
        </div>
      </div>
    </div>
  )
}
