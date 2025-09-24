'use client'

import { ArrowRight, CheckCircle, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const _tCommon = useTranslations('common')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-teal-100 to-teal-200 opacity-30 blur-3xl" />
        <div className="absolute right-1/4 bottom-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="mb-16 text-center">
          {/* Main Headline */}
          <h1 className="mb-6 font-bold text-5xl text-gray-900 sm:text-6xl lg:text-7xl">
            {t('headline')}
            <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('headlineAccent')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-3xl text-gray-600 text-xl">{t('subtitle')}</p>

          {/* Dual CTAs */}
          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="hover:-translate-y-1 inline-flex transform items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 font-semibold text-lg text-white shadow-xl transition-all hover:from-green-600 hover:to-green-700 hover:shadow-2xl"
              href="/dashboard/explore"
            >
              {t('startFreeTrial')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button
              className="hover:-translate-y-1 inline-flex transform items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 text-lg transition-all hover:border-green-500 hover:text-green-600 hover:shadow-lg"
              type="button"
            >
              <Play className="mr-2 h-5 w-5" />
              {t('watchDemo')}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{t('noCard')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{t('twoMinQuiz')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>{t('freeMatches')}</span>
            </div>
          </div>
        </div>

        {/* Interactive Demo Preview */}
        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="border-gray-200 border-b bg-gray-50 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-4 text-gray-600 text-sm">
                  Illia.club - {t('sidebarExplore')}
                </span>
              </div>
            </div>
            {/* Dashboard Screenshot */}
            <div className="relative h-[500px] w-full bg-gray-100">
              <Image
                alt="Illia Dashboard"
                className="object-cover object-top"
                fill
                priority
                src="/illia.png"
              />
            </div>
          </div>

          {/* Shadow effect */}
          <div className="-inset-x-4 -bottom-4 -z-10 absolute h-20 bg-gradient-to-t from-gray-100 to-transparent blur-xl" />
        </div>
      </div>
    </section>
  )
}
