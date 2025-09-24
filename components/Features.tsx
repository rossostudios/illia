'use client'

import { ChartBar, Database, Globe, Shield, Target, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Features() {
  const t = useTranslations('features')

  const features = [
    {
      icon: Zap,
      titleKey: 'lightning.title',
      descriptionKey: 'lightning.description',
    },
    {
      icon: Target,
      titleKey: 'smart.title',
      descriptionKey: 'smart.description',
    },
    {
      icon: Database,
      titleKey: 'vetted.title',
      descriptionKey: 'vetted.description',
    },
    {
      icon: ChartBar,
      titleKey: 'insights.title',
      descriptionKey: 'insights.description',
    },
    {
      icon: Shield,
      titleKey: 'privacy.title',
      descriptionKey: 'privacy.description',
    },
    {
      icon: Globe,
      titleKey: 'city.title',
      descriptionKey: 'city.description',
    },
  ]

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl text-gray-900">{t('title')}</h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-teal-500 hover:shadow-lg"
                key={index}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 text-xl">{t(feature.titleKey)}</h3>
                <p className="text-gray-600">{t(feature.descriptionKey)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
