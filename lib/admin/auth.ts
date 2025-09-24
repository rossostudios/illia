import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Database } from '@/lib/database.types'

export type AdminRole = 'super_admin' | 'admin' | 'moderator'

export type AdminUser = {
  id: string
  user_id: string
  role: AdminRole
  permissions: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  return adminUser
}

export async function requireAdmin(minimumRole?: AdminRole) {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    redirect('/en/dashboard')
  }

  if (minimumRole) {
    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      admin: 2,
      moderator: 1,
    }

    if (roleHierarchy[adminUser.role] < roleHierarchy[minimumRole]) {
      redirect('/admin/unauthorized')
    }
  }

  return adminUser
}

export async function checkAdminPermission(permission: string): Promise<boolean> {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    return false
  }

  // Super admins have all permissions
  if (adminUser.role === 'super_admin') {
    return true
  }

  // Check specific permission in permissions JSON
  return adminUser.permissions?.[permission] === true
}

export async function logAdminAction(
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminUser) {
    return
  }

  await supabase.from('admin_audit_logs').insert({
    admin_id: adminUser.id,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details: details || {},
  })
}
