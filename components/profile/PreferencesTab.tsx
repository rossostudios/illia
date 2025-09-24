'use client'

import { DollarSign, Home, Utensils } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SERVICES, type UserProfile } from '@/types/profile'

type PreferencesTabProps = {
  profile: UserProfile
  onUpdate: (updates: Partial<UserProfile>) => void
}

const iconMap = {
  Home,
  Utensils,
}

export function PreferencesTab({ profile, onUpdate }: PreferencesTabProps) {
  const [formData, setFormData] = useState({
    services: profile.services,
    budget: profile.budget,
  })

  const toggleService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId],
    }))
  }

  const handleSave = () => {
    onUpdate(formData)
  }

  return (
    <div className="space-y-6">
      {/* Services Needed */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          Services Needed
        </label>
        <p className="mb-4 text-gray-600 text-sm dark:text-gray-400">
          Select all services you're interested in
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Home
            const isSelected = formData.services.includes(service.id)
            return (
              <button
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 dark:border-teal-500 dark:bg-teal-900/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                }
                `}
                key={service.id}
                onClick={() => toggleService(service.id)}
              >
                <div
                  className={`rounded-lg p-2 ${
                    isSelected
                      ? 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }
                `}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`font-medium ${
                    isSelected
                      ? 'text-teal-900 dark:text-teal-300'
                      : 'text-gray-900 dark:text-white'
                  }
                `}
                >
                  {service.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          <DollarSign className="mr-2 inline h-4 w-4" />
          Monthly Budget Range (USD)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-gray-600 text-xs dark:text-gray-400">Minimum</label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget: [Number(e.target.value), formData.budget[1]],
                })
              }
              type="number"
              value={formData.budget[0]}
            />
          </div>
          <div>
            <label className="mb-1 block text-gray-600 text-xs dark:text-gray-400">Maximum</label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  budget: [formData.budget[0], Number(e.target.value)],
                })
              }
              type="number"
              value={formData.budget[1]}
            />
          </div>
        </div>
        <p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
          Current range: ${formData.budget[0]} - ${formData.budget[1]} per month
        </p>
      </div>

      {/* Notification Preferences */}
      <div>
        <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
          Notification Preferences
        </label>
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Email Notifications</span>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                Receive important updates via email
              </p>
            </div>
            <input
              checked={profile.notifications.email}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              onChange={(e) =>
                onUpdate({
                  notifications: { ...profile.notifications, email: e.target.checked },
                })
              }
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">New Matches</span>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                Get notified when providers match your criteria
              </p>
            </div>
            <input
              checked={profile.notifications.matches}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              onChange={(e) =>
                onUpdate({
                  notifications: { ...profile.notifications, matches: e.target.checked },
                })
              }
              type="checkbox"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  )
}
