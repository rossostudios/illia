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
    <div className="min-h-screen bg-gradient-to-b from-warmth-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-bold text-4xl text-teal-600 dark:text-teal-400">
            Choose Your Plan
          </h1>
          <p className="mb-8 text-gray-600 text-lg dark:text-gray-400">
            Unlock unlimited matches & expat support—start free, cancel anytime
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full bg-gray-100 p-1 dark:bg-gray-700">
            <button
              className={`rounded-full px-6 py-2 font-medium text-sm transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-teal-600 text-white shadow-md dark:bg-teal-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
              onClick={() => setBillingPeriod('monthly')}
              type="button"
            >
              Monthly
            </button>
            <button
              className={`flex items-center gap-2 rounded-full px-6 py-2 font-medium text-sm transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-teal-600 text-white shadow-md dark:bg-teal-500'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
              onClick={() => setBillingPeriod('annual')}
              type="button"
            >
              Annual
              <span className="rounded-full bg-sunset-500 px-2 py-0.5 text-white text-xs">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-6 lg:grid-cols-3">
          {/* Explorer Tier (Free) */}
          <div className="relative animate-[fadeIn_0.5s_ease-in-out_forwards] rounded-xl border border-gray-200 bg-white p-6 opacity-0 shadow-md dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-900/30">
            <div className="mb-6">
              <h2 className="mb-2 font-bold text-gray-900 text-xl dark:text-white">
                {PRICING_TIERS.explorer.name}
              </h2>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                {PRICING_TIERS.explorer.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="font-bold text-4xl text-gray-700 dark:text-gray-300">$0</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">/month</span>
              </div>
            </div>

            <ul className="mb-8 space-y-3">
              {PRICING_TIERS.explorer.features.map((feature, index) => (
                <li className="flex items-start gap-3" key={index}>
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-700 dark:text-gray-400" />
                  <span className="text-gray-600 text-sm dark:text-gray-400">{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full cursor-not-allowed rounded-lg bg-gray-100 py-3 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              disabled
              type="button"
            >
              Current Plan
            </button>
          </div>

          {/* Settler Tier */}
          <div className="animation-delay-100 relative animate-[fadeIn_0.5s_ease-in-out_forwards] rounded-xl border-2 border-teal-500 bg-white p-6 opacity-0 shadow-lg dark:border-teal-400 dark:bg-gray-900 dark:shadow-gray-900/30">
            <div className="mb-6">
              <h2 className="mb-2 font-bold text-gray-900 text-xl dark:text-white">
                {PRICING_TIERS.settler.name}
              </h2>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                {PRICING_TIERS.settler.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="font-bold text-4xl text-teal-600 dark:text-teal-400">
                  ${settlerPrice}
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="mt-1 text-green-600 text-sm dark:text-green-400">
                  Save ${PRICING_TIERS.settler.savings} per year
                </p>
              )}
            </div>

            <ul className="mb-6 space-y-2">
              {PRICING_TIERS.settler.features.map((feature, index) => (
                <li
                  className={`flex items-start gap-3 ${feature.header ? 'font-medium text-gray-900 dark:text-white' : ''}`}
                  key={index}
                >
                  {!feature.header && (
                    <Check
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                        feature.highlight
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-teal-500 dark:text-teal-400'
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm ${
                      feature.highlight
                        ? 'font-medium text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <PolarCheckoutButton
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 font-medium text-white shadow-md transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              productType="settler"
            >
              <CreditCard className="h-5 w-5" />
              Get Settler
            </PolarCheckoutButton>
          </div>

          {/* Local Tier (Premium) */}
          <div className="animation-delay-200 relative animate-[fadeIn_0.5s_ease-in-out_forwards] rounded-xl border-2 border-sunset-500 bg-white p-6 opacity-0 shadow-lg dark:border-sunset-400 dark:bg-gray-900 dark:shadow-gray-900/30">
            {/* Best Value Badge */}
            <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
              <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-sunset-500 to-sunset-600 px-4 py-1 font-medium text-sm text-white shadow-md">
                <Sparkles className="h-4 w-4" />
                Best Value
              </span>
            </div>

            <div className="mb-6">
              <h2 className="mb-2 font-bold text-gray-900 text-xl dark:text-white">
                {PRICING_TIERS.local.name}
              </h2>
              <p className="text-gray-600 text-sm dark:text-gray-400">
                {PRICING_TIERS.local.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="font-bold text-4xl text-sunset-600 dark:text-sunset-400">
                  ${localPrice}
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="mt-1 text-green-600 text-sm dark:text-green-400">
                  Save ${PRICING_TIERS.local.savings} per year
                </p>
              )}
            </div>

            <ul className="mb-6 space-y-2">
              {PRICING_TIERS.local.features.map((feature, index) => (
                <li
                  className={`flex items-start gap-3 ${feature.header ? 'font-medium text-gray-900 dark:text-white' : ''}`}
                  key={index}
                >
                  {!feature.header && (
                    <Check
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                        feature.highlight
                          ? 'text-sunset-600 dark:text-sunset-400'
                          : 'text-sunset-500 dark:text-sunset-400'
                      }`}
                    />
                  )}
                  <span
                    className={`text-sm ${
                      feature.highlight
                        ? 'font-medium text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <PolarCheckoutButton
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sunset-500 py-3 font-medium text-white shadow-md transition-colors hover:bg-sunset-600 dark:bg-sunset-400 dark:hover:bg-sunset-500"
              productType="local"
            >
              <CreditCard className="h-5 w-5" />
              Go Local
            </PolarCheckoutButton>
            <p className="mt-3 text-center text-gray-500 text-xs dark:text-gray-400">
              7-day free trial • Cancel anytime
            </p>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-900 dark:shadow-gray-900/30">
          <div className="border-gray-200 border-b bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
            <h3 className="font-bold text-gray-900 text-xl dark:text-white">Feature Comparison</h3>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Feature
                  </th>
                  <th className="py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Explorer
                  </th>
                  <th className="py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Settler
                  </th>
                  <th className="py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center gap-1">
                      Local
                      <Award className="h-4 w-4 text-sunset-500 dark:text-sunset-400" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, index) => (
                  <tr
                    className="border-gray-200 border-b last:border-0 dark:border-gray-700"
                    key={index}
                  >
                    <td className="py-4 text-gray-700 dark:text-gray-300">{row.feature}</td>
                    <td className="py-4 text-center">
                      {typeof row.explorer === 'boolean' ? (
                        row.explorer ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-300 dark:text-gray-600" />
                        )
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{row.explorer}</span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.settler === 'boolean' ? (
                        row.settler ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-300 dark:text-gray-600" />
                        )
                      ) : (
                        <span className="font-medium text-teal-600 dark:text-teal-400">
                          {row.settler}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {typeof row.local === 'boolean' ? (
                        row.local ? (
                          <Check className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-300 dark:text-gray-600" />
                        )
                      ) : (
                        <span className="font-medium text-sunset-600 dark:text-sunset-400">
                          {row.local}
                        </span>
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
          <h3 className="mb-8 text-center font-bold text-2xl text-gray-900 dark:text-white">
            What Expats Are Saying
          </h3>
          <div className="mx-auto max-w-3xl">
            <div className="relative rounded-xl bg-white p-8 shadow-md dark:bg-gray-900 dark:shadow-gray-900/30">
              <div className="mb-4 flex items-start gap-4">
                <img
                  alt={TESTIMONIALS[currentTestimonial].author}
                  className="h-12 w-12 rounded-full object-cover"
                  src={TESTIMONIALS[currentTestimonial].avatar}
                />
                <div>
                  <div className="mb-1 flex items-center gap-1">
                    {[...new Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                      <Star
                        className="h-4 w-4 fill-sunset-500 text-sunset-500 dark:fill-sunset-400 dark:text-sunset-400"
                        key={i}
                      />
                    ))}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {TESTIMONIALS[currentTestimonial].author}
                  </p>
                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {TESTIMONIALS[currentTestimonial].location}
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-700 text-lg italic dark:text-gray-300">
                "{TESTIMONIALS[currentTestimonial].quote}"
              </blockquote>

              {/* Carousel Dots */}
              <div className="mt-6 flex justify-center gap-2">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    className={`h-2 w-2 rounded-full transition-all ${
                      currentTestimonial === index
                        ? 'w-8 bg-teal-600 dark:bg-teal-400'
                        : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                    }`}
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h3 className="mb-8 text-center font-bold text-2xl text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                className="rounded-lg bg-white shadow-md dark:bg-gray-900 dark:shadow-gray-900/30"
                key={index}
              >
                <button
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  type="button"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform dark:text-gray-400 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pb-8 text-center">
          <div className="mb-6 flex justify-center gap-8">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Users className="h-5 w-5" />
              <span className="text-sm">5,000+ Members</span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex justify-center">
            <select className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:ring-teal-400">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>

        {/* Confetti Effect (Stub) */}
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-bounce text-6xl">🎉</div>
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
