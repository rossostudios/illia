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
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-60"
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 items-center"
        >
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {t('badge')}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
            >
              {t('headline.find')}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-600">{t('headline.trusted')}</span>
                <motion.span
                  className="absolute bottom-2 left-0 right-0 h-3 bg-teal-200 -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
              <br />
              {t('headline.serviceProviders')}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto lg:mx-0"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/dashboard/explore"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                {t('cta.startExploring')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-teal-500 hover:bg-gray-50 transition-all duration-300 ease-in-out"
              >
                {t('cta.learnMore')}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-gray-200"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    className="text-center lg:text-left"
                  >
                    <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                      <Icon className="w-4 h-4 text-teal-600" />
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Safari Browser Mockup */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Browser Chrome */}
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-gray-700 rounded-md px-4 py-1 text-sm text-gray-300 w-64 text-center">
                      illia.club
                    </div>
                  </div>
                </div>
                {/* Browser Content */}
                <div className="bg-white relative aspect-[4/3]">
                  <Image
                    src="/illia.png"
                    alt="Illia Dashboard"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -left-8 top-20 bg-white p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('floating.verified')}</p>
                    <p className="text-sm text-gray-600">{t('floating.backgroundChecked')}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -right-8 bottom-20 bg-white p-4 rounded-xl shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t('floating.rating')}</p>
                    <p className="text-sm text-gray-600">{t('floating.reviews')}</p>
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
