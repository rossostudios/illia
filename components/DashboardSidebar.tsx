'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  Home,
  Play,
  FileText,
  BarChart3,
  Key,
  Settings,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  X
} from 'lucide-react'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [showExtractMenu, setShowExtractMenu] = useState(pathname.includes('/extract'))
  const [showWhatsNew, setShowWhatsNew] = useState(true)

  const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Play, label: 'Playground', href: '/dashboard/playground' },
    {
      icon: FileText,
      label: 'Extract',
      href: '/dashboard/extract',
      hasSubmenu: true,
      isOpen: showExtractMenu,
      submenu: [
        { label: 'Overview', href: '/dashboard/extract' },
        { label: 'Playground', href: '/dashboard/extract/playground' }
      ]
    },
    { icon: BarChart3, label: 'Activity Logs', href: '/dashboard/logs' },
    { icon: BarChart3, label: 'Usage', href: '/dashboard/usage' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ]

  return (
    <div className="fixed inset-y-0 left-0 w-56 bg-white border-r flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <span className="text-xl md:text-2xl font-bold text-teal-800 drop-shadow-sm transition-all group-hover:text-teal-900 group-hover:drop-shadow-md">
            Illia
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search past leads..."
            className="w-full pl-9 pr-3 py-2 bg-gray-200 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
          <kbd className="absolute right-2 top-2 text-xs bg-white border rounded px-1">⌘K</kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1 flex-1">
        {sidebarItems.map((item) => {
          const isActive = item.hasSubmenu
            ? pathname.includes(item.href)
            : pathname === item.href

          return (
            <div key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
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
                  <ChevronDown className={`h-4 w-4 transition-transform ${item.isOpen ? 'rotate-180' : ''}`} />
                )}
              </Link>
              {item.hasSubmenu && item.isOpen && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.submenu?.map((subitem) => (
                    <Link
                      key={subitem.label}
                      href={subitem.href}
                      className={`block px-3 py-2 text-sm rounded-lg ${
                        pathname === subitem.href
                          ? 'text-teal-600 bg-teal-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* What's New */}
      {showWhatsNew && (
        <div className="px-4 pb-3">
          <div className="bg-teal-50 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-semibold text-teal-600">What&apos;s New (5)</span>
              </div>
              <button
                onClick={() => setShowWhatsNew(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-gray-600">View our latest update</p>
          </div>
        </div>
      )}

      {/* User section and Collapse */}
      <div className="border-t bg-white">
        {/* User email */}
        <div className="px-4 py-3 flex items-center space-x-3">
          <div className="h-6 w-6 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-teal-600">S</span>
          </div>
          <span className="text-xs text-gray-700">samlee@content-mobbin.com</span>
        </div>

        {/* Collapse button */}
        <button className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-t">
          <ChevronLeft className="h-3 w-3" />
          <span>Collapse</span>
        </button>
      </div>
    </div>
  )
}