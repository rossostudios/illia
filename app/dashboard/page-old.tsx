'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import OnboardingModal from '@/components/OnboardingModal'
import OnboardingSurvey from '@/components/OnboardingSurvey'
import RecentLeads from '@/components/RecentLeads'
import GenerateLeadsModal from '@/components/GenerateLeadsModal'
import { useSession } from '@/hooks/useSession'
import { useTier } from '@/hooks/useTier'
import { useCredits } from '@/hooks/useCredits'
import { useRecentLeads } from '@/hooks/useRecentLeads'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
import {
  Eye,
  EyeOff,
  Copy,
  MessageSquare,
  Loader2,
  Sparkles
} from 'lucide-react'

type Lead = Database['public']['Tables']['illia_leads']['Row']
type Log = Database['public']['Tables']['illia_leads_logs']['Row']
type Purchase = Database['public']['Tables']['purchases']['Row']

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, loading: sessionLoading } = useSession()
  const { tier, loading: tierLoading } = useTier()
  const { credits, loading: creditsLoading, refetch: refetchCredits } = useCredits()
  const { recentLeads, loading: leadsLoading, refetch: refetchLeads } = useRecentLeads()

  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSurvey, setShowSurvey] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [generatingLeads, setGeneratingLeads] = useState(false)

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login')
    } else if (user) {
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
  }, [user, sessionLoading, router])

  const handleGenerateFirstLeads = async () => {
    if (!user?.email) return

    setGeneratingLeads(true)
    try {
      // Insert to logs
      await supabase
        .from('illia_leads_logs')
        .insert({
          user_email: user.email,
          niche: 'plumbers',
          zip_code: '29401',
          count: 5,
          status: 'success'
        })

      // Insert mock leads
      const mockLeads = [
        { name: 'Sample Plumber', score: 95 },
        { name: 'Charleston Plumbing Co', score: 92 },
        { name: 'Lowcountry Pipes', score: 88 },
        { name: 'Harbor Plumbing', score: 85 },
        { name: 'Ashley River Plumbers', score: 82 }
      ]

      for (const lead of mockLeads) {
        await supabase
          .from('illia_leads')
          .insert({
            user_email: user.email,
            niche: 'plumbers',
            zip_code: '29401',
            name: lead.name,
            score: lead.score,
            email: `contact@${lead.name.toLowerCase().replace(/\s+/g, '')}.com`,
            phone: '(843) 555-0100',
            status: 'new'
          })
      }

      // Refetch data
      await refetchCredits()
      await refetchLeads()
    } catch (error) {
      console.error('Error generating leads:', error)
    } finally {
      setGeneratingLeads(false)
    }
  }

  const handleSurveyComplete = () => {
    setShowSurvey(false)
    setShowOnboarding(true)
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem('hasSeenOnboarding', 'true')
  }

  const handleGenerateSuccess = async () => {
    await refetchCredits()
    await refetchLeads()
  }

  const endpoints = [
    {
      title: 'Quick Generate',
      icon: '⚡',
      description: 'Get ready-to-call leads from Charleston ZIPs.',
      bottomContent: 'Niche: plumbers | ZIP: 29401',
      borderClass: 'border-l-4 border-l-teal-500',
      onClick: () => setShowGenerateModal(true)
    },
    {
      title: 'Recent Leads',
      icon: '🔍',
      badge: 'NEW',
      badgeColor: 'bg-teal-100 text-teal-600',
      description: 'Top 3 from your last run.',
      bottomContent: 'Sample Plumber (95)\nCharleston HVAC (92)\nLowcountry Electric (88)',
      link: '/dashboard/leads'
    },
    {
      title: 'Analytics',
      icon: '📊',
      description: 'Track your Lowcountry ROI.',
      bottomContent: 'Conversion Rate: 25% Last 7 days',
      link: '/dashboard/analytics'
    },
    {
      title: 'Upgrade',
      icon: '✨',
      description: 'Unlock Pro for 30+ leads.',
      bottomContent: 'Unlimited leads\nAdvanced scoring\nPriority support',
      borderClass: 'border-r-4 border-r-orange-500',
      link: '/dashboard/upgrade'
    }
  ]


  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      {/* Dashboard content */}
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-teal-600 mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
            <p className="text-gray-700">Power your Charleston business with AI-scored leads—start generating now.</p>
          </div>

          {/* Endpoint Cards */}
          <section aria-labelledby="endpoints-heading">
            <h2 id="endpoints-heading" className="sr-only">Available API endpoints</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {endpoints.map((endpoint) => {
                const Component = endpoint.onClick ? 'button' : Link
                const props: any = endpoint.onClick
                  ? { onClick: endpoint.onClick, type: 'button' }
                  : { href: endpoint.link }

                return (
                  <Component
                    key={endpoint.title}
                    {...props}
                    className={`bg-white rounded-xl p-6 border hover:border-teal-500 hover:shadow-lg transition-all group ${endpoint.borderClass || ''} ${
                      endpoint.onClick ? 'w-full text-left' : ''
                    }`}
                    aria-label={`${endpoint.title} - ${endpoint.description}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl" aria-hidden="true">{endpoint.icon}</span>
                      {endpoint.badge && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${endpoint.badgeColor}`} aria-label={`${endpoint.badge} feature`}>
                          {endpoint.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{endpoint.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{endpoint.description}</p>
                    {endpoint.bottomContent && (
                      <div className="text-xs text-gray-500 mt-auto whitespace-pre-line">
                        {endpoint.bottomContent}
                      </div>
                    )}
                  </Component>
                )
              })}
            </div>
          </section>

          {/* Stats and API Key */}
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Dashboard statistics and settings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Leads Generated chart */}
              <div className="bg-white rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Leads Generated - Last 7 days</h3>
                    <p className="text-sm text-gray-500 mt-1">Credit usage: {creditsUsed} total</p>
                  </div>
                </div>
              <div className="flex items-end justify-center h-32">
                <div className="text-5xl font-bold text-gray-900">{leadsCount}</div>
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                <span>0/21</span>
                <span>00/24</span>
                <span>00/25</span>
              </div>
            </div>

            {/* Your Tier */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">Your Tier</h3>
              <p className="text-sm text-gray-500 mb-4">
                {userTier === 'basic' ? 'Limited to 10 leads per generation' :
                 userTier === 'pro' ? 'Up to 50 leads per generation' :
                 'Unlimited leads per generation'}
              </p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg border border-teal-300" aria-label="Your tier">
                  {userTier.charAt(0).toUpperCase() + userTier.slice(1)} - {user?.email}
                </div>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  aria-label={showApiKey ? "Hide tier info" : "Show tier info"}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Copy tier info">
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
                </button>
                </div>
                </>
              )}
              {!tierLoading && (
                <button className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium">
                  Start Leads →
                </button>
              )}
            </div>

            {/* Integrations */}
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-gray-900 mb-2">Integrations</h3>
              <p className="text-sm text-gray-500 mb-4">Connect with AI tools</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs" aria-label="Integration options">
                <div className="text-teal-400">// Available Integrations</div>
                <div className="mt-2">
                  <span className="text-gray-300">Connect with Zapier</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-300">Export to Sheets</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-300">Webhooks API</span>
                </div>
                <div className="mt-1">
                  <span className="text-gray-300">CRM Sync (Coming Soon)</span>
                </div>
              </div>
            </div>
          </div>
          </section>

          {/* Recent Leads Table */}
          <section className="mb-8">
            <RecentLeads key={refreshKey} />
          </section>

          {/* Usage Trends */}
          <section aria-labelledby="usage-heading">
            <div className="bg-white rounded-xl p-6 border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 id="usage-heading" className="font-semibold text-gray-900">Usage Trends</h3>
                <p className="text-sm text-gray-500 mt-1">
                  0 of 2 active sessions — <Link href="/upgrade" className="text-teal-600 hover:underline">upgrade</Link> for faster leads
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium" aria-label="Live status indicator">
                [ LIVE ]
              </span>
            </div>
            <div className="text-sm text-gray-500">
              0 of 2 active sessions
            </div>
          </div>
          </section>

          {/* What's New */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-semibold mr-3">
                  What's New (5)
                </span>
                <p className="text-sm text-gray-700">
                  View our latest update: Charleston tourist scoring
                </p>
              </div>
              <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                View All →
              </button>
            </div>
          </div>

        {/* Welcome Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">Welcome to Illia!</p>
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

      {/* Generate Leads Modal */}
      <GenerateLeadsModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSuccess={handleGenerateSuccess}
      />

      {/* Intercom Chat */}
      <button
        className="fixed bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg"
        aria-label="Open chat support"
      >
        <MessageSquare className="h-6 w-6" aria-hidden="true" />
      </button>
    </>
  )
}