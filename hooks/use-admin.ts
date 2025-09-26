'use client'

import { useEffect, useState } from 'react'
import type { AdminRole } from '@/lib/admin/auth'
import { createClient } from '@/lib/supabase/client'

type AdminUser = {
  id: string
  user_id: string
  role: AdminRole
  permissions: Record<string, any>
  is_active: boolean
}

export function useAdmin() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setAdminUser(null)
          return
        }

        const { data } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        setAdminUser(data as any)
      } catch (_error) {
        setAdminUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [supabase])

  const hasPermission = (permission: string): boolean => {
    if (!adminUser) {
      return false
    }
    if (adminUser.role === 'super_admin') {
      return true
    }
    return adminUser.permissions?.[permission] === true
  }

  const hasRole = (minimumRole: AdminRole): boolean => {
    if (!adminUser) {
      return false
    }

    const roleHierarchy: Record<AdminRole, number> = {
      super_admin: 3,
      admin: 2,
      moderator: 1,
    }

    return roleHierarchy[adminUser.role] >= roleHierarchy[minimumRole]
  }

  const logAction = async (
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ) => {
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

  return {
    adminUser,
    loading,
    isAdmin: !!adminUser,
    isSuperAdmin: adminUser?.role === 'super_admin',
    hasPermission,
    hasRole,
    logAction,
  }
}
