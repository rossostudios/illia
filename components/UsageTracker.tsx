'use client'

import { Activity, Phone, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getRemainingCredits, TIER_LIMITS } from '@/lib/polar'

type UsageTrackerProps = {
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
      } catch (_error) {
        // Error handled silently
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [customerId, subscriptionTier])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 rounded-lg bg-gray-100" />
      </div>
    )
  }

  if (!credits) {
    return null
  }

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) {
      return 'text-red-600 bg-red-100'
    }
    if (percentage >= 70) {
      return 'text-yellow-600 bg-yellow-100'
    }
    return 'text-green-600 bg-green-100'
  }

  const getProgressWidth = (used: number, limit: number) => {
    if (limit === 9999) {
      return '0%' // Unlimited
    }
    return `${Math.min((used / limit) * 100, 100)}%`
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900 text-lg">Usage This Month</h3>

      <div className="space-y-4">
        {/* Match Requests */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700 text-sm">Match Requests</span>
            </div>
            <span
              className={`rounded-full px-2 py-1 font-medium text-sm ${
                credits.matchRequests.limit === 9999
                  ? 'bg-teal-100 text-teal-600'
                  : getUsageColor(credits.matchRequests.used, credits.matchRequests.limit)
              }`}
            >
              {credits.matchRequests.limit === 9999
                ? 'Unlimited'
                : `${credits.matchRequests.used} / ${credits.matchRequests.limit}`}
            </span>
          </div>
          {credits.matchRequests.limit !== 9999 && (
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-teal-600 transition-all"
                style={{
                  width: getProgressWidth(credits.matchRequests.used, credits.matchRequests.limit),
                }}
              />
            </div>
          )}
        </div>

        {/* API Calls */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700 text-sm">API Calls</span>
            </div>
            <span
              className={`rounded-full px-2 py-1 font-medium text-sm ${
                credits.apiCalls.limit === 9999
                  ? 'bg-teal-100 text-teal-600'
                  : getUsageColor(credits.apiCalls.used, credits.apiCalls.limit)
              }`}
            >
              {credits.apiCalls.limit === 9999
                ? 'Unlimited'
                : `${credits.apiCalls.used} / ${credits.apiCalls.limit}`}
            </span>
          </div>
          {credits.apiCalls.limit !== 9999 && (
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-teal-600 transition-all"
                style={{ width: getProgressWidth(credits.apiCalls.used, credits.apiCalls.limit) }}
              />
            </div>
          )}
        </div>

        {/* Concierge Requests (Local tier only) */}
        {subscriptionTier === 'local' && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700 text-sm">Concierge Requests</span>
              </div>
              <span className="rounded-full bg-sunset-100 px-2 py-1 font-medium text-sm text-sunset-600">
                {credits.conciergeRequests.used} / {credits.conciergeRequests.limit}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-sunset-600 transition-all"
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
      <div className="mt-4 rounded-lg bg-gray-50 p-3">
        <div className="flex items-start gap-2">
          <Activity className="mt-0.5 h-4 w-4 text-gray-500" />
          <div>
            <p className="text-gray-600 text-xs">
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
