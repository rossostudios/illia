import { ChartBar, Database, Globe, Shield, Target, Zap } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Matches',
      description: 'Discover & match with vetted pros in seconds—AI-curated for your needs.',
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'AI scores providers on fit (English level, rates, reviews)—no more guesswork.',
    },
    {
      icon: Database,
      title: 'Vetted Profiles',
      description: 'Rich details: Bios, rates, photos, & community reviews—all verified.',
    },
    {
      icon: ChartBar,
      title: 'Match Insights',
      description: 'Track your hires & savings with simple dashboards—see ROI in real-time.',
    },
    {
      icon: Shield,
      title: 'Privacy-First',
      description: 'Secure & compliant—your data (and matches) protected like family.',
    },
    {
      icon: Globe,
      title: 'City-Savvy',
      description: 'Tailored for Medellín & Florianópolis—local insights from expat networks.',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Seamless Expat Living
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Curated tools designed for expats to find and connect with reliable home help—fast &
            safe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
