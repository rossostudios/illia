'use client'

import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  Eye,
  EyeOff,
  FileCode,
  FileText,
  HelpCircle,
  Home,
  Key,
  Mail,
  MessageSquare,
  Play,
  Search,
  Send,
  Settings,
  SettingsIcon,
  Sparkles,
  Users as UsersIcon,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
        { label: 'Playground', href: '/dashboard/extract/playground' },
      ],
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-56 border-r bg-white">
        {/* Logo */}
        <div className="border-b p-4">
          <Link className="group flex items-center space-x-2" href="/dashboard">
            <span className="font-bold text-teal-800 text-xl drop-shadow-sm transition-all group-hover:text-teal-900 group-hover:drop-shadow-md md:text-2xl">
              Illia
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-700" />
            <input
              className="w-full rounded-lg border border-gray-300 bg-gray-200 py-2 pr-3 pl-9 text-gray-900 text-sm placeholder:text-gray-500 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search"
              type="text"
            />
            <kbd className="absolute top-2 right-2 rounded border bg-white px-1 text-xs">⌘K</kbd>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <div key={item.label}>
              <Link
                className={`flex items-center justify-between rounded-lg px-3 py-2 font-medium text-sm transition-colors ${
                  item.active ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
                href={item.href}
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
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>
              {item.hasSubmenu && item.isOpen && (
                <div className="mt-1 ml-7 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      className="block rounded-lg px-3 py-2 text-gray-600 text-sm hover:bg-gray-50 hover:text-gray-900"
                      href={subitem.href}
                      key={subitem.label}
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
          <div className="absolute right-4 bottom-20 left-4">
            <div className="rounded-lg bg-teal-50 p-3">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-teal-600 text-xs">What&apos;s New (5)</span>
                </div>
                <button
                  className="text-gray-700 hover:text-gray-600"
                  onClick={() => setShowWhatsNew(false)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-gray-600 text-xs">View our latest update</p>
            </div>
          </div>
        )}

        {/* Bottom section with user and collapse */}
        <div className="absolute right-0 bottom-0 left-0 border-t bg-white">
          {/* User email */}
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100">
              <span className="font-medium text-teal-600 text-xs">S</span>
            </div>
            <span className="text-gray-700 text-xs">samlee@content-mobbin.com</span>
          </div>

          {/* Collapse button */}
          <button
            className="flex w-full items-center space-x-2 border-t px-4 py-2 text-gray-600 text-xs hover:bg-gray-50 hover:text-gray-900"
            type="button"
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Collapse</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-56">
        {/* Header */}
        <header className="border-b bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 rounded-lg bg-teal-100 px-3 py-1 text-teal-700">
                <Users className="h-4 w-4" />
                <span className="font-medium text-sm">Personal Team</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="rounded-lg p-2 hover:bg-gray-100" type="button">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-100" type="button">
                <HelpCircle className="h-5 w-5 text-gray-600" />
              </button>
              <Link
                className="flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100"
                href="/docs"
              >
                <FileCode className="h-4 w-4" />
                <span className="font-medium text-sm">Docs</span>
              </Link>
              <button
                className="rounded-lg bg-orange-500 px-4 py-1.5 font-medium text-sm text-white transition-colors hover:bg-orange-600"
                type="button"
              >
                Upgrade
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Settings Sidebar */}
          <div className="min-h-screen w-64 border-r bg-white p-6">
            <h1 className="mb-2 font-bold text-2xl text-gray-900">
              {activeTab === 'account' ? 'Account' : 'Settings'}
            </h1>
            <p className="mb-6 text-gray-600 text-sm">
              {activeTab === 'account'
                ? 'Manage your account settings and preferences'
                : 'Manage your team, billing, and account preferences'}
            </p>

            <nav className="space-y-1">
              <button
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors ${
                  activeTab === 'team'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('team')}
                type="button"
              >
                <UsersIcon className="h-4 w-4" />
                <span>Team</span>
              </button>
              <button
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors ${
                  activeTab === 'billing'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('billing')}
                type="button"
              >
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </button>
              <button
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-medium text-sm transition-colors ${
                  activeTab === 'account'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('account')}
                type="button"
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
                  <h3 className="mb-1 font-medium text-gray-700 text-sm">Team Name</h3>
                  <p className="mb-4 text-gray-500 text-sm">Update your team&apos;s display name</p>
                  <div className="flex items-center space-x-3">
                    <input
                      className="max-w-sm flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={(e) => setTeamName(e.target.value)}
                      type="text"
                      value={teamName}
                    />
                    <button
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-sm hover:bg-gray-50"
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Invite Team Members */}
                <div>
                  <h3 className="mb-1 font-medium text-gray-700 text-sm">Invite Team Members</h3>
                  <p className="mb-4 text-gray-500 text-sm">Add new members to your team</p>
                  <div className="flex items-center space-x-3">
                    <input
                      className="max-w-sm flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      type="email"
                      value={inviteEmail}
                    />
                    <select
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      onChange={(e) => setInviteRole(e.target.value)}
                      value={inviteRole}
                    >
                      <option>Member</option>
                      <option>Admin</option>
                    </select>
                    <button
                      className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-sm hover:bg-gray-50"
                      type="button"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send Invite</span>
                    </button>
                  </div>
                  <p className="mt-2 text-gray-500 text-xs">
                    Invited members will receive an email with instructions to join your team.
                  </p>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="mb-1 font-medium text-gray-700 text-sm">Team Members</h3>
                  <p className="mb-4 text-gray-500 text-sm">
                    Manage your team&apos;s access and permissions
                  </p>
                  <div className="divide-y rounded-lg border bg-white">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
                          <span className="font-medium text-sm text-teal-600">S</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">samlee@content-mobbin.com</div>
                          <div className="text-gray-500 text-xs">samlee@content-mobbin.com</div>
                        </div>
                        <span className="rounded bg-teal-100 px-2 py-0.5 font-medium text-teal-600 text-xs">
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
                <div className="rounded-lg border bg-white p-6">
                  <h3 className="mb-4 font-semibold text-lg">Billing Information</h3>
                  <p className="text-gray-600 text-sm">
                    Manage your subscription and payment methods
                  </p>
                  <button
                    className="mt-4 rounded-lg bg-teal-500 px-4 py-2 font-medium text-sm text-white hover:bg-teal-600"
                    type="button"
                  >
                    Manage Subscription
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="max-w-3xl space-y-8">
                {/* Email Preferences */}
                <div>
                  <h3 className="mb-4 font-semibold text-gray-900 text-lg">Lead Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-700 text-sm">Email Alerts</p>
                        <p className="text-gray-500 text-sm">New high-score leads in 29401</p>
                      </div>
                      <button
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-500 transition-colors"
                        type="button"
                      >
                        <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      You'll be sent emails with links to your dashboard for new Charleston leads.
                    </p>
                  </div>
                  <button
                    className="mt-4 flex items-center space-x-2 rounded-lg bg-teal-500 px-4 py-2 font-medium text-sm text-white hover:bg-teal-600"
                    type="button"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>

                {/* Edit Password */}
                <div>
                  <h3 className="mb-4 font-semibold text-gray-900 text-lg">Edit Password</h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Update your Supabase authentication password
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="relative max-w-sm flex-1">
                      <input
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          showPassword ? 'Enter new password (min. 12 characters)' : '••••••••••'
                        }
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                      />
                      <button
                        className="absolute top-2.5 right-3"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-700" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-700" />
                        )}
                      </button>
                    </div>
                    <button
                      className="rounded-lg bg-teal-500 px-4 py-2 font-medium text-sm text-white hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={password.length < 12}
                      type="button"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div>
                  <h3 className="mb-4 font-semibold text-gray-900 text-lg">Delete Account</h3>
                  <p className="mb-4 text-gray-600 text-sm">
                    Delete your account—leads history will be lost. Be certain.
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-teal-500" />
                      <span className="text-sm">samlee@content-mobbin.com</span>
                    </div>
                    <button
                      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700"
                      onClick={() => setShowDeleteModal(true)}
                      type="button"
                    >
                      Delete Account
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Delete Account</h3>
              <button
                className="text-gray-700 hover:text-gray-600"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-800 text-sm">
                This action cannot be undone. This will permanently delete your account and remove
                all associated data.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  Type <span className="rounded bg-gray-100 px-1 font-mono">DELETE</span> to
                  confirm:
                </label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  type="text"
                  value={deleteConfirmation}
                />
              </div>

              <button
                className="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={deleteConfirmation !== 'DELETE'}
                type="button"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intercom Chat */}
      <button
        className="fixed right-4 bottom-4 rounded-full bg-teal-500 p-4 text-white shadow-lg hover:bg-teal-600"
        type="button"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      aria-label="icon"
      className={className}
      fill="none"
      role="img"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
