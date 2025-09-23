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
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4"
          >
            Why Choose Illia
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden hover:-translate-y-1 transform"
              >
                {/* Background on hover */}
                <div className="absolute inset-0 bg-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />

                {/* Content */}
                <div className="relative">
                  <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300 ease-in-out">
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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="/dashboard/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            Discover All Features
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
