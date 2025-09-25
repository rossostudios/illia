import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export default async function AdminDashboard() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!(supabaseUrl && supabaseKey)) {
    throw new Error('Missing Supabase environment variables')
  }

  const _supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (_error) {
          // Server Component, ignore
        }
      },
    },
  })

  // For now, just show a simple dashboard
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your admin panel! You have full control over the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <h2 className="mb-2 font-semibold text-gray-700 text-lg dark:text-gray-300">
            Total Users
          </h2>
          <p className="font-bold text-3xl text-blue-600 dark:text-blue-400">--</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <h2 className="mb-2 font-semibold text-gray-700 text-lg dark:text-gray-300">
            Active Bookings
          </h2>
          <p className="font-bold text-3xl text-green-600 dark:text-green-400">--</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
          <h2 className="mb-2 font-semibold text-gray-700 text-lg dark:text-gray-300">
            Pending Approvals
          </h2>
          <p className="font-bold text-3xl text-yellow-600 dark:text-yellow-400">--</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        <h2 className="mb-4 font-semibold text-gray-700 text-xl dark:text-gray-300">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            className="rounded-lg bg-blue-500 p-4 text-white transition hover:bg-blue-600"
            type="button"
          >
            Manage Users
          </button>
          <button
            className="rounded-lg bg-green-500 p-4 text-white transition hover:bg-green-600"
            type="button"
          >
            View Bookings
          </button>
          <button
            className="rounded-lg bg-purple-500 p-4 text-white transition hover:bg-purple-600"
            type="button"
          >
            Approve Providers
          </button>
        </div>
      </div>
    </div>
  )
}
