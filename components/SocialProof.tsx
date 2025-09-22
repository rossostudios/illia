export default function SocialProof() {
  const partners = [
    { name: 'Medellín Expats', logo: 'FB', icon: '📘' },
    { name: 'Reddit Expats', logo: 'r/', icon: '🔴' },
    { name: 'Nomad List', logo: 'NL', icon: '🌍' },
    { name: 'WhatsApp Groups', logo: 'WA', icon: '💬' },
    { name: 'Telegram Groups', logo: 'TG', icon: '✈️' },
  ]

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Trusted by Medellín Expats & Floripa Nomads
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center gap-2 w-32 h-16 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">{partner.icon}</span>
              <div className="text-xl font-bold tracking-tight">{partner.logo}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center gap-12 text-sm text-gray-600">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900">1,000+</span>
            <span>Expats Helped</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900">500+</span>
            <span>Matches Made</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-900">4.8/5</span>
            <span>Trust Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}