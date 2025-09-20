'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Home,
  Play,
  FileText,
  BarChart3,
  Key,
  Settings,
  ChevronDown,
  Bell,
  HelpCircle,
  FileCode,
  X,
  Sparkles,
  MessageSquare,
  ChevronLeft,
  Users as UsersIcon,
  CreditCard,
  SettingsIcon,
  Mail,
  Lock,
  Trash2,
  Send,
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const [showExtractMenu, setShowExtractMenu] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [activeTab, setActiveTab] = useState<'team' | 'billing' | 'account'>('account')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [teamName, setTeamName] = useState('Personal')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Member')

  const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Play, label: 'Playground', href: '/dashboard/playground' },
    {
      icon: FileText,
      label: 'Extract',
      href: '/dashboard/extract',
      hasSubmenu: true,
      isOpen: showExtractMenu,
      submenu: [
        { label: 'Overview', href: '/dashboard/extract' },
        { label: 'Playground', href: '/dashboard/extract/playground' }
      ]
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-56 bg-white border-r">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🔥</span>
            <span className="text-xl font-semibold">Firecrawl</span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <kbd className="absolute right-2 top-2 text-xs bg-white border rounded px-1">⌘K</kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  if (item.hasSubmenu) {
                    e.preventDefault()
                    setShowExtractMenu(!showExtractMenu)
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.hasSubmenu && (
                  <ChevronDown className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`} />
                )}
              </Link>
              {item.hasSubmenu && item.isOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* What's New */}
        {showWhatsNew && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold text-orange-600">What's New (5)</span>
                </div>
                <button
                  onClick={() => setShowWhatsNew(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600">View our latest update</p>
            </div>
          </div>
        )}

        {/* Bottom section with user and collapse */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white">
          {/* User email */}
          <div className="px-4 py-3 flex items-center space-x-3">
            <div className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-orange-600">S</span>
            </div>
            <span className="text-xs text-gray-700">samlee@content-mobbin.com</span>
          </div>

          {/* Collapse button */}
          <button className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-t">
            <ChevronLeft className="h-3 w-3" />
            <span>Collapse</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-56">
        {/* Header */}
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Personal Team</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                href="/docs"
                className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg"
              >
                <FileCode className="h-4 w-4" />
                <span className="text-sm font-medium">Docs</span>
              </Link>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Settings Sidebar */}
          <div className="w-64 bg-white border-r min-h-screen p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'account' ? 'Account' : 'Settings'}
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              {activeTab === 'account'
                ? 'Manage your account settings and preferences'
                : 'Manage your team, billing, and account preferences'
              }
            </p>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'team'
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UsersIcon className="h-4 w-4" />
                <span>Team</span>
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'billing'
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'account'
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Advanced</span>
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8">
            {activeTab === 'team' && (
              <div className="max-w-3xl space-y-8">
                {/* Team Name */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Team Name</h3>
                  <p className="text-sm text-gray-500 mb-4">Update your team's display name</p>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="flex-1 max-w-sm px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                      Save
                    </button>
                  </div>
                </div>

                {/* Invite Team Members */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Invite Team Members</h3>
                  <p className="text-sm text-gray-500 mb-4">Add new members to your team</p>
                  <div className="flex items-center space-x-3">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 max-w-sm px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option>Member</option>
                      <option>Admin</option>
                    </select>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                      <Send className="h-4 w-4" />
                      <span>Send Invite</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Invited members will receive an email with instructions to join your team.
                  </p>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Team Members</h3>
                  <p className="text-sm text-gray-500 mb-4">Manage your team's access and permissions</p>
                  <div className="bg-white border rounded-lg divide-y">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-600">S</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">samlee@content-mobbin.com</div>
                          <div className="text-xs text-gray-500">samlee@content-mobbin.com</div>
                        </div>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                          ADMIN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="max-w-3xl">
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                  <p className="text-sm text-gray-600">
                    Manage your subscription and payment methods
                  </p>
                  <button className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
                    Manage Subscription
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="max-w-3xl space-y-8">
                {/* Email Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preferences</h3>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li>• You will be sent an email with a link to the Subscription Center.</li>
                    <li>• From there, you can subscribe or unsubscribe to any topic — or unsubscribe globally.</li>
                  </ul>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>

                {/* Edit Password */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Password</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1 max-w-sm">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={showPassword ? "Enter new password (min. 12 characters)" : "••••••••••"}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <button
                      disabled={password.length < 12}
                      className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-orange-500 rounded-full" />
                      <span className="text-sm">samlee@content-mobbin.com</span>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Delete Account</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800">
                This action cannot be undone. This will permanently delete your account and remove all associated data.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                disabled={deleteConfirmation !== 'DELETE'}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intercom Chat */}
      <button className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}