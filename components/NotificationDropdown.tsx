'use client'

import { Bell, X } from 'lucide-react'
import { useState } from 'react'

type NotificationDropdownProps = {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  return (
    <div className="absolute top-12 right-0 z-50 w-96 rounded-xl border bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="font-semibold text-lg">Notifications</h3>
        <button className="text-gray-400 hover:text-gray-600" onClick={onClose} type="button">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`flex-1 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'all'
              ? 'border-orange-600 border-b-2 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`flex-1 px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'unread'
              ? 'border-orange-600 border-b-2 text-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('unread')}
        >
          Unread
        </button>
      </div>

      {/* Notifications Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Concurrency Limit Warning */}
        <div className="cursor-pointer border-b p-4 hover:bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="mt-2 h-2 w-2 rounded-full bg-red-500" />
            <div className="flex-1">
              <p className="text-gray-900 text-sm">
                You&apos;re hitting your concurrency limit very often. This means that you could be
                scraping faster. If you&apos;d like to increase it, please upgrade your plan.
              </p>
              <p className="mt-1 text-gray-500 text-xs">about 4 hours ago</p>
            </div>
          </div>
        </div>

        {/* Empty State for Unread */}
        {activeTab === 'unread' && (
          <div className="p-8 text-center">
            <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500 text-sm">No unread notifications</p>
          </div>
        )}
      </div>

      {/* Mark all as read */}
      {activeTab === 'all' && (
        <div className="border-t px-4 py-3">
          <button className="font-medium text-orange-600 text-sm hover:text-orange-700">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  )
}
