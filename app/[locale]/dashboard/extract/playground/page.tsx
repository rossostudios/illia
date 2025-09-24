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
  const [extractedData, setExtractedData] = useState<Record<string, unknown> | null>(null)
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
      <div className="fixed inset-y-0 left-0 w-56 border-r bg-white">
        {/* Logo */}
        <div className="border-b p-4">
          <Link className="flex items-center space-x-2" href="/dashboard">
            <span className="font-bold text-2xl text-orange-600">IL</span>
            <span className="font-semibold text-xl">Illia</span>
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
                      className={`block rounded-lg px-3 py-2 text-sm ${
                        subitem.active
                          ? 'bg-teal-50 text-teal-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
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
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-gray-600 text-xs">View our latest update</p>
            </div>

            {/* User email */}
            <div className="mt-4 px-3 py-2 text-gray-500 text-xs">samlee@content-mobbin.com</div>

            {/* Collapse button */}
            <button
              className="mt-2 flex items-center space-x-2 text-gray-600 text-xs hover:text-gray-900"
              type="button"
            >
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
              <div className="flex items-center space-x-2 rounded-lg bg-orange-100 px-3 py-1 text-orange-700">
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

        {/* Extract Playground content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 flex items-center justify-center font-bold text-3xl text-teal-600">
              <Play className="mr-2 h-8 w-8" />
              Lead Extract Playground
            </h1>
            <p className="text-gray-700">
              Lead Extract Playground - Test custom schemas in one place
            </p>
          </div>

          {/* Main Interface */}
          <div className="mx-auto max-w-7xl">
            {/* Lead Query Input and Controls */}
            <div className="mb-6 rounded-xl border bg-white p-4">
              <div className="space-y-3">
                <label className="font-medium text-gray-700 text-xs">Lead Query</label>
                <div className="flex items-center space-x-3">
                  <input
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-200 px-3 py-2 text-gray-900 text-sm placeholder:text-gray-600 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter lead query (e.g., plumbers 29401)"
                    type="text"
                    value={url}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-gray-500 text-sm">+</span>
                  <input
                    className="flex-1 px-3 py-2 text-gray-500 text-sm outline-none hover:text-teal-600"
                    onChange={(e) => setAdditionalUrl(e.target.value)}
                    placeholder="Add another ZIP or niche"
                    type="text"
                    value={additionalUrl}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button className="text-gray-700 hover:text-gray-600" type="button">
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="flex overflow-hidden rounded-lg border">
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'options'
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setActiveTab('options')}
                      type="button"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Options</span>
                      {activeTab === 'options' && (
                        <span className="h-2 w-2 rounded-full bg-teal-500" />
                      )}
                    </button>
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === 'schema'
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setActiveTab('schema')}
                      type="button"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Schema</span>
                      {activeTab === 'schema' && (
                        <span className="h-2 w-2 rounded-full bg-teal-500" />
                      )}
                    </button>
                  </div>

                  <button
                    className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="font-medium text-sm">Get Schema Code</span>
                  </button>

                  <button
                    className="rounded-lg bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
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
                    type="button"
                  >
                    Start Extracting Leads
                  </button>
                </div>
              </div>
            </div>

            {/* Options/Schema Panel and Extract Panel */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Options or Schema Panel */}
              {activeTab === 'options' ? (
                <div className="rounded-xl border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium text-gray-700 text-sm">Extract</h3>
                    <button className="text-gray-700 hover:text-gray-600" type="button">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="flex items-center font-medium text-gray-700 text-sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Prompt
                        </label>
                        <span className="text-gray-500 text-xs">79 / 500</span>
                      </div>
                      <textarea
                        className="min-h-[100px] w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Define schema (e.g., {name, score, location})"
                        value={prompt}
                      />
                    </div>

                    <div className="flex items-center justify-between border-t py-3">
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-700" />
                        <span className="font-medium text-gray-700 text-sm">Enable ZIP search</span>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enableWebSearch ? 'bg-teal-500' : 'bg-gray-200'
                        }`}
                        onClick={() => setEnableWebSearch(!enableWebSearch)}
                        type="button"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enableWebSearch ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t py-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-gray-700" />
                        <span className="font-medium text-gray-700 text-sm">Lead Agent</span>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          illiaAgent ? 'bg-teal-500' : 'bg-gray-200'
                        }`}
                        onClick={() => setIlliaAgent(!illiaAgent)}
                        type="button"
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
                <div className="rounded-xl border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-medium text-gray-700 text-sm">Format</h3>
                      <button className="text-gray-700 hover:text-gray-600" type="button">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="flex items-center font-medium text-gray-700 text-sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Schema
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-700 text-sm">Format</span>
                          <select className="rounded bg-gray-100 px-2 py-1 text-gray-600 text-sm">
                            <option>CSV</option>
                            <option>JSON</option>
                            <option>Excel</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        className="min-h-[100px] w-full resize-none rounded-lg border border-teal-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Define schema (e.g., {name, email, score >80, location: Charleston})"
                      />
                    </div>

                    <div className="space-y-2">
                      {schemaFields.map((field) => (
                        <div key={field.id}>
                          <div className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2">
                            <GripVertical className="h-4 w-4 text-gray-700" />
                            <span className="font-medium text-sm">business</span>
                            <select className="ml-auto rounded border bg-white px-2 py-1 text-sm">
                              <option>Object</option>
                            </select>
                            <button className="text-gray-700 hover:text-gray-600" type="button">
                              <Plus className="h-4 w-4" />
                            </button>
                            <button className="text-gray-700 hover:text-gray-600" type="button">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          {field.children?.map((child) => (
                            <div className="ml-8 flex items-center space-x-2 p-2" key={child.id}>
                              <GripVertical className="h-4 w-4 text-gray-700" />
                              <span className="text-sm">{child.name}</span>
                              <select className="ml-auto rounded border bg-white px-2 py-1 text-sm">
                                <option>{child.type}</option>
                              </select>
                              <button className="text-teal-500" type="button">
                                <span className="text-lg">*</span>
                              </button>
                              <button className="text-gray-700 hover:text-gray-600" type="button">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}
                      <button
                        className="w-full rounded-lg border-2 border-teal-300 border-dashed py-2 text-gray-600 text-sm hover:border-teal-400 hover:text-gray-900"
                        type="button"
                      >
                        <Plus className="mr-1 inline h-4 w-4" />
                        Add field
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Extract Results Panel */}
              {showExtractPanel && (
                <div className="rounded-xl border bg-white">
                  {isExtracting ? (
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="font-medium text-gray-700 text-sm">Extracting...</div>
                        <div className="flex items-center space-x-2">
                          <button className="rounded-lg p-2 hover:bg-gray-100" type="button">
                            <Share2 className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-600 hover:bg-gray-100"
                            type="button"
                          >
                            <StopCircle className="h-4 w-4" />
                            <span className="ml-1 text-sm">Stop</span>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="mb-4 font-bold text-4xl text-teal-600">IL</div>
                        <p className="text-gray-600 text-sm">Parallelizing requests...</p>
                        <div className="mt-8 grid grid-cols-3 gap-2">
                          {[...new Array(12)].map((_, i) => (
                            <div className="h-1 w-16 animate-pulse rounded bg-gray-200" key={i} />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : extractedData ? (
                    <div>
                      <div className="flex items-center justify-between border-b p-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">Extracted Leads</h3>
                          <p className="mt-1 text-gray-500 text-xs">From 1 search query</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="flex items-center space-x-1 text-gray-600 text-sm hover:text-gray-900"
                            type="button"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <span>Report issue</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 text-gray-600 text-sm hover:text-gray-900"
                            type="button"
                          >
                            <Download className="h-4 w-4" />
                            <span>JSON</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <pre className="font-mono text-gray-700 text-xs">
                          {`{
  "company": {
    "name": "Illia",
    "mission": "To make web data programmable through our full toolkit that covers web search and extraction, giving developers the tools they need to build powerful AI applications.",
    "is_open_source": true
  }
}`}
                        </pre>
                        <button
                          className="mt-4 flex items-center space-x-1 text-gray-600 text-sm hover:text-gray-900"
                          type="button"
                        >
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
              <h2 className="mb-4 font-semibold text-gray-900 text-lg">Recent Extracts</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {recentRuns.map((run) => (
                  <div
                    className={`cursor-pointer rounded-xl border bg-white p-6 transition-all hover:border-teal-500 hover:shadow-lg ${run.id % 2 === 0 ? 'bg-gray-50' : ''}`}
                    key={run.id}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{run.icon}</span>
                        <div className="flex items-center font-medium text-gray-900">
                          <span className="max-w-[150px] truncate">{run.query}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Mode</span>
                        <span className="flex items-center font-medium">
                          {run.mode === 'Schema' && '📋'}
                          {run.mode === 'Agent' && '🤖'}
                          {run.mode === 'ZIP search' && '📍'}
                          <span className="ml-1">{run.mode}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className="flex items-center">
                          <span className="mr-1.5 h-2 w-2 rounded-full bg-teal-500" />
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
                        <div className="border-t pt-3">
                          <span className="text-gray-500 text-xs">
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
