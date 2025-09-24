// Enhanced Service Worker for Illia.club PWA
const CACHE_VERSION = 'v2.0.0'
const CACHE_NAMES = {
  static: `static-cache-${CACHE_VERSION}`,
  dynamic: `dynamic-cache-${CACHE_VERSION}`,
  images: `images-cache-${CACHE_VERSION}`,
  api: `api-cache-${CACHE_VERSION}`,
}

// Assets to pre-cache for offline support
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event - Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAMES.static)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((_error) => {})
  )
  self.skipWaiting()
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !Object.values(CACHE_NAMES).includes(cacheName))
            .map((cacheName) => caches.delete(cacheName))
        )
      )
  )
  self.clients.claim()
})

// Fetch strategies
const fetchStrategies = {
  // Network First - For API calls
  networkFirst: async (request) => {
    const cache = await caches.open(CACHE_NAMES.api)
    try {
      const networkResponse = await fetch(request)
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    } catch (error) {
      const cachedResponse = await cache.match(request)
      if (cachedResponse) {
        return cachedResponse
      }
      throw error
    }
  },

  // Cache First - For static assets
  cacheFirst: async (request) => {
    const cache = await caches.open(CACHE_NAMES.static)
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    const networkResponse = await fetch(request)
    cache.put(request, networkResponse.clone())
    return networkResponse
  },

  // Stale While Revalidate - For images
  staleWhileRevalidate: async (request) => {
    const cache = await caches.open(CACHE_NAMES.images)
    const cachedResponse = await cache.match(request)
    const fetchPromise = fetch(request).then((networkResponse) => {
      cache.put(request, networkResponse.clone())
      return networkResponse
    })
    return cachedResponse || fetchPromise
  },
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // API calls - Network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetchStrategies.networkFirst(request))
    return
  }

  // Images - Stale while revalidate
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(url.pathname)) {
    event.respondWith(fetchStrategies.staleWhileRevalidate(request))
    return
  }

  // Static assets - Cache first
  if (/\.(js|css|woff2?)$/i.test(url.pathname)) {
    event.respondWith(fetchStrategies.cacheFirst(request))
    return
  }

  // HTML pages - Network first with offline fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return caches.match('/offline.html')
        })
      )
    )
    return
  }

  // Default - Network only
  event.respondWith(fetch(request))
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages())
  }
})

async function syncMessages() {}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      url: data.url || '/',
    },
    actions: [
      {
        action: 'open',
        title: 'Open',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png',
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/'
    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
          includeUncontrolled: true,
        })
        .then((windowClients) => {
          // Check if there's already a window/tab open
          for (const client of windowClients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus()
            }
          }
          // Open new window if none found
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen)
          }
        })
    )
  }
})

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-check') {
    event.waitUntil(checkForUpdates())
  }
})

async function checkForUpdates() {}

// Message handling for skip waiting
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
