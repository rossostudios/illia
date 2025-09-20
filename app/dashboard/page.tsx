'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OnboardingModal from '@/components/OnboardingModal'
import OnboardingSurvey from '@/components/OnboardingSurvey'
import NotificationDropdown from '@/components/NotificationDropdown'
import DashboardSidebar from '@/components/DashboardSidebar'
import {
  Search,
  Home,
  Play,
  FileText,
  BarChart3,
  Key,
  Settings,
  ChevronDown,
  Eye,
  EyeOff,
  Copy,
  Bell,
  HelpCircle,
  FileCode,
  X,
  ExternalLink,
  Sparkles,
  Globe,
  Brain,
  MessageSquare
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/signup')
    } else {
      setIsAuthenticated(true)
      const surveyCompleted = localStorage.getItem('onboardingSurveyCompleted')
      if (!surveyCompleted) {
        setShowSurvey(true)
      } else {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
        if (!hasSeenOnboarding) {
          setShowOnboarding(true)
        }
      }
    }
  }, [router])

  const handleSurveyComplete = () => {
    setShowSurvey(false)
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  const apiKey = 'fc-9*********************************aebf'

  const endpoints = [
    {
      title: 'Scrape',
      icon: '⚡',
      description: 'Get llm-ready data from websites. Markdown, JSON, screenshot, etc.',
      link: '/dashboard/scrape'
    },
    {
      title: 'Search',
      icon: '🔍',
      badge: 'NEW',
      badgeColor: 'bg-orange-100 text-orange-600',
      description: 'Search the web and get full content from results.',
      link: '/dashboard/search'
    },
    {
      title: 'Crawl',
      icon: '🕸️',
      description: 'Crawl all the pages on a website and get data for each page.',
      link: '/dashboard/crawl'
    },
    {
      title: 'Extract',
      icon: '🧠',
      description: 'Get structured data from websites with AI.',
      link: '/dashboard/extract'
    }
  ]


  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

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
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-orange-600 rounded-full" />
                </button>
                {showNotifications && (
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                )}
              </div>
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

        {/* Dashboard content */}
        <div className="p-8">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore our endpoints</h1>
            <p className="text-gray-600">Power your applications with our comprehensive scraping API</p>
          </div>

          {/* Endpoint Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {endpoints.map((endpoint) => (
              <Link
                key={endpoint.title}
                href={endpoint.link}
                className="bg-white rounded-xl p-6 border hover:border-orange-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{endpoint.icon}</span>
                  {endpoint.badge && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${endpoint.badgeColor}`}>
                      {endpoint.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{endpoint.title}</h3>
                <p className="text-sm text-gray-600">{endpoint.description}</p>
              </Link>
            ))}
          </div>

          {/* Stats and API Key */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Scraped pages chart */}
            <div className="bg-white rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Scraped pages - Last 7 days</h3>
                  <p className="text-sm text-gray-500 mt-1">Credit usage differs</p>
                </div>
              </div>
              <div className="flex items-end justify-center h-32">
                <div className="text-5xl font-bold text-gray-900">0</div>
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>0/21</span>
                <span>00/24</span>
                <span>00/25</span>
              </div>
            </div>

            {/* API Key */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">API Key</h3>
              <p className="text-sm text-gray-500 mb-4">Start scraping right away</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border">
                  {showApiKey ? apiKey : apiKey.substring(0, 10) + '•'.repeat(25) + 'aebf'}
                </div>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* MCP Integration */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">MCP Integration</h3>
              <p className="text-sm text-gray-500 mb-4">Connect with AI tools</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs">
                <div className="text-gray-400">{`{`}</div>
                <div className="ml-4">
                  <span className="text-purple-400">"mcpServers"</span>: {`{`}
                </div>
                <div className="ml-8">
                  <span className="text-purple-400">"firecrawl-mcp"</span>: {`{`}
                </div>
                <div className="ml-12">
                  <span className="text-purple-400">"command"</span>: <span className="text-green-400">"npx"</span>,
                </div>
                <div className="ml-12">
                  <span className="text-purple-400">"args"</span>: [<span className="text-green-400">"-y"</span>, <span className="text-orange-400">"firecrawl-mcp"</span>],
                </div>
                <div className="ml-12">
                  <span className="text-purple-400">"env"</span>: {`{`}
                </div>
                <div className="ml-16">
                  <span className="text-purple-400">"FIRECRAWL_API_KEY"</span>: <span className="text-orange-400">"$API_KEY"</span>
                </div>
                <div className="ml-12">{`}`}</div>
                <div className="ml-8">{`}`}</div>
                <div className="ml-4">{`}`}</div>
                <div>{`}`}</div>
              </div>
            </div>
          </div>

          {/* Browsers Status */}
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Concurrent Browsers</h3>
                <p className="text-sm text-gray-500 mt-1">
                  0 active browsers — <Link href="/upgrade" className="text-orange-600 hover:underline">upgrade plan</Link> for faster scraping
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                [ LIVE ]
              </span>
            </div>
            <div className="text-sm text-gray-500">
              0 of 2 active browsers
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">Welcome to Firecrawl! 🔥</p>
          </div>
        </div>
      </div>

      {/* Onboarding Survey */}
      <OnboardingSurvey
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        onComplete={handleSurveyComplete}
      />

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

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