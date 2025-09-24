export default function SocialProof() {
  const partners = [
    { name: 'Medellín Expats', logo: 'FB', icon: '📘' },
    { name: 'Reddit Expats', logo: 'r/', icon: '🔴' },
    { name: 'Nomad List', logo: 'NL', icon: '🌍' },
    { name: 'WhatsApp Groups', logo: 'WA', icon: '💬' },
    { name: 'Telegram Groups', logo: 'TG', icon: '✈️' },
  ]

  return (
    <section className="border-gray-100 border-t bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="font-semibold text-gray-600 text-sm uppercase tracking-wider">
            Trusted by Medellín Expats & Floripa Nomads
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {partners.map((partner, index) => (
            <div
              className="flex h-16 w-32 items-center justify-center gap-2 text-gray-400 transition-colors hover:text-gray-600"
              key={index}
            >
              <span className="text-2xl">{partner.icon}</span>
              <div className="font-bold text-xl tracking-tight">{partner.logo}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-12 text-gray-600 text-sm">
          <div className="flex flex-col items-center">
            <span className="font-bold text-3xl text-gray-900">1,000+</span>
            <span>Expats Helped</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-3xl text-gray-900">500+</span>
            <span>Matches Made</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-3xl text-gray-900">4.8/5</span>
            <span>Trust Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
