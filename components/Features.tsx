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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(feature.titleKey)}</h3>
                <p className="text-gray-600">{t(feature.descriptionKey)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
