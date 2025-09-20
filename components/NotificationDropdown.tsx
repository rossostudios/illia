'use client'

import { useState } from 'react'
import { X, Bell } from 'lucide-react'

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  return (
    <div className="absolute top-12 right-0 w-96 bg-white rounded-xl shadow-2xl border z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'unread'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Notifications Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Concurrency Limit Warning */}
        <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
          <div className="flex items-start space-x-3">
            <div className="h-2 w-2 bg-red-500 rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                You're hitting your concurrency limit very often. This means that you could be scraping faster.
                If you'd like to increase it, please upgrade your plan.
              </p>
              <p className="text-xs text-gray-500 mt-1">about 4 hours ago</p>
            </div>
          </div>
        </div>

        {/* Empty State for Unread */}
        {activeTab === 'unread' && (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No unread notifications</p>
          </div>
        )}
      </div>

      {/* Mark all as read */}
      {activeTab === 'all' && (
        <div className="px-4 py-3 border-t">
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  )
}