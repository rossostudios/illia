'use client'

import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'
import ProviderList from './ProviderList'

type ProviderApprovalTabsProps = {
  pendingProviders: any[]
  approvedProviders: any[]
  rejectedProviders: any[]
  suspendedProviders: any[]
}

export default function ProviderApprovalTabs({
  pendingProviders,
  approvedProviders,
  rejectedProviders,
  suspendedProviders,
}: ProviderApprovalTabsProps) {
  const [activeTab, setActiveTab] = useState('pending')

  const tabs = [
    {
      id: 'pending',
      label: 'Pending',
      count: pendingProviders.length,
      icon: Clock,
      color: 'yellow',
    },
    {
      id: 'approved',
      label: 'Approved',
      count: approvedProviders.length,
      icon: CheckCircle,
      color: 'green',
    },
    {
      id: 'rejected',
      label: 'Rejected',
      count: rejectedProviders.length,
      icon: XCircle,
      color: 'red',
    },
    {
      id: 'suspended',
      label: 'Suspended',
      count: suspendedProviders.length,
      icon: AlertCircle,
      color: 'orange',
    },
  ]

  const getProvidersByTab = () => {
    switch (activeTab) {
      case 'pending':
        return pendingProviders
      case 'approved':
        return approvedProviders
      case 'rejected':
        return rejectedProviders
      case 'suspended':
        return suspendedProviders
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-gray-200 border-b dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              className={`flex items-center gap-2 border-b-2 px-1 py-3 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }
              `}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }
                `}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <ProviderList providers={getProvidersByTab()} status={activeTab} />
    </div>
  )
}
