export default function SocialProof() {
  const communities = [
    { name: 'Medellín Expat Women', tag: 'Community circle' },
    { name: 'Nomad List', tag: 'Partner community' },
    { name: 'Floripa Hub', tag: 'Local concierge' },
    { name: 'Internations', tag: 'Events partner' },
  ]

  const testimonials = [
    {
      quote:
        '“Illia distilled dozens of WhatsApp leads into two vetted options. We booked trials the same week and kept the one that felt like family.”',
      name: 'Laura M.',
      role: 'Product manager · Laureles',
    },
    {
      quote:
        '“They already knew the questions to ask about contracts and seguro. Having a concierge who speaks Spanish and Portuguese unlocked the hire for us.”',
      name: 'Brian K.',
      role: 'Founder · El Poblado',
    },
    {
      quote:
        '“Within 24 hours Illia lined up bilingual candidates that matched our dog + toddler chaos. We would have never found them on our own.”',
      name: 'Renata & James',
      role: 'Design & ops · Lagoa da Conceição',
    },
  ]

  const metrics = [
    { value: '92%', label: 'hire after first intro', helper: '2024 onboarding cohort' },
    { value: '36hrs', label: 'median match time', helper: 'Quiz to confirmed intro' },
    { value: '4.9/5', label: 'provider satisfaction', helper: 'Across 2,300+ reviews' },
  ]

  return (
    <section className="border-gray-900/10 border-t bg-white py-16" id="community">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-gray-900 text-sm uppercase tracking-[0.2em]">
            Backed by expat communities & local fixers
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {communities.map((community) => (
              <span
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-colors hover:border-[#0052cc] hover:text-[#0052cc]"
                key={community.name}
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-[#0052cc]" />
                {community.name}
                <span className="hidden text-gray-400 text-xs sm:inline">• {community.tag}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              className="hover:-translate-y-1 flex h-full flex-col justify-between rounded-2xl border border-gray-900/10 bg-gray-900 p-6 text-white shadow-lg transition-transform"
              key={testimonial.name}
            >
              <p className="text-base text-white/80 leading-relaxed">{testimonial.quote}</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-2xl border border-gray-900/10 bg-gray-900 px-6 py-8 text-white sm:grid-cols-3">
          {metrics.map((metric) => (
            <div className="text-center sm:text-left" key={metric.label}>
              <p className="font-bold text-3xl sm:text-4xl">{metric.value}</p>
              <p className="mt-1 font-medium text-white/80">{metric.label}</p>
              <p className="mt-1 text-sm text-white/60">{metric.helper}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
