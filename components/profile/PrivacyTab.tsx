'use client'

import { AlertTriangle, Download, LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { UserProfile } from '@/types/profile'

type PrivacyTabProps = {
  profile: UserProfile
  onUpdate: (updates: Partial<UserProfile>) => void
  onDeleteAccount: () => void
  onLogout: () => void
  onExportData: () => void
}

export function PrivacyTab({
  profile,
  onUpdate,
  onDeleteAccount,
  onLogout,
  onExportData,
}: PrivacyTabProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Privacy Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">
                Profile Discoverable
              </span>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                Allow providers to find your profile
              </p>
            </div>
            <input
              checked={profile.privacy.discoverable}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              onChange={(e) =>
                onUpdate({
                  privacy: { ...profile.privacy, discoverable: e.target.checked },
                })
              }
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Show in Forums</span>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                Display your profile in community forums
              </p>
            </div>
            <input
              checked={profile.privacy.showInForums}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              onChange={(e) =>
                onUpdate({
                  privacy: { ...profile.privacy, showInForums: e.target.checked },
                })
              }
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Share Location</span>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                Share your city with providers
              </p>
            </div>
            <input
              checked={profile.privacy.shareLocation}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              onChange={(e) =>
                onUpdate({
                  privacy: { ...profile.privacy, shareLocation: e.target.checked },
                })
              }
              type="checkbox"
            />
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Data Management</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Export Your Data</h4>
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  Download all your data in JSON format
                </p>
              </div>
              <Button onClick={onExportData} size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Security</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </h4>
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  Add an extra layer of security
                </p>
              </div>
              <Button size="sm" variant="outline">
                Enable 2FA
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Active Sessions</h4>
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  Manage your active sessions
                </p>
              </div>
              <Button size="sm" variant="outline">
                View Sessions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Account Actions</h3>
        <div className="space-y-3">
          <Button
            className="w-full justify-start"
            onClick={() => setShowLogoutModal(true)}
            variant="outline"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <Button
            className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => setShowDeleteModal(true)}
            variant="outline"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                Delete Account
              </h3>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to delete your account? This action cannot be undone and all
              your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={onDeleteAccount}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">Sign Out</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Are you sure you want to sign out?
            </p>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={() => setShowLogoutModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
