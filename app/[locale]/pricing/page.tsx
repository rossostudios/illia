import dynamic from 'next/dynamic'
import { getTranslations } from 'next-intl/server'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'

const PricingSection = dynamic(() => import('@/components/PricingSection'), {
  ssr: true,
})

const FAQSection = dynamic(() => import('@/components/FAQSection'), {
  ssr: true,
})

export default async function PricingPage() {
  const t = await getTranslations('pricing')

  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBar />
      <Navbar />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-gray-600 text-lg">{t('subtitle')}</p>
        </div>
      </section>
      <PricingSection />
      <FAQSection />
    </div>
  )
}
