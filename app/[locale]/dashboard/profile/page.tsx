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
    // Mock save to Supabase
    console.log('Saving:', section, formData)
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
    // Mock logout
    console.log('Logging out...')
    router.push('/login')
  }

  const handleDeleteAccount = () => {
    // Mock account deletion
    console.log('Deleting account...')
    setShowDeleteModal(false)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-warmth-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <h1 className="text-3xl font-bold text-teal-600">Your Profile</h1>
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="p-1 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <Info className="h-5 w-5 text-teal-500" />
                </button>
                {showTooltip && (
                  <div className="absolute left-0 top-8 w-64 p-3 bg-white rounded-lg shadow-lg border border-teal-100 z-10">
                    <p className="text-sm text-gray-600">
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
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{LANGUAGES.find((l) => l.code === formData.language)?.label}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, language: lang.code }))
                        setShowLanguageDropdown(false)
                        showSuccessToast(`Language changed to ${lang.label}`)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2 ${
                        formData.language === lang.code ? 'bg-teal-50 text-teal-700' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 mt-2">Manage your account & preferences</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={MOCK_USER.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-1.5 bg-teal-600 text-white rounded-full hover:bg-teal-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                  <p className="text-xs text-gray-500">
                    Upload a photo to help providers recognize you
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={MOCK_USER.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about your expat setup..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps providers understand your needs better
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={() => handleSave('Personal info')}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Match Preferences</h2>

              {/* City Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred City
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, city: 'medellin' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.city === 'medellin'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="h-6 w-6 mb-2 text-teal-600 mx-auto" />
                    <p className="font-medium">Medellín</p>
                    <p className="text-xs text-gray-500 mt-1">Colombia</p>
                  </button>
                  <button
                    onClick={() => setFormData((prev) => ({ ...prev, city: 'florianopolis' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.city === 'florianopolis'
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className="h-6 w-6 mb-2 text-teal-600 mx-auto" />
                    <p className="font-medium">Florianópolis</p>
                    <p className="text-xs text-gray-500 mt-1">Brazil</p>
                  </button>
                </div>
              </div>

              {/* Service Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Service Interests
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SERVICES.map((service) => {
                    const Icon = service.icon
                    const isSelected = formData.services.includes(service.id)
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceToggle(service.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 mb-1 mx-auto ${
                            isSelected ? 'text-teal-600' : 'text-gray-500'
                          }`}
                        />
                        <p
                          className={`text-xs font-medium ${
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget: ${formData.budget[0]} - ${formData.budget[1]}
                </label>
                <div className="px-3">
                  <input
                    type="range"
                    min="100"
                    max="500"
                    value={formData.budget[1]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budget: [prev.budget[0], parseInt(e.target.value, 10)],
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$100</span>
                  <span>$500</span>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => handleSave('Preferences')}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Update Matches
              </button>
            </div>
          )}

          {/* Membership Tab */}
          {activeTab === 'membership' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Membership Status</h2>

              {/* Tier Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {MOCK_USER.tier === 'free' ? 'Free' : 'Premium'} Plan
                      </span>
                      {MOCK_USER.tier === 'free' ? (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          Basic Access
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">
                          Full Access
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Member since {new Date(MOCK_USER.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-gray-700" />
                </div>

                {/* Usage Stats */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Match Requests Used</span>
                    <span className="font-medium">
                      {MOCK_USER.matchesUsed} of {MOCK_USER.matchesLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(MOCK_USER.matchesUsed / MOCK_USER.matchesLimit) * 100}%`,
                      }}
                    />
                  </div>
                  {MOCK_USER.tier === 'free' && (
                    <p className="text-xs text-gray-500 mt-2">
                      {MOCK_USER.matchesLimit - MOCK_USER.matchesUsed} requests remaining this month
                    </p>
                  )}
                </div>

                {/* Upgrade/Downgrade Buttons */}
                <div className="flex gap-3">
                  {MOCK_USER.tier === 'free' ? (
                    <button
                      onClick={() => router.push('/dashboard/membership')}
                      className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                      Upgrade to Premium
                    </button>
                  ) : (
                    <>
                      <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Manage Subscription
                      </button>
                      <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Downgrade
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Billing History</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                          Date
                        </th>
                        <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">
                          Description
                        </th>
                        <th className="text-right px-4 py-2 text-sm font-medium text-gray-700">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {MOCK_USER.billingHistory.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h2>

              {/* Privacy Toggles */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Privacy Settings</h3>

                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Make profile discoverable</p>
                      <p className="text-xs text-gray-500">Allow providers to find you</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('discoverable')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.discoverable ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.discoverable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Share profile in forums</p>
                      <p className="text-xs text-gray-500">Show your name in community posts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('showInForums')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.showInForums ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.privacy.showInForums ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Share location</p>
                      <p className="text-xs text-gray-500">Help providers find you nearby</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('shareLocation')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.privacy.shareLocation ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
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

                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Match notifications</p>
                      <p className="text-xs text-gray-500">Get notified about new matches</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('matches')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.matches ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.notifications.matches ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Forum replies</p>
                      <p className="text-xs text-gray-500">Notifications for forum activity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('forum')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.notifications.forum ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
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
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download My Data
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Your data is secure and encrypted. We never share your personal information
                  without consent.
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={() => handleSave('Privacy settings')}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Save Privacy Settings
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 mx-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Account?</h2>
              </div>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data, matches, and forum posts will be
                permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sign Out?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to sign out of your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-[slideIn_0.3s_ease-out]">
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
