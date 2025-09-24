'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Shield, Sparkles, Star, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function AnimatedHero() {
  const t = useTranslations('hero')

  const stats = [
    { icon: Users, value: '10,000+', label: t('stats.activeUsers') },
    { icon: Star, value: '4.9/5', label: t('stats.averageRating') },
    { icon: Shield, value: '100%', label: t('stats.verifiedProviders') },
    { icon: Zap, value: '24h', label: t('stats.responseTime') },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          className="absolute top-20 left-10 h-72 w-72 rounded-full bg-teal-200 opacity-70 mix-blend-multiply blur-xl filter"
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          className="absolute top-40 right-10 h-96 w-96 rounded-full bg-cyan-200 opacity-70 mix-blend-multiply blur-xl filter"
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          className="absolute bottom-20 left-1/2 h-80 w-80 rounded-full bg-teal-300 opacity-60 mix-blend-multiply blur-xl filter"
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <motion.div
          animate="animate"
          className="items-center text-center lg:grid lg:grid-cols-2 lg:gap-12 lg:text-left"
          initial="initial"
          variants={staggerContainer}
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div className="inline-flex" variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 font-medium text-sm text-teal-700">
                <Sparkles className="h-4 w-4" />
                {t('badge')}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="font-bold text-5xl text-gray-900 leading-tight lg:text-7xl"
              variants={fadeInUp}
            >
              {t('headline.find')}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-600">{t('headline.trusted')}</span>
                <motion.span
                  animate={{ width: '100%' }}
                  className="-z-10 absolute right-0 bottom-2 left-0 h-3 bg-teal-200"
                  initial={{ width: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
              <br />
              {t('headline.serviceProviders')}
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mx-auto max-w-3xl text-gray-600 text-xl leading-relaxed lg:mx-0"
              variants={fadeInUp}
            >
              {t('subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              variants={fadeInUp}
            >
              <Link
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-teal-700 hover:shadow-xl"
                href="/dashboard/explore"
              >
                {t('cta.startExploring')}
                <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 shadow-md transition-all duration-300 ease-in-out hover:border-teal-500 hover:bg-gray-50 hover:shadow-lg"
                href="/features"
              >
                {t('cta.learnMore')}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-6 border-gray-200 border-t pt-8 sm:grid-cols-4"
              variants={fadeInUp}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    className="text-center lg:text-left"
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="mb-1 flex items-center justify-center gap-2 lg:justify-start">
                      <Icon className="h-4 w-4 text-teal-600" />
                      <span className="font-bold text-2xl text-gray-900">{stat.value}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-12 lg:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Safari Browser Mockup */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 bg-gray-800 px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex flex-1 justify-center">
                    <div className="w-64 rounded-md bg-gray-700 px-4 py-1 text-center text-gray-300 text-sm">
                      illia.club
                    </div>
                  </div>
                </div>
                {/* Browser Content */}
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    alt="Illia Dashboard"
                    className="object-cover object-top"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src="/illia.png"
                  />
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="-left-8 absolute top-20 rounded-xl bg-white p-4 shadow-xl"
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <Shield className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('floating.verified')}</p>
                    <p className="text-gray-600 text-sm">{t('floating.backgroundChecked')}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="-right-8 absolute bottom-20 rounded-xl bg-white p-4 shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100">
                    <Star className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('floating.rating')}</p>
                    <p className="text-gray-600 text-sm">{t('floating.reviews')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
