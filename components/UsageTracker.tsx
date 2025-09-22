'use client'

import { Activity, Phone, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getRemainingCredits, TIER_LIMITS } from '@/lib/polar'

interface UsageTrackerProps {
  subscriptionTier: 'explorer' | 'settler' | 'local'
  customerId?: string
}

export default function UsageTracker({ subscriptionTier, customerId }: UsageTrackerProps) {
  const [credits, setCredits] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCredits() {
      if (!customerId) {
        // If no customer ID, just show the limits
        setCredits({
          matchRequests: {
            used: 0,
            limit: TIER_LIMITS[subscriptionTier].matchRequests,
            remaining: TIER_LIMITS[subscriptionTier].matchRequests,
          },
          apiCalls: {
            used: 0,
            limit: TIER_LIMITS[subscriptionTier].apiCalls,
            remaining: TIER_LIMITS[subscriptionTier].apiCalls,
          },
          conciergeRequests: {
            used: 0,
            limit: TIER_LIMITS[subscriptionTier].conciergeRequests,
            remaining: TIER_LIMITS[subscriptionTier].conciergeRequests,
          },
        })
        setLoading(false)
        return
      }

      try {
        const remainingCredits = await getRemainingCredits(customerId, subscriptionTier)
        setCredits(remainingCredits)
      } catch (error) {
        console.error('Error fetching credits:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [customerId, subscriptionTier])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-100 rounded-lg"></div>
      </div>
    )
  }

  if (!credits) return null

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getProgressWidth = (used: number, limit: number) => {
    if (limit === 9999) return '0%' // Unlimited
    return `${Math.min((used / limit) * 100, 100)}%`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>

      <div className="space-y-4">
        {/* Match Requests */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Match Requests</span>
            </div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                credits.matchRequests.limit === 9999
                  ? 'text-teal-600 bg-teal-100'
                  : getUsageColor(credits.matchRequests.used, credits.matchRequests.limit)
              }`}
            >
              {credits.matchRequests.limit === 9999
                ? 'Unlimited'
                : `${credits.matchRequests.used} / ${credits.matchRequests.limit}`}
            </span>
          </div>
          {credits.matchRequests.limit !== 9999 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all"
                style={{
                  width: getProgressWidth(credits.matchRequests.used, credits.matchRequests.limit),
                }}
              />
            </div>
          )}
        </div>

        {/* API Calls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">API Calls</span>
            </div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                credits.apiCalls.limit === 9999
                  ? 'text-teal-600 bg-teal-100'
                  : getUsageColor(credits.apiCalls.used, credits.apiCalls.limit)
              }`}
            >
              {credits.apiCalls.limit === 9999
                ? 'Unlimited'
                : `${credits.apiCalls.used} / ${credits.apiCalls.limit}`}
            </span>
          </div>
          {credits.apiCalls.limit !== 9999 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all"
                style={{ width: getProgressWidth(credits.apiCalls.used, credits.apiCalls.limit) }}
              />
            </div>
          )}
        </div>

        {/* Concierge Requests (Local tier only) */}
        {subscriptionTier === 'local' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Concierge Requests</span>
              </div>
              <span className="text-sm font-medium px-2 py-1 rounded-full text-sunset-600 bg-sunset-100">
                {credits.conciergeRequests.used} / {credits.conciergeRequests.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-sunset-600 h-2 rounded-full transition-all"
                style={{
                  width: getProgressWidth(
                    credits.conciergeRequests.used,
                    credits.conciergeRequests.limit
                  ),
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Usage tip */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <Activity className="h-4 w-4 text-gray-500 mt-0.5" />
          <div>
            <p className="text-xs text-gray-600">
              {subscriptionTier === 'explorer' &&
                'Upgrade to Settler for 20 match requests per month'}
              {subscriptionTier === 'settler' &&
                'Upgrade to Local for unlimited matches and concierge service'}
              {subscriptionTier === 'local' && 'You have unlimited access to all features'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
