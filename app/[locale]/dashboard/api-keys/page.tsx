'use client'

import {
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  Eye,
  EyeOff,
  FileCode,
  FileText,
  HelpCircle,
  Home,
  Key,
  MessageSquare,
  Play,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function APIKeysPage() {
  const [showExtractMenu, setShowExtractMenu] = useState(false)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Default',
      key: 'illia_def•••••••••••••••••••••••••••••••401',
      fullKey: 'illia_default_29401_kj34h5kj3h45kj3h45kj3dfcaaebf',
      created: 'Sep 20, 2025 10:15 AM',
      visible: false,
    },
  ])
  const [copiedKeyId, setCopiedKeyId] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

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
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys', active: true },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const handleCreateKey = () => {
    if (keyName.trim()) {
      const newKey = {
        id: apiKeys.length + 1,
        name: keyName,
        key: 'illia_custom_••••••••••••••••••••••••',
        fullKey: 'illia_custom_9d8f7g6h5j4k3l2m1n0p9q8r7s6b6642577',
        created: 'Sep 20, 2025 03:48 PM',
        visible: true,
      }
      setApiKeys([newKey, ...apiKeys])
      setKeyName('')
      setShowCreateModal(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const toggleKeyVisibility = (id: number) => {
    setApiKeys(apiKeys.map((key) => (key.id === id ? { ...key, visible: !key.visible } : key)))
  }

  const copyToClipboard = (key: string, id: number) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(key).then(() => {
        setCopiedKeyId(id)
        setTimeout(() => setCopiedKeyId(null), 2000)
      })
    }
  }

  const deleteKey = (id: number) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

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
          <div className="absolute right-4 bottom-4 left-4">
            <div className="rounded-lg bg-teal-50 p-3">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-teal-600 text-xs">What&apos;s New (5)</span>
                </div>
                <button
                  className="text-gray-700 hover:text-gray-600"
                  onClick={() => setShowWhatsNew(false)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-gray-600 text-xs">View our latest update</p>
            </div>

            {/* User email */}
            <div className="mt-4 px-3 py-2 text-gray-500 text-xs">samlee@content-mobbin.com</div>

            {/* Collapse button */}
            <button className="mt-2 flex items-center space-x-2 text-gray-600 text-xs hover:text-gray-900">
              <ChevronLeft className="h-3 w-3" />
              <span>Collapse</span>
            </button>
          </div>
        )}
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
              <button className="rounded-lg bg-orange-500 px-4 py-1.5 font-medium text-sm text-white transition-colors hover:bg-orange-600">
                Upgrade
              </button>
            </div>
          </div>
        </header>

        {/* API Keys content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-2xl text-teal-600">Lead API Keys</h1>
            <p className="text-gray-700">
              Create and manage API keys to authenticate with the Illia API
            </p>
          </div>

          {/* API Keys Section */}
          <div className="rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="font-semibold text-lg text-teal-600">Your Lead API Keys</h2>
                <p className="mt-1 text-gray-600 text-sm">
                  Use for Zapier auto-exports from 29401 queries
                </p>
              </div>
              <button
                className="flex items-center space-x-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium text-sm">Create New Key</span>
              </button>
            </div>

            <div className="divide-y">
              {apiKeys.map((apiKey) => (
                <div
                  className="bg-teal-50 px-6 py-4 transition-colors hover:bg-teal-100"
                  key={apiKey.id}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
                    <button
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      onClick={() => deleteKey(apiKey.id)}
                      title="Revoke key"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <code className="flex-1 rounded-lg border border-teal-200 bg-white/50 px-3 py-2 font-mono text-gray-700 text-sm">
                      {apiKey.visible ? apiKey.fullKey : apiKey.key}
                    </code>
                    <button
                      className="rounded-lg p-2 transition-colors hover:bg-teal-200"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {apiKey.visible ? (
                        <EyeOff className="h-4 w-4 text-teal-600" />
                      ) : (
                        <Eye className="h-4 w-4 text-teal-600" />
                      )}
                    </button>
                    <button
                      className="rounded-lg p-2 transition-colors hover:bg-teal-200"
                      onClick={() => copyToClipboard(apiKey.fullKey, apiKey.id)}
                    >
                      {copiedKeyId === apiKey.id ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-teal-600" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-gray-500 text-sm">Created on {apiKey.created}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Create API Key</h3>
              <button
                className="text-gray-700 hover:text-gray-600"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-medium text-gray-700 text-sm">Key Name</label>
                <input
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g., Zapier Integration Key"
                  type="text"
                  value={keyName}
                />
                <p className="mt-2 text-gray-500 text-xs">
                  Give your API key a descriptive name to help you identify it later.
                </p>
              </div>

              <button
                className="w-full rounded-lg bg-teal-500 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-600"
                onClick={handleCreateKey}
              >
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed right-4 bottom-4 z-50 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="font-medium text-sm">
              Lead API key created - ready for Zapier export!
            </span>
          </div>
        </div>
      )}

      {/* Intercom Chat */}
      <button className="fixed right-4 bottom-4 rounded-full bg-teal-500 p-4 text-white shadow-lg hover:bg-teal-600">
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
