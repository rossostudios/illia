'use client'

import { Check, CreditCard, Download, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { UserProfile } from '@/types/profile'

type MembershipTabProps = {
  profile: UserProfile
  onUpgrade: () => void
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    features: ['5 matches per month', 'Basic search filters', 'Community forum access'],
  },
  {
    name: 'Premium',
    price: '$9',
    features: [
      '20 matches per month',
      'Advanced search filters',
      'Priority support',
      'Save favorite providers',
      'Message history',
    ],
  },
  {
    name: 'Professional',
    price: '$29',
    features: [
      'Unlimited matches',
      'All premium features',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
    ],
  },
]

export function MembershipTab({ profile, onUpgrade }: MembershipTabProps) {
  const currentPlan = PLANS.find((p) => p.name.toLowerCase() === profile.tier) || PLANS[0]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-900/20">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-teal-900 dark:text-teal-300">
              Current Plan: {currentPlan.name}
            </h3>
            <p className="mt-1 text-teal-700 dark:text-teal-400">
              {profile.matchesUsed} of {profile.matchesLimit} matches used this month
            </p>
          </div>
          <span className="font-bold text-2xl text-teal-900 dark:text-teal-300">
            {currentPlan.price}/mo
          </span>
        </div>
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-teal-200 dark:bg-teal-800">
            <div
              className="h-2 rounded-full bg-teal-600"
              style={{ width: `${(profile.matchesUsed / profile.matchesLimit) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Available Plans</h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.name.toLowerCase() === profile.tier
            return (
              <div
                className={`rounded-lg border p-6 ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-900/20'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                }
                `}
                key={plan.name}
              >
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 text-lg dark:text-white">
                    {plan.name}
                  </h4>
                  <p className="mt-2 font-bold text-3xl text-gray-900 dark:text-white">
                    {plan.price}
                    <span className="font-normal text-gray-600 text-lg dark:text-gray-400">
                      /mo
                    </span>
                  </p>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li className="flex items-start gap-2" key={index}>
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                      <span className="text-gray-600 text-sm dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="w-full" disabled variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={onUpgrade}
                    variant={plan.name === 'Premium' ? 'default' : 'outline'}
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Billing History */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Billing History</h3>
          <Button size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900 text-xs uppercase tracking-wider dark:text-white">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 text-xs uppercase tracking-wider dark:text-white">
                  Description
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-900 text-xs uppercase tracking-wider dark:text-white">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {profile.billingHistory.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-gray-600 text-sm dark:text-gray-400">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 text-gray-900 text-sm dark:text-white">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 text-sm dark:text-white">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Payment Method</h3>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  No payment method on file
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  Add a card to upgrade your plan
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Add Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
