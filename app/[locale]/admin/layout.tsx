import { requireAdmin } from '@/lib/admin/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is admin
  const adminUser = await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Simple header */}
      <header className="bg-white shadow dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="font-semibold text-xl">Admin Panel</h1>
            <div className="text-gray-500 text-sm">Role: {adminUser.role}</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
