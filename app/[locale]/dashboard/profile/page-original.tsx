// Changelog: Created Profile page—tabbed sections for info/preferences/membership/privacy; Supabase edit stub, bilingual toggle.

'use client'

import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  ChevronDown,
  CreditCard,
  Download,
  Globe,
  Home,
  Info,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Save,
  Shield,
  Trash2,
  UserCircle,
  Users,
  Utensils,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Mock user data
const MOCK_USER = {
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
  { id: 'preferences', label: 'Preferences', icon: Home },
  { id: 'membership', label: 'Membership', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Shield },
]

const SERVICES = [
  { id: 'cleaning', label: 'House Cleaning', icon: Home },
  { id: 'cooking', label: 'Cooking', icon: Utensils },
  { id: 'meal-prep', label: 'Meal Prep', icon: Utensils },
  { id: 'laundry', label: 'Laundry', icon: Home },
  { id: 'organization', label: 'Organization', icon: Home },
]

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('personal')
  const [showTooltip, setShowTooltip] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Form states
  const [formData, setFormData] = useState({
    name: MOCK_USER.name,
    bio: MOCK_USER.bio,
    city: MOCK_USER.city,
    services: MOCK_USER.services,
    budget: MOCK_USER.budget,
    language: MOCK_USER.language,
    notifications: { ...MOCK_USER.notifications },
    privacy: { ...MOCK_USER.privacy },
  })

  const handleSave = (section: string) => {
    showSuccessToast(`${section} updated successfully!`)
  }

  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id) => id !== serviceId)
        : [...prev.services, serviceId],
    }))
  }

  const handleNotificationToggle = (key: keyof typeof formData.notifications) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handlePrivacyToggle = (key: keyof typeof formData.privacy) => {
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }))
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-warmth-50/30 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h1 className="font-bold text-3xl text-teal-600 dark:text-teal-400">Your Profile</h1>
              <div className="relative">
                <button
                  className="rounded-full p-1 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <Info className="h-5 w-5 text-teal-500 dark:text-teal-400" />
                </button>
                {showTooltip && (
                  <div className="absolute top-8 left-0 z-10 w-64 rounded-lg border border-teal-100 bg-white p-3 shadow-lg dark:border-teal-800 dark:bg-gray-900">
                    <p className="text-gray-600 text-sm dark:text-gray-400">
                      Update your details to get better matches—your info stays private unless
                      shared.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <Globe className="h-4 w-4" />
                <span>{LANGUAGES.find((l) => l.code === formData.language)?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  {LANGUAGES.map((lang) => (
                    <button
                      className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        formData.language === lang.code
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      key={lang.code}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, language: lang.code }))
                        setShowLanguageDropdown(false)
                        showSuccessToast(`Language changed to ${lang.label}`)
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account & preferences</p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 flex gap-1 rounded-lg bg-white p-1 shadow-sm dark:bg-gray-900 dark:shadow-gray-900/30">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm dark:bg-teal-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:shadow-gray-900/30">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-white">
                Personal Information
              </h2>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                    src={MOCK_USER.avatar}
                  />
                  <button className="absolute right-0 bottom-0 rounded-full bg-teal-600 p-1.5 text-white hover:bg-teal-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Profile Photo</p>
                  <p className="text-gray-500 text-xs">
                    Upload a photo to help providers recognize you
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">Full Name</label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  type="text"
                  value={formData.name}
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  Email Address
                </label>
                <input
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500"
                  disabled
                  type="email"
                  value={MOCK_USER.email}
                />
                <p className="mt-1 text-gray-500 text-xs">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">About You</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your expat setup..."
                  rows={4}
                  value={formData.bio}
                />
                <p className="mt-1 text-gray-500 text-xs">
                  This helps providers understand your needs better
                </p>
              </div>

              {/* Save Button */}
              <button
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                onClick={() => handleSave('Personal info')}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl">Match Preferences</h2>

              {/* City Selection */}
              <div>
                <label className="mb-3 block font-medium text-gray-700 text-sm">
                  Preferred City
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`rounded-lg border-2 p-4 transition-all ${
                      formData.city === 'medellin'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, city: 'medellin' }))}
                  >
                    <MapPin className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                    <p className="font-medium">Medellín</p>
                    <p className="mt-1 text-gray-500 text-xs">Colombia</p>
                  </button>
                  <button
                    className={`rounded-lg border-2 p-4 transition-all ${
                      formData.city === 'florianopolis'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, city: 'florianopolis' }))}
                  >
                    <Globe className="mx-auto mb-2 h-6 w-6 text-teal-600" />
                    <p className="font-medium">Florianópolis</p>
                    <p className="mt-1 text-gray-500 text-xs">Brazil</p>
                  </button>
                </div>
              </div>

              {/* Service Interests */}
              <div>
                <label className="mb-3 block font-medium text-gray-700 text-sm">
                  Service Interests
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SERVICES.map((service) => {
                    const Icon = service.icon
                    const isSelected = formData.services.includes(service.id)
                    return (
                      <button
                        className={`rounded-lg border-2 p-3 transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        key={service.id}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <Icon
                          className={`mx-auto mb-1 h-5 w-5 ${
                            isSelected ? 'text-teal-600' : 'text-gray-500'
                          }`}
                        />
                        <p
                          className={`font-medium text-xs ${
                            isSelected ? 'text-teal-700' : 'text-gray-600'
                          }`}
                        >
                          {service.label}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  Monthly Budget: ${formData.budget[0]} - ${formData.budget[1]}
                </label>
                <div className="px-3">
                  <input
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-teal-600"
                    max="500"
                    min="100"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budget: [prev.budget[0], Number.parseInt(e.target.value, 10)],
                      }))
                    }
                    type="range"
                    value={formData.budget[1]}
                  />
                </div>
                <div className="mt-1 flex justify-between text-gray-500 text-xs">
                  <span>$100</span>
                  <span>$500</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                onClick={() => handleSave('Preferences')}
              >
                Update Matches
              </button>
            </div>
          )}

          {/* Membership Tab */}
          {activeTab === 'membership' && (
            <div className="space-y-6">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl">Membership Status</h2>

              {/* Tier Summary */}
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-bold text-2xl text-gray-900">
                        {MOCK_USER.tier === 'free' ? 'Free' : 'Premium'} Plan
                      </span>
                      {MOCK_USER.tier === 'free' ? (
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-gray-600 text-xs">
                          Basic Access
                        </span>
                      ) : (
                        <span className="rounded-full bg-teal-100 px-2 py-1 text-teal-700 text-xs">
                          Full Access
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      Member since {new Date(MOCK_USER.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-gray-700" />
                </div>

                {/* Usage Stats */}
                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">Match Requests Used</span>
                    <span className="font-medium">
                      {MOCK_USER.matchesUsed} of {MOCK_USER.matchesLimit}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-teal-600 transition-all"
                      style={{
                        width: `${(MOCK_USER.matchesUsed / MOCK_USER.matchesLimit) * 100}%`,
                      }}
                    />
                  </div>
                  {MOCK_USER.tier === 'free' && (
                    <p className="mt-2 text-gray-500 text-xs">
                      {MOCK_USER.matchesLimit - MOCK_USER.matchesUsed} requests remaining this month
                    </p>
                  )}
                </div>

                {/* Upgrade/Downgrade Buttons */}
                <div className="flex gap-3">
                  {MOCK_USER.tier === 'free' ? (
                    <button
                      className="flex-1 rounded-lg bg-teal-600 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                      onClick={() => router.push('/dashboard/membership')}
                    >
                      Upgrade to Premium
                    </button>
                  ) : (
                    <>
                      <button className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                        Manage Subscription
                      </button>
                      <button className="rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50">
                        Downgrade
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="mb-3 font-medium text-gray-900">Billing History</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700 text-sm">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700 text-sm">
                          Description
                        </th>
                        <th className="px-4 py-2 text-right font-medium text-gray-700 text-sm">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {MOCK_USER.billingHistory.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-gray-600 text-sm">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-sm">{item.description}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900 text-sm">
                            {item.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="mb-4 font-semibold text-gray-900 text-xl">Privacy & Security</h2>

              {/* Privacy Toggles */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Privacy Settings</h3>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Make profile discoverable</p>
                      <p className="text-gray-500 text-xs">Allow providers to find you</p>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.discoverable ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                    onClick={() => handlePrivacyToggle('discoverable')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.discoverable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Share profile in forums</p>
                      <p className="text-gray-500 text-xs">Show your name in community posts</p>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.showInForums ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                    onClick={() => handlePrivacyToggle('showInForums')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.showInForums ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Share location</p>
                      <p className="text-gray-500 text-xs">Help providers find you nearby</p>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.shareLocation ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                    onClick={() => handlePrivacyToggle('shareLocation')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.shareLocation ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Email Notifications</h3>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Match notifications</p>
                      <p className="text-gray-500 text-xs">Get notified about new matches</p>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.matches ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                    onClick={() => handleNotificationToggle('matches')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.matches ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Forum replies</p>
                      <p className="text-gray-500 text-xs">Notifications for forum activity</p>
                    </div>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.forum ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                    onClick={() => handleNotificationToggle('forum')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.forum ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Data Management */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Data Management</h3>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Download My Data
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-red-600 transition-colors hover:bg-red-50"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
                <p className="text-gray-500 text-xs">
                  Your data is secure and encrypted. We never share your personal information
                  without consent.
                </p>
              </div>

              {/* Save Button */}
              <button
                className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                onClick={() => handleSave('Privacy settings')}
              >
                Save Privacy Settings
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            className="mx-auto flex items-center gap-2 rounded-lg border border-red-300 px-6 py-2 text-red-600 transition-colors hover:bg-red-50"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="font-bold text-gray-900 text-xl">Delete Account?</h2>
              </div>
              <p className="mb-6 text-gray-600">
                This action cannot be undone. All your data, matches, and forum posts will be
                permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-lg bg-red-600 py-2 text-white transition-colors hover:bg-red-700"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">
              <h2 className="mb-4 font-bold text-gray-900 text-xl">Sign Out?</h2>
              <p className="mb-6 text-gray-600">
                Are you sure you want to sign out of your account?
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 rounded-lg bg-red-600 py-2 text-white transition-colors hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showToast && (
          <div className="fixed right-4 bottom-4 flex animate-[slideIn_0.3s_ease-out] items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-white shadow-lg">
            <Check className="h-5 w-5" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
