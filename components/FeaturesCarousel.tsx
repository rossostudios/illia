'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const SLIDE_KEYS = ['housekeeper', 'chef', 'concierge'] as const

type SlideKey = (typeof SLIDE_KEYS)[number]

type SlideConfig = {
  key: SlideKey
  label: string
  title: string
  body: string
  cta: string
  badge: string
  mediaAlt: string
  theme: {
    background: string
    badge: string
    text: string
  }
}

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const cardVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function FeaturesCarousel() {
  const t = useTranslations('carousel')
  const [activeIndex, setActiveIndex] = useState(0)

  const slides: SlideConfig[] = [
    {
      key: 'housekeeper',
      label: t('slides.housekeeper.label'),
      title: t('slides.housekeeper.title'),
      body: t('slides.housekeeper.body'),
      cta: t('cta'),
      badge: t('slides.housekeeper.badge'),
      mediaAlt: t('slides.housekeeper.mediaAlt'),
      theme: {
        background: 'bg-[#0052CC]',
        badge: 'bg-white/15 text-white',
        text: 'text-white',
      },
    },
    {
      key: 'chef',
      label: t('slides.chef.label'),
      title: t('slides.chef.title'),
      body: t('slides.chef.body'),
      cta: t('cta'),
      badge: t('slides.chef.badge'),
      mediaAlt: t('slides.chef.mediaAlt'),
      theme: {
        background: 'bg-gray-900',
        badge: 'bg-amber-500/20 text-amber-200',
        text: 'text-white',
      },
    },
    {
      key: 'concierge',
      label: t('slides.concierge.label'),
      title: t('slides.concierge.title'),
      body: t('slides.concierge.body'),
      cta: t('cta'),
      badge: t('slides.concierge.badge'),
      mediaAlt: t('slides.concierge.mediaAlt'),
      theme: {
        background: 'bg-[#FF6B2C]',
        badge: 'bg-black/15 text-black',
        text: 'text-black',
      },
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[activeIndex]

  return (
    <section className="bg-white py-24" id="how-it-works">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          animate="visible"
          className="text-center"
          initial="hidden"
          variants={containerVariants}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 font-medium text-sm text-white">
            <Sparkles className="h-4 w-4" />
            {t('badge')}
          </span>
          <h2 className="mt-4 font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h2>
          <p className="mt-3 text-gray-600 text-lg md:text-xl">{t('subtitle')}</p>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {slides.map((slide, index) => (
            <button
              className={`rounded-full border px-5 py-2 font-semibold text-sm transition ${
                index === activeIndex
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 text-gray-700 hover:border-gray-500 hover:text-gray-900'
              }`}
              key={slide.key}
              onClick={() => setActiveIndex(index)}
              type="button"
              
            >
              {slide.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              animate="center"
              className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 ${activeSlide.theme.background}`}
              exit="exit"
              initial="enter"
              key={activeSlide.key}
              variants={cardVariants}
            >
              <div
                className={`grid gap-10 ${
                  activeIndex === 1 ? 'lg:grid-cols-[1.1fr_minmax(0,0.9fr)]' : 'lg:grid-cols-2'
                } items-center`}
              >
                <div className={`space-y-6 ${activeSlide.theme.text}`}>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold text-xs uppercase tracking-wider ${activeSlide.theme.badge}`}
                  >
                    {activeSlide.badge}
                  </span>
                  <h3 className="font-bold text-3xl leading-snug sm:text-4xl">
                    {activeSlide.title}
                  </h3>
                  <p className="text-base opacity-90 sm:text-lg">{activeSlide.body}</p>
                  <Link
                    className={`inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-sm transition ${
                      activeIndex === 2
                        ? 'text-black hover:bg-gray-100'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                    href="/dashboard/explore"
                  >
                    {activeSlide.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/10">
                  <Image
                    alt={activeSlide.mediaAlt}
                    className="object-cover"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    src="/illia.png"
                  />
                </div>
              </div>

              <div className="mt-10 flex justify-center gap-2">
                {slides.map((slide, index) => (
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      index === activeIndex ? 'bg-white' : 'bg-white/40'
                    }`}
                    key={`${slide.key}-dot`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
