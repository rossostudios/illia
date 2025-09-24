'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { isSlowConnection } from '@/utils/performance'

export function OptimizedScripts() {
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false)

  useEffect(() => {
    // Delay loading analytics on slow connections
    const loadDelay = isSlowConnection() ? 5000 : 2000

    const timer = setTimeout(() => {
      setShouldLoadAnalytics(true)
    }, loadDelay)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Load critical scripts immediately but after interactive */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            window.__APP_CONFIG__ = {
              apiUrl: '${process.env.NEXT_PUBLIC_API_URL || ''}',
              env: '${process.env.NODE_ENV}'
            };
          `,
        }}
        id="critical-app-config"
        strategy="afterInteractive"
      />

      {/* Defer non-critical analytics */}
      {shouldLoadAnalytics && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: window.location.pathname,
                send_page_view: false
              });
            `}
          </Script>
        </>
      )}

      {/* Service Worker for offline support and caching */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                  (registration) => console.log('SW registered:', registration.scope),
                  (err) => console.log('SW registration failed:', err)
                );
              });
            }
          `,
        }}
        id="service-worker"
        strategy="afterInteractive"
      />
    </>
  )
}
