'use client'

import { useTranslations } from 'next-intl'

const faqs = [
  {
    question: 'How fast will I receive matches?',
    answer:
      'After you complete the intake, our concierge reviews your brief and shares curated intros in under 24 hours—often the same business day.',
  },
  {
    question: 'Do you interview the providers?',
    answer:
      'Yes. We pre-interview every cleaner, cook, or housekeeper, verify references, and capture their availability, rates, and preferred working style before we introduce them to you.',
  },
  {
    question: 'Can you help with trials and contracts?',
    answer:
      'Illia stays with you through the onboarding. We help set up trial days, share contract templates, and advise on payroll or seguro so you stay compliant locally.',
  },
  {
    question: 'What happens if a match does not work out?',
    answer:
      'Let us know within the first 30 days and we will re-open the search, send new candidates, and update our scoring model using your feedback.',
  },
]

export default function FAQSection() {
  const t = useTranslations('faq')

  return (
    <section className="bg-white py-20" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-bold text-4xl text-gray-900 md:text-5xl">{t('title')}</h2>
          <p className="mt-3 text-gray-600 text-lg">{t('subtitle')}</p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              key={faq.question}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left">
                <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
