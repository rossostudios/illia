'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
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
                className="font-semibold text-gray-900 text-sm transition-colors hover:text-[#0052cc]"
                href="/"
              >
                Home
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-[#0052cc]"
                href="/#how-it-works"
              >
                {t('features')}
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-[#0052cc]"
                href="/features"
              >
                {t('caseStudies')}
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-[#0052cc]"
                href="/dashboard/explore"
              >
                Explore
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-[#0052cc]"
                href="/pricing"
              >
                {t('pricing')}
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-[#0052cc]"
                href="/docs"
              >
                {t('docs')}
              </Link>
              <Link
                className="font-medium text-gray-700 text-sm transition-colors hover:text-[#0052cc]"
                href="/#community"
              >
                {t('community') ?? 'Community'}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            {!loading && user ? (
              <>
                <Link
                  className="font-medium text-gray-700 text-sm transition-colors hover:text-gray-900"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="hover:-translate-y-0.5 transform rounded-full bg-gray-900 px-5 py-2.5 font-semibold text-sm text-white shadow-md transition-all hover:bg-black hover:shadow-lg"
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
                  className="hover:-translate-y-0.5 transform rounded-full bg-gray-900 px-5 py-2.5 font-semibold text-sm text-white shadow-md transition-all hover:bg-black hover:shadow-lg"
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
