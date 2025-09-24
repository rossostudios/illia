'use client'

import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const TIER_KEYS = ['starter', 'settled', 'executive'] as const

type TierKey = (typeof TIER_KEYS)[number]

type Tier = {
  key: TierKey
  name: string
  price: string
  period: string
  tagline: string
  features: string[]
}

export default function PricingSection() {
  const t = useTranslations('pricing')

  const tiers: Tier[] = TIER_KEYS.map((key) => {
    const featuresRaw = t.raw(`tiers.${key}.features`) as Record<string, string>

    return {
      key,
      name: t(`tiers.${key}.name`),
      price: t(`tiers.${key}.price`),
      period: t(`tiers.${key}.period`),
      tagline: t(`tiers.${key}.tagline`),
      features: Object.values(featuresRaw ?? {}),
    }
  })

  return (
    <section className="bg-white py-20" id="pricing">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 font-medium text-sm text-white">
            <Sparkles className="h-4 w-4" />
            {t('badge')}
          </span>
          <h2 className="mt-4 font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h2>
          <p className="mt-3 text-gray-600 text-lg md:text-xl">{t('subtitle')}</p>
          <p className="mt-4 text-gray-500 text-sm">{t('note')}</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              className={`hover:-translate-y-1 relative flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${
                tier.key === 'settled' ? 'border-gray-900 shadow-xl' : ''
              }`}
              key={tier.key}
            >
              {tier.key === 'settled' && (
                <span className="-top-3 -translate-x-1/2 absolute left-1/2 rounded-full bg-gray-900 px-4 py-1 font-semibold text-white text-xs uppercase tracking-wider">
                  {t('popular')}
                </span>
              )}

              <div>
                <p className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                  {tier.name}
                </p>
                <p className="mt-2 font-bold text-4xl text-gray-900">
                  {tier.price}
                  <span className="ml-2 font-medium text-base text-gray-500">{tier.period}</span>
                </p>
                <p className="mt-3 text-gray-600">{tier.tagline}</p>
              </div>

              <ul className="mt-6 space-y-3 text-gray-700 text-sm">
                {tier.features.map((feature) => (
                  <li className="flex items-start gap-3" key={feature}>
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  className={`flex w-full items-center justify-center rounded-full px-5 py-3 font-semibold transition-all ${
                    tier.key === 'settled'
                      ? 'bg-gray-900 text-white shadow-lg hover:bg-black'
                      : 'border border-gray-200 text-gray-900 hover:border-[#0052cc] hover:text-[#0052cc]'
                  }`}
                  href="/contact"
                >
                  {t('cta')}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-gray-600">{t('contact')}</p>
      </div>
    </section>
  )
}
