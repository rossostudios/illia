'use client'

import { createBrowserClient } from '@supabase/ssr'
import { Bell, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { AdminUser } from '@/lib/admin/auth'
import type { Database } from '@/types/database'

type AdminHeaderProps = {
  adminUser: AdminUser
}

export default function AdminHeader({ adminUser }: AdminHeaderProps) {
  const [notifications, setNotifications] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadData() {
      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('username, display_name, avatar_url')
        .eq('id', adminUser.user_id)
        .single()

      setUserProfile(profile)

      // Get unread notification count
      const { count } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')

      setNotifications(count || 0)
    }

    loadData()
  }, [supabase, adminUser.user_id])

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-gray-200 border-b bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-gray-900 text-xl dark:text-white">Illia Admin</h1>

          <div className="relative">
            <input
              className="w-64 rounded-lg bg-gray-50 py-2 pr-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
              placeholder="Search..."
              type="text"
            />
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            type="button"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                {notifications}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 border-gray-200 border-l pl-4 dark:border-gray-700">
            {userProfile?.avatar_url ? (
              <img
                alt={userProfile.display_name || userProfile.username}
                className="h-8 w-8 rounded-full object-cover"
                src={userProfile.avatar_url}
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900 text-sm dark:text-white">
                {userProfile?.display_name || userProfile?.username}
              </p>
              <p className="text-gray-500 text-xs dark:text-gray-400">
                {adminUser.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
