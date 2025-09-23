'use client'

import {
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  Copy,
  Download,
  FileCode,
  FileText,
  GripVertical,
  HelpCircle,
  Home,
  Key,
  MessageSquare,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  StopCircle,
  Trash2,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ExtractPlaygroundPage() {
  const [showExtractMenu, setShowExtractMenu] = useState(true)
  const [showWhatsNew, setShowWhatsNew] = useState(true)
  const [url, setUrl] = useState('plumbers 29401')
  const [additionalUrl, setAdditionalUrl] = useState('')
  const [activeTab, setActiveTab] = useState<'options' | 'schema'>('options')
  const [showExtractPanel, setShowExtractPanel] = useState(false)
  const [prompt, setPrompt] = useState(
    'Extract lead name, business type, phone number, and lead score from Charleston area businesses.'
  )
  const [enableWebSearch, setEnableWebSearch] = useState(false)
  const [illiaAgent, setIlliaAgent] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [schemaFields, _setSchemaFields] = useState([
    {
      id: '1',
      name: 'business',
      type: 'Object',
      required: true,
      children: [
        { id: '1-1', name: 'name', type: 'String', required: true },
        { id: '1-2', name: 'score', type: 'Number', required: true },
        { id: '1-3', name: 'location', type: 'String', required: true },
      ],
    },
  ])

  const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Play, label: 'Playground', href: '/dashboard/playground' },
    {
      icon: FileText,
      label: 'Extract',
      href: '/dashboard/extract',
      active: true,
      hasSubmenu: true,
      isOpen: showExtractMenu,
      submenu: [
        { label: 'Overview', href: '/dashboard/extract' },
        { label: 'Playground', href: '/dashboard/extract/playground', active: true },
      ],
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  const recentRuns = [
    {
      id: 1,
      query: 'illia dev',
      mode: 'Schema',
      status: 'Success',
      date: 'Sep 20',
      time: '9:57 AM',
      icon: 'IL',
    },
    {
      id: 2,
      query: 'plumbers 29401',
      mode: 'Agent',
      status: 'Success',
      date: 'Sep 4',
      time: '3:38 PM',
      icon: 'IL',
    },
    {
      id: 3,
      query: 'cafes King St',
      mode: 'ZIP search',
      status: 'Success',
      date: 'Sep 2',
      time: '7:46 AM',
      icon: 'IL',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-56 bg-white border-r">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-600">IL</span>
            <span className="text-xl font-semibold">Illia</span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-700" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2 bg-gray-200 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                  item.active ? 'bg-teal-50 text-teal-600' : 'text-gray-700 hover:bg-gray-100'
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
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </Link>
              {item.hasSubmenu && item.isOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        subitem.active
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
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
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-teal-50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-600">What&apos;s New (5)</span>
                </div>
                <button
                  onClick={() => setShowWhatsNew(false)}
                  className="text-gray-700 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-gray-600">View our latest update</p>
            </div>

            {/* User email */}
            <div className="mt-4 px-3 py-2 text-xs text-gray-500">samlee@content-mobbin.com</div>

            {/* Collapse button */}
            <button className="flex items-center space-x-2 mt-2 text-xs text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-3 w-3" />
              <span>Collapse</span>
            </button>
          </div>
        )}
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

        {/* Extract Playground content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-teal-600 mb-2 flex items-center justify-center">
              <Play className="h-8 w-8 mr-2" />
              Lead Extract Playground
            </h1>
            <p className="text-gray-700">
              Lead Extract Playground - Test custom schemas in one place
            </p>
          </div>

          {/* Main Interface */}
          <div className="max-w-7xl mx-auto">
            {/* Lead Query Input and Controls */}
            <div className="bg-white rounded-xl border p-4 mb-6">
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-700">Lead Query</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-200 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter lead query (e.g., plumbers 29401)"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">+</span>
                  <input
                    type="text"
                    value={additionalUrl}
                    onChange={(e) => setAdditionalUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm text-gray-500 outline-none hover:text-teal-600"
                    placeholder="Add another ZIP or niche"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button className="text-gray-700 hover:text-gray-600">
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveTab('options')}
                      className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 transition-colors ${
                        activeTab === 'options'
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Options</span>
                      {activeTab === 'options' && (
                        <span className="h-2 w-2 bg-teal-500 rounded-full" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('schema')}
                      className={`px-4 py-2 text-sm font-medium flex items-center space-x-2 transition-colors ${
                        activeTab === 'schema'
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Schema</span>
                      {activeTab === 'schema' && (
                        <span className="h-2 w-2 bg-teal-500 rounded-full" />
                      )}
                    </button>
                  </div>

                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                    <Copy className="h-4 w-4" />
                    <span className="text-sm font-medium">Get Schema Code</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsExtracting(true)
                      setShowExtractPanel(true)
                      setTimeout(() => {
                        setIsExtracting(false)
                        setExtractedData({
                          business: {
                            name: 'Charleston Plumbing Pros',
                            score: 92,
                            location: '123 King Street, Charleston, SC 29401',
                          },
                        })
                      }, 3000)
                    }}
                    className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Start Extracting Leads
                  </button>
                </div>
              </div>
            </div>

            {/* Options/Schema Panel and Extract Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Options or Schema Panel */}
              {activeTab === 'options' ? (
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Extract</h3>
                    <button className="text-gray-700 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Prompt
                        </label>
                        <span className="text-xs text-gray-500">79 / 500</span>
                      </div>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        placeholder="Define schema (e.g., {name, score, location})"
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-t">
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Enable ZIP search</span>
                      </div>
                      <button
                        onClick={() => setEnableWebSearch(!enableWebSearch)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enableWebSearch ? 'bg-teal-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enableWebSearch ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Lead Agent</span>
                      </div>
                      <button
                        onClick={() => setIlliaAgent(!illiaAgent)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          illiaAgent ? 'bg-teal-500' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            illiaAgent ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-sm font-medium text-gray-700">Format</h3>
                      <button className="text-gray-700 hover:text-gray-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Schema
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Format</span>
                          <select className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            <option>CSV</option>
                            <option>JSON</option>
                            <option>Excel</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        className="w-full min-h-[100px] px-3 py-2 border border-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        placeholder="Define schema (e.g., {name, email, score >80, location: Charleston})"
                      />
                    </div>

                    <div className="space-y-2">
                      {schemaFields.map((field) => (
                        <div key={field.id}>
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                            <GripVertical className="h-4 w-4 text-gray-700" />
                            <span className="text-sm font-medium">business</span>
                            <select className="text-sm bg-white border rounded px-2 py-1 ml-auto">
                              <option>Object</option>
                            </select>
                            <button className="text-gray-700 hover:text-gray-600">
                              <Plus className="h-4 w-4" />
                            </button>
                            <button className="text-gray-700 hover:text-gray-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {field.children?.map((child) => (
                            <div key={child.id} className="flex items-center space-x-2 p-2 ml-8">
                              <GripVertical className="h-4 w-4 text-gray-700" />
                              <span className="text-sm">{child.name}</span>
                              <select className="text-sm bg-white border rounded px-2 py-1 ml-auto">
                                <option>{child.type}</option>
                              </select>
                              <button className="text-teal-500">
                                <span className="text-lg">*</span>
                              </button>
                              <button className="text-gray-700 hover:text-gray-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}
                      <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 border-2 border-dashed border-teal-300 rounded-lg hover:border-teal-400">
                        <Plus className="h-4 w-4 inline mr-1" />
                        Add field
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Extract Results Panel */}
              {showExtractPanel && (
                <div className="bg-white rounded-xl border">
                  {isExtracting ? (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium text-gray-700">Extracting...</div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Share2 className="h-4 w-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                            <StopCircle className="h-4 w-4" />
                            <span className="ml-1 text-sm">Stop</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-4xl mb-4 font-bold text-teal-600">IL</div>
                        <p className="text-sm text-gray-600">Parallelizing requests...</p>
                        <div className="mt-8 grid grid-cols-3 gap-2">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-1 w-16 bg-gray-200 rounded animate-pulse" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : extractedData ? (
                    <div>
                      <div className="p-4 border-b flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">Extracted Leads</h3>
                          <p className="text-xs text-gray-500 mt-1">From 1 search query</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Report issue</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                            <Download className="h-4 w-4" />
                            <span>JSON</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <pre className="text-xs font-mono text-gray-700">
                          {`{
  "company": {
    "name": "Illia",
    "mission": "To make web data programmable through our full toolkit that covers web search and extraction, giving developers the tools they need to build powerful AI applications.",
    "is_open_source": true
  }
}`}
                        </pre>
                        <button className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                          <Copy className="h-4 w-4" />
                          <span>Copy as JSON</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Recent Runs */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Extracts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className={`bg-white rounded-xl border p-6 hover:border-teal-500 hover:shadow-lg transition-all cursor-pointer ${run.id % 2 === 0 ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{run.icon}</span>
                        <div className="text-gray-900 font-medium flex items-center">
                          <span className="truncate max-w-[150px]">{run.query}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Mode</span>
                        <span className="font-medium flex items-center">
                          {run.mode === 'Schema' && '📋'}
                          {run.mode === 'Agent' && '🤖'}
                          {run.mode === 'ZIP search' && '📍'}
                          <span className="ml-1">{run.mode}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className="flex items-center">
                          <span className="h-2 w-2 bg-teal-500 rounded-full mr-1.5" />
                          <span className="font-medium text-teal-600">{run.status}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Started</span>
                        <div className="text-right">
                          <div className="font-medium">{run.date}</div>
                          <div className="text-gray-700 text-xs">{run.time}</div>
                        </div>
                      </div>

                      {run.mode && (
                        <div className="pt-3 border-t">
                          <span className="text-xs text-gray-500">
                            Leads found:{' '}
                            {run.mode === 'Schema' ? '12' : run.mode === 'Agent' ? '18' : '15'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intercom Chat */}
      <button className="fixed bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg">
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  )
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
