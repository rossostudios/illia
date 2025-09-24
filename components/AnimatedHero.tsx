'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Shield, Sparkles, Star, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function AnimatedHero() {
  const t = useTranslations('hero')

  const stats = [
    { icon: Users, value: '6,400+', label: t('stats.activeUsers') },
    { icon: Star, value: '4.9/5', label: t('stats.averageRating') },
    { icon: Shield, value: '170+', label: t('stats.verifiedProviders') },
    { icon: Zap, value: '<24h', label: t('stats.responseTime') },
  ]

  const categories = [
    t('categories.housekeeping'),
    t('categories.childcare'),
    t('categories.culinary'),
    t('categories.pets'),
    t('categories.errands'),
  ]

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_minmax(0,1fr)] lg:items-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 font-medium text-sm text-white">
              <Sparkles className="h-4 w-4" />
              {t('badge')}
            </span>

            <h1 className="font-bold text-4xl text-gray-900 leading-tight sm:text-5xl lg:text-6xl">
              {t('headline.find')} <span className="text-gray-900">{t('headline.trusted')}</span>
              <br />
              <span className="text-gray-900">{t('headline.serviceProviders')}</span>
            </h1>

            <p className="max-w-3xl text-gray-600 text-lg sm:text-xl">{t('subtitle')}</p>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                  key={category}
                >
                  <CheckCircle className="h-4 w-4" />
                  {category}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 font-semibold text-white shadow-[0_20px_45px_-25px_rgba(17,24,39,0.8)] transition hover:bg-black"
                href="/quiz"
              >
                {t('cta.startExploring')}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-8 py-4 font-semibold text-gray-800 transition hover:border-gray-900 hover:text-gray-900"
                href="/features"
              >
                {t('cta.learnMore')}
              </Link>
            </div>

            <motion.div
              className="grid gap-6 border-gray-200 border-t pt-8 sm:grid-cols-2"
              variants={fadeInUp}
            >
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div className="flex items-center gap-4" key={stat.label}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-2xl text-gray-900">{stat.value}</p>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[32rem] overflow-hidden rounded-3xl shadow-[0_40px_65px_-30px_rgba(10,36,99,0.6)] lg:h-[36rem]"
            initial={{ opacity: 0, x: 40 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          >
            <Image
              alt="Families meeting their new Illia concierge-supported team"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              src="/hero.jpg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
