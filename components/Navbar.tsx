'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import MessageButton from './messaging/MessageButton'
import { useSessionContext } from './SessionProvider'

export default function Navbar() {
  const t = useTranslations('nav')
  const { user, loading } = useSessionContext()

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-black">Illia</span>
              </div>
            </Link>

            <div className="ml-10 hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-900 hover:text-teal-600 text-sm font-semibold transition-colors"
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-gray-700 hover:text-teal-600 text-sm font-medium transition-colors"
              >
                {t('features')}
              </Link>
              <Link
                href="/dashboard/explore"
                className="text-gray-700 hover:text-teal-600 text-sm font-medium transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-teal-600 text-sm font-medium transition-colors"
              >
                {t('pricing')}
              </Link>
              <Link
                href="/docs"
                className="text-gray-700 hover:text-teal-600 text-sm font-medium transition-colors"
              >
                {t('docs')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {!loading && user ? (
              <>
                <MessageButton showLabel={false} />
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('signin')}
                </Link>
                <Link
                  href="/dashboard/explore"
                  className="text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {t('getStarted')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
