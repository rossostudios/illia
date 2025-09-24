'use client'

import { motion, useInView } from 'framer-motion'
import { ChartBar, Database, Globe, Shield, Target, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function AnimatedFeatures() {
  const t = useTranslations('features')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: Zap,
      titleKey: 'lightning.title',
      descriptionKey: 'lightning.description',
      gradient: 'from-yellow-400 to-orange-500',
      delay: 0,
    },
    {
      icon: Target,
      titleKey: 'smart.title',
      descriptionKey: 'smart.description',
      gradient: 'from-purple-400 to-pink-500',
      delay: 0.1,
    },
    {
      icon: Database,
      titleKey: 'vetted.title',
      descriptionKey: 'vetted.description',
      gradient: 'from-blue-400 to-cyan-500',
      delay: 0.2,
    },
    {
      icon: ChartBar,
      titleKey: 'insights.title',
      descriptionKey: 'insights.description',
      gradient: 'from-green-400 to-teal-500',
      delay: 0.3,
    },
    {
      icon: Shield,
      titleKey: 'privacy.title',
      descriptionKey: 'privacy.description',
      gradient: 'from-red-400 to-pink-500',
      delay: 0.4,
    },
    {
      icon: Globe,
      titleKey: 'city.title',
      descriptionKey: 'city.description',
      gradient: 'from-indigo-400 to-purple-500',
      delay: 0.5,
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gray-50 py-24" id="how-it-works">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          className="-top-40 -right-40 absolute h-80 w-80 rounded-full bg-teal-100 opacity-20 blur-3xl"
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          className="-bottom-40 -left-40 absolute h-80 w-80 rounded-full bg-cyan-100 opacity-20 blur-3xl"
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="mb-4 inline-block rounded-full bg-teal-100 px-4 py-2 font-medium text-sm text-teal-700"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2 }}
          >
            Why Choose Illia
          </motion.span>
          <h2 className="mb-4 font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          ref={ref}
          variants={containerVariants}
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                className="group hover:-translate-y-1 relative transform overflow-hidden rounded-2xl bg-white p-8 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-xl"
                key={feature.titleKey}
                variants={itemVariants}
              >
                {/* Background on hover */}
                <div className="absolute inset-0 bg-teal-50 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />

                {/* Content */}
                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-600 shadow-lg">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-3 font-semibold text-gray-900 text-xl transition-colors duration-300 ease-in-out group-hover:text-teal-600">
                    {t(feature.titleKey)}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">{t(feature.descriptionKey)}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-teal-700 hover:shadow-xl"
            href="/dashboard/explore"
          >
            Discover All Features
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
