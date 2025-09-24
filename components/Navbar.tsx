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
    <nav className="sticky top-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link className="group flex items-center space-x-2" href="/">
              <div className="flex items-center">
                <span className="font-bold text-2xl text-black">Illia</span>
              </div>
            </Link>

            <div className="ml-10 hidden items-center space-x-6 md:flex">
              <Link
                className="font-semibold text-gray-900 text-sm transition-colors hover:text-teal-600"
                href="/"
              >
                Home
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-teal-600"
                href="/features"
              >
                {t('features')}
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-teal-600"
                href="/dashboard/explore"
              >
                Explore
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-teal-600"
                href="/pricing"
              >
                {t('pricing')}
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-teal-600"
                href="/docs"
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
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="hover:-translate-y-0.5 transform rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-sm text-white shadow-md transition-all hover:from-teal-600 hover:to-teal-700 hover:shadow-lg"
                  href="/dashboard/profile"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                  href="/login"
                >
                  {t('signin')}
                </Link>
                <Link
                  className="hover:-translate-y-0.5 transform rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-2.5 font-semibold text-sm text-white shadow-md transition-all hover:from-teal-600 hover:to-teal-700 hover:shadow-lg"
                  href="/dashboard/explore"
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
