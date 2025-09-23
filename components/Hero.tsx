'use client'

import { ArrowRight, CheckCircle, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const _tCommon = useTranslations('common')

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-20 w-96 h-96 bg-gradient-to-r from-teal-100 to-teal-200 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-20 w-96 h-96 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full opacity-30 blur-3xl animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            {t('headline')}
            <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('headlineAccent')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">{t('subtitle')}</p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/dashboard/explore"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              {t('startFreeTrial')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Play className="mr-2 w-5 h-5" />
              {t('watchDemo')}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>{t('noCard')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>{t('twoMinQuiz')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>{t('freeMatches')}</span>
            </div>
          </div>
        </div>

        {/* Interactive Demo Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-600">
                  Illia.club - {t('sidebarExplore')}
                </span>
              </div>
            </div>
            {/* Dashboard Screenshot */}
            <div className="relative w-full h-[500px] bg-gray-100">
              <Image
                src="/illia.png"
                alt="Illia Dashboard"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Shadow effect */}
          <div className="absolute -inset-x-4 -bottom-4 h-20 bg-gradient-to-t from-gray-100 to-transparent blur-xl -z-10"></div>
        </div>
      </div>
    </section>
  )
}
