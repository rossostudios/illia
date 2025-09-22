// Changelog: Created Membership pricing page—tier cards with comparison, Stripe checkout stub, testimonials/FAQ; annual toggle.

'use client'

import {
  Award,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import PolarCheckoutButton from '@/components/PolarCheckoutButton'

const PRICING_TIERS = {
  explorer: {
    name: 'Explorer',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for nomads just starting to explore',
    features: [
      { text: 'Browse service provider directory', included: true },
      { text: '3 match requests per month', included: true },
      { text: 'Basic community forums', included: true },
      { text: 'Search and filters', included: true },
      { text: 'View provider ratings', included: true },
    ],
    limitations: [
      'Limited to 3 matches/mo',
      'No priority support',
      'Basic forum access only',
      'No direct messaging',
    ],
    polarProductType: 'explorer' as const,
  },
  settler: {
    name: 'Settler',
    monthlyPrice: 9,
    annualPrice: 90,
    description: 'For nomads ready to settle with regular services',
    features: [
      { text: 'Everything in Explorer, plus:', included: true, header: true },
      { text: '20 match requests per month', included: true, highlight: true },
      { text: 'Priority provider introductions', included: true },
      { text: 'Direct messaging', included: true },
      { text: 'Community forum priority', included: true },
      { text: 'Service contract templates', included: true },
      { text: 'Email support', included: true },
    ],
    savings: 18,
    polarProductType: 'settler' as const,
  },
  local: {
    name: 'Local',
    monthlyPrice: 19,
    annualPrice: 190,
    description: 'Full access for those who call it home',
    features: [
      { text: 'Everything in Settler, plus:', included: true, header: true },
      { text: 'Unlimited match requests', included: true, highlight: true },
      { text: 'Instant provider connections', included: true, highlight: true },
      { text: 'WhatsApp priority support', included: true },
      { text: 'Verified provider network', included: true },
      { text: 'Exclusive local events', included: true },
      { text: 'Ad-free experience', included: true },
      { text: 'Concierge service', included: true },
      { text: '24/7 priority support', included: true },
    ],
    savings: 38,
    polarProductType: 'local' as const,
  },
}

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'Found my cook in a week—lifesaver! The verified providers gave me peace of mind as a new expat.',
    author: 'Chris M.',
    location: 'Medellín',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 2,
    quote:
      'Premium is worth it! Got 3 great cleaners to interview within 24 hours. Saved me weeks of searching.',
    author: 'Sarah L.',
    location: 'Florianópolis',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 3,
    quote: 'The community forums alone are gold. Found my entire support network through Illia.',
    author: 'Mike D.',
    location: 'El Poblado',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
]

const FAQS = [
  {
    question: 'What happens if I cancel?',
    answer:
      "You can cancel anytime—no questions asked. You'll keep Premium benefits until the end of your billing period, then automatically switch to Free.",
  },
  {
    question: 'How do match requests work?',
    answer:
      'Request an introduction to any provider. Premium members get unlimited requests and priority responses within 24 hours. Free users get 5 requests per month.',
  },
  {
    question: 'Is my payment secure?',
    answer:
      'Yes! We use Polar.sh for secure payment processing. Your card details are handled by certified payment providers, and you can manage your subscription anytime through your Polar dashboard.',
  },
]

const COMPARISON_FEATURES = [
  { feature: 'Browse Provider Directory', explorer: true, settler: true, local: true },
  { feature: 'Match Requests per Month', explorer: '3', settler: '20', local: 'Unlimited' },
  { feature: 'Priority Introductions', explorer: false, settler: true, local: true },
  { feature: 'Direct Messaging', explorer: false, settler: true, local: true },
  { feature: 'WhatsApp Support', explorer: false, settler: false, local: true },
  { feature: 'Community Forums', explorer: 'Basic', settler: 'Priority', local: 'VIP Access' },
  { feature: 'Verified Providers', explorer: false, settler: false, local: true },
  { feature: 'Response Time', explorer: '72 hours', settler: '24 hours', local: 'Instant' },
  { feature: 'Contract Templates', explorer: false, settler: true, local: true },
  { feature: 'Local Events', explorer: false, settler: false, local: true },
  { feature: 'Ad-free Experience', explorer: false, settler: false, local: true },
  { feature: 'Support', explorer: 'Email', settler: 'Priority Email', local: '24/7 Concierge' },
]

export default function MembershipPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Check for success from Polar checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const settlerPrice =
    billingPeriod === 'monthly'
      ? PRICING_TIERS.settler.monthlyPrice
      : PRICING_TIERS.settler.annualPrice

  const localPrice =
    billingPeriod === 'monthly' ? PRICING_TIERS.local.monthlyPrice : PRICING_TIERS.local.annualPrice

  return (
    <div className="min-h-screen bg-gradient-to-b from-warmth-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-600 mb-3">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 mb-8">
            Unlock unlimited matches & expat support—start free, cancel anytime
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-gray-100 rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 bg-sunset-500 text-white text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {/* Explorer Tier (Free) */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 relative opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {PRICING_TIERS.explorer.name}
              </h2>
              <p className="text-gray-600 text-sm">{PRICING_TIERS.explorer.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-400">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {PRICING_TIERS.explorer.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              type="button"
              className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Settler Tier */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-teal-500 relative opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards] animation-delay-100">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{PRICING_TIERS.settler.name}</h2>
              <p className="text-gray-600 text-sm">{PRICING_TIERS.settler.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-teal-600">${settlerPrice}</span>
                <span className="text-gray-500 ml-2">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-green-600 mt-1">
                  Save ${PRICING_TIERS.settler.savings} per year
                </p>
              )}
            </div>

            <ul className="space-y-2 mb-6">
              {PRICING_TIERS.settler.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-3 ${feature.header ? 'font-medium text-gray-900' : ''}`}
                >
                  {!feature.header && (
                    <Check
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        feature.highlight ? 'text-teal-600' : 'text-teal-500'
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm ${
                      feature.highlight ? 'text-gray-900 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <PolarCheckoutButton
              productType="settler"
              className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Get Settler
            </PolarCheckoutButton>
          </div>

          {/* Local Tier (Premium) */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-sunset-500 relative opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards] animation-delay-200">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-sunset-500 to-sunset-600 text-white text-sm font-medium rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Best Value
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{PRICING_TIERS.local.name}</h2>
              <p className="text-gray-600 text-sm">{PRICING_TIERS.local.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-sunset-600">${localPrice}</span>
                <span className="text-gray-500 ml-2">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-green-600 mt-1">
                  Save ${PRICING_TIERS.local.savings} per year
                </p>
              )}
            </div>

            <ul className="space-y-2 mb-6">
              {PRICING_TIERS.local.features.map((feature, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-3 ${feature.header ? 'font-medium text-gray-900' : ''}`}
                >
                  {!feature.header && (
                    <Check
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        feature.highlight ? 'text-sunset-600' : 'text-sunset-500'
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm ${
                      feature.highlight ? 'text-gray-900 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <PolarCheckoutButton
              productType="local"
              className="w-full py-3 bg-sunset-500 text-white rounded-lg font-medium hover:bg-sunset-600 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Go Local
            </PolarCheckoutButton>
            <p className="text-xs text-center text-gray-500 mt-3">
              7-day free trial • Cancel anytime
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-16">
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-xl font-bold text-gray-900">Feature Comparison</h3>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-gray-700 font-medium">Feature</th>
                  <th className="text-center py-3 text-gray-700 font-medium">Explorer</th>
                  <th className="text-center py-3 text-gray-700 font-medium">Settler</th>
                  <th className="text-center py-3 text-gray-700 font-medium">
                    <span className="inline-flex items-center gap-1">
                      Local
                      <Award className="h-4 w-4 text-sunset-500" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-4 text-gray-700">{row.feature}</td>
                    <td className="py-4 text-center">
                      {typeof row.explorer === 'boolean' ? (
                        row.explorer ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{row.explorer}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.settler === 'boolean' ? (
                        row.settler ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-medium text-teal-600">{row.settler}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.local === 'boolean' ? (
                        row.local ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="font-medium text-sunset-600">{row.local}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            What Expats Are Saying
          </h3>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={TESTIMONIALS[currentTestimonial].avatar}
                  alt={TESTIMONIALS[currentTestimonial].author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-sunset-500 fill-sunset-500" />
                    ))}
                  </div>
                  <p className="font-medium text-gray-900">
                    {TESTIMONIALS[currentTestimonial].author}
                  </p>
                  <p className="text-sm text-gray-500">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {TESTIMONIALS[currentTestimonial].location}
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg italic">
                "{TESTIMONIALS[currentTestimonial].quote}"
              </blockquote>

              {/* Carousel Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentTestimonial === index
                        ? 'bg-teal-600 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center pb-8">
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">5,000+ Members</span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-center">
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>

        {/* Confetti Effect (Stub) */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">🎉</div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  )
}
