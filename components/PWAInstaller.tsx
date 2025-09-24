'use client'

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register enhanced service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw-enhanced.js')
          .then((registration) => {
            // Check for updates periodically
            setInterval(
              () => {
                registration.update()
              },
              30 * 60 * 1000
            ) // Check every 30 minutes

            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  }
                })
              }
            })
          })
          .catch((_error) => {})
      })
    }

    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Show install prompt after a delay
      setTimeout(() => {
        if (!localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true)
        }
      }, 30_000) // Show after 30 seconds
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
    } else {
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showInstallPrompt || isInstalled) {
    return null
  }

  return (
    <div className="fixed right-4 bottom-20 left-4 z-50 md:right-4 md:bottom-4 md:left-auto md:max-w-sm">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
        <button
          aria-label="Dismiss"
          className="absolute top-2 right-2 rounded-full p-1 transition-colors hover:bg-gray-100"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="pr-6">
          <h3 className="mb-1 font-semibold text-gray-900">Install Illia.club</h3>
          <p className="mb-3 text-gray-600 text-sm">
            Install our app for a better experience with offline access and faster loading.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-teal-700"
            onClick={handleInstallClick}
          >
            Install App
          </button>
          <button
            className="px-4 py-2 font-medium text-gray-600 text-sm transition-colors hover:text-gray-800"
            onClick={handleDismiss}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}
