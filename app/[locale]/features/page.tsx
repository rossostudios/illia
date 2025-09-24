import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'

const SECTION_KEYS = ['family', 'remote', 'founder'] as const

export default async function CaseStudiesPage() {
  const t = await getTranslations('caseStudies')

  const sections = SECTION_KEYS.map((key) => {
    const matches = t.raw(`sections.${key}.matches`) as string[]

    return {
      key,
      headline: t(`sections.${key}.headline`),
      context: t(`sections.${key}.context`),
      matches,
      result: t(`sections.${key}.result`),
    }
  })

  const metrics = (t.raw('metrics') as { label: string; value: string }[]) || []

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBar />
      <Navbar />

      <section className="bg-gradient-to-b from-white to-teal-50 py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 font-medium text-sm text-teal-700">
            <CheckCircle className="h-4 w-4" />
            {t('badge')}
          </span>
          <h1 className="mt-6 font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">{t('subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-teal-700"
              href="/quiz"
            >
              {t('cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-teal-500 hover:text-teal-600"
              href="/dashboard/explore"
            >
              {t('explore')}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:items-start lg:px-8">
          {sections.map((section) => (
            <article
              className="hover:-translate-y-1 flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-xl"
              key={section.key}
            >
              <h2 className="font-semibold text-2xl text-gray-900">{section.headline}</h2>
              <p className="mt-3 text-gray-600">{section.context}</p>
              <ul className="mt-6 space-y-3 text-gray-700">
                {section.matches.map((item) => (
                  <li className="flex items-start gap-3" key={item}>
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-teal-50 p-4 text-sm text-teal-900">
                <strong className="block text-teal-700">{t('outcome')}</strong>
                <span>{section.result}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-5xl rounded-3xl bg-white px-6 py-12 shadow-sm sm:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div className="text-center sm:text-left" key={metric.label}>
                <p className="font-bold text-3xl text-gray-900 sm:text-4xl">{metric.value}</p>
                <p className="mt-2 text-gray-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
