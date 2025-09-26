'use client'

import { motion, useInView } from 'framer-motion'
import {
  Bot,
  CalendarCheck,
  ClipboardList,
  HeartHandshake,
  Languages,
  ShieldCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

const itemVariants: any = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

type BentoCard = {
  title: string
  description: string
  icon: React.ElementType
  className: string
}

export default function BentoFeatures() {
  const t = useTranslations('features')
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-120px' })

  const cards: BentoCard[] = [
    {
      title: t('lightning.title'),
      description: t('lightning.description'),
      icon: ClipboardList,
      className: 'col-span-6 lg:col-span-3 bg-gradient-to-br from-amber-50 via-white to-amber-100',
    },
    {
      title: t('smart.title'),
      description: t('smart.description'),
      icon: Bot,
      className:
        'col-span-6 lg:col-span-3 bg-gradient-to-br from-purple-50 via-white to-purple-100',
    },
    {
      title: t('vetted.title'),
      description: t('vetted.description'),
      icon: ShieldCheck,
      className:
        'col-span-6 md:col-span-3 lg:col-span-2 bg-gradient-to-br from-emerald-50 via-white to-emerald-100',
    },
    {
      title: t('insights.title'),
      description: t('insights.description'),
      icon: CalendarCheck,
      className:
        'col-span-6 md:col-span-3 lg:col-span-2 bg-gradient-to-br from-cyan-50 via-white to-cyan-100',
    },
    {
      title: t('privacy.title'),
      description: t('privacy.description'),
      icon: ShieldCheck,
      className:
        'col-span-6 md:col-span-3 lg:col-span-2 bg-gradient-to-br from-slate-50 via-white to-slate-100',
    },
    {
      title: t('city.title'),
      description: t('city.description'),
      icon: Languages,
      className: 'col-span-6 lg:col-span-4 bg-gradient-to-br from-teal-50 via-white to-teal-100',
    },
    {
      title: t('concierge.title'),
      description: t('concierge.description'),
      icon: HeartHandshake,
      className: 'col-span-6 lg:col-span-2 bg-gradient-to-br from-rose-50 via-white to-rose-100',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gray-50 py-24" id="how-it-works">
      <div className="pointer-events-none absolute inset-0">
        <div className="-top-40 -translate-x-1/2 absolute left-1/2 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 font-medium text-sm text-teal-700">
            How it works
          </span>
          <h2 className="mt-4 font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h2>
          <p className="mt-3 text-gray-600 text-lg md:text-xl">{t('subtitle')}</p>
        </div>

        <motion.div
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-16 grid grid-cols-6 gap-6"
          initial="hidden"
          ref={ref}
        >
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <motion.div
                className={`${card.className} hover:-translate-y-1 relative overflow-hidden rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:shadow-xl`}
                key={card.title}
                variants={itemVariants}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-6 font-semibold text-2xl text-gray-900">{card.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{card.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
