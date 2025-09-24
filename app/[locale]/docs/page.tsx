'use client'

import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Image,
  Menu,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function FaqItem({ faq }: { faq: { q: string; a: string; expanded?: string } }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-200 transition-colors hover:border-teal-300">
      <button
        className="w-full bg-white px-6 py-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{faq.q}</h3>
          <ChevronDown
            className={`h-5 w-5 text-teal-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
      {isOpen && (
        <div className="border-gray-200 border-t bg-gradient-to-b from-gray-50 to-white px-6 py-4">
          <p className="mb-3 text-gray-700">{faq.a}</p>
          {faq.expanded && (
            <div className="mt-3 rounded-lg border-teal-400 border-l-4 bg-teal-50 p-4">
              <p className="text-gray-700 text-sm">{faq.expanded}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('')
  const [isTocOpen, setIsTocOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome to Illia: Your Lowcountry Lead Hub',
      subtitle: 'Empowering Charleston small businesses with AI-powered local leads.',
      content: [
        'Illia uses AI to generate high-intent leads from public sources like Google Places and reviews. No cold calling ghosts—just ready-to-contact businesses in your ZIP (e.g., plumbers in 29401).',
        "Founded in 2025, we're built for SC's booming scene—tourism spikes, humid summers, and King St events. Ethical, CCPA-safe, and starting at free trials.",
        'Why Illia? 90% accuracy, <5s gens, 20% higher closes vs. manual search. Join 500+ Lowcountry owners booking 5x more.',
      ],
      expanded: {
        title: 'Quick Start Video',
        content: 'Watch our 2-minute overview to see Illia in action.',
        placeholder: '[Video Player: Illia Dashboard Walkthrough]',
      },
    },
    {
      id: 'how-it-works',
      title: 'How Illia Works: 3 Simple Steps',
      subtitle: 'From query to CSV in minutes.',
      steps: [
        {
          number: '1',
          icon: 'INPUT',
          description:
            'Enter Your Turf: Niche (e.g., "cafes") + ZIP (29401 default) + radius (5mi). Takes 30s.',
          details:
            'Pro tip: Use specific keywords like "emergency plumber" for higher intent scores.',
        },
        {
          number: '2',
          icon: 'AI',
          description:
            'AI Digs Deep: Scrapes public data, extracts emails/phones, scores 0-100 on intent (e.g., "emergency leak" = 95 via ChatGPT 5).',
          details: 'Our algorithm analyzes review patterns, response times, and urgency signals.',
        },
        {
          number: '3',
          icon: 'EXPORT',
          description:
            'Export & Crush: CSV with name/email/phone/notes. Book meetings 2x faster—track in Analytics.',
          details: 'Compatible with all major CRMs: Salesforce, HubSpot, Pipedrive, and more.',
        },
      ],
      codeExample: `// Example API Integration
const response = await fetch('/api/generate-leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    niche: 'plumbers',
    zipCode: '29401',
    radius: 5
  })
});
const leads = await response.json();`,
    },
    {
      id: 'pricing',
      title: 'Tiers & Credits: Scale Your Way',
      subtitle: 'Start free, upgrade for unlimited.',
      tiers: [
        {
          name: 'Starter',
          price: 'Free',
          credits: '1 lead/trial',
          features: ['Quick test in 29401', 'Basic scoring', 'Email support'],
          popular: false,
        },
        {
          name: 'Basic',
          price: '$99/mo',
          credits: '500 leads/mo',
          features: ['Full ZIP/radius', 'CSV export', 'Analytics', 'Chat support'],
          popular: true,
        },
        {
          name: 'Pro',
          price: '$299/mo',
          credits: 'Unlimited',
          features: ['Advanced agent', 'Zapier/Sheets', 'Priority support', 'Custom fields'],
          popular: false,
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          credits: 'Unlimited + API',
          features: ['Custom schemas', 'MEDC integrations', 'Dedicated setup', 'SLA guarantee'],
          popular: false,
        },
      ],
    },
    {
      id: 'dashboard',
      title: 'Dashboard Guide: First-Time Walkthrough',
      subtitle: 'What to do when you log in.',
      guide: [
        {
          step: 'Quick Generate Card',
          description:
            'Click to input niche/ZIP—get 10 leads instantly. Start here for your first run.',
          icon: 'QUICK',
          screenshot: '[Screenshot: Quick Generate interface with form fields]',
        },
        {
          step: 'Recent Leads',
          description: 'Top 3 from last gen—click "Export CSV" to download. Empty? Hit Generate!',
          icon: 'RECENT',
          screenshot: '[Screenshot: Recent leads table with export button]',
        },
        {
          step: 'Analytics',
          description: 'Track ROI (conversion rate, avg score). See trends for King St spikes.',
          icon: 'ANALYTICS',
          screenshot: '[Screenshot: Analytics dashboard with charts]',
        },
        {
          step: 'Upgrade',
          description: 'Switch tiers—Basic for 500 leads, Pro for unlimited. Billing via Stripe.',
          icon: 'UPGRADE',
          screenshot: '[Screenshot: Pricing tier comparison]',
        },
        {
          step: 'Integrations',
          description: 'Connect Zapier for auto-emails or Sheets for CRM. Pro only.',
          icon: 'INTEGRATIONS',
          screenshot: '[Screenshot: Integration settings panel]',
        },
      ],
    },
    {
      id: 'credits',
      title: 'Credits Explained: No Surprises',
      subtitle: 'Simple quotas, easy resets.',
      content: [
        'Credits = Leads generated/mo (resets 1st). Basic: 500; Pro: Unlimited.',
        'Usage: Quick Generate uses 1 credit/lead. Track in Usage tab—bonus from promos (e.g., 10 free for 29401 trials).',
        'Over limit? Pause or upgrade—no fees. Questions? support@illia-leads.com.',
      ],
      table: {
        headers: ['Action', 'Credits Used', 'Notes'],
        rows: [
          ['Generate Lead', '1', 'Per business found'],
          ['Export CSV', '0', 'Unlimited exports'],
          ['Re-score Lead', '0.5', 'Update intent scoring'],
          ['Bulk Import', '0', 'Pro feature only'],
        ],
      },
    },
    {
      id: 'faq',
      title: 'Charleston Tips & FAQ',
      subtitle: 'Maximize your Lowcountry edge.',
      faq: [
        {
          q: 'Best niches for Charleston?',
          a: 'Plumbers/HVAC (summers), cafes/bars (tourists), real estate (NoMo boom). Try "roofers Folly Beach" for storm season leads.',
          expanded:
            "Charleston's unique climate creates seasonal opportunities. Summer humidity drives HVAC demand, while tourist season (Mar-Nov) boosts hospitality businesses. Hurricane season (Jun-Nov) spikes demand for roofers, tree services, and restoration companies.",
        },
        {
          q: 'How accurate are scores?',
          a: '90% via reviews—high (80+) means urgent (e.g., "leaky faucet now"). Ethical: Public data only.',
          expanded:
            'Our AI analyzes review sentiment, response patterns, and keyword urgency. Scores above 80 indicate immediate need ("emergency," "urgent," "ASAP"). 60-79 suggests planned work. Below 60 is general interest. We never access private data—only public reviews and listings.',
        },
        {
          q: 'Integrations available?',
          a: 'Zapier for auto-SMS, Sheets for CRM. Pro unlocks; setup in Integrations card.',
          expanded:
            'Connect to 5000+ apps via Zapier: auto-send emails, SMS (Twilio), add to CRMs (HubSpot, Salesforce), or sync with Google Sheets. Pro users get webhooks for real-time data. Setup takes <5 minutes with our templates.',
        },
        {
          q: 'Billing & Cancel?',
          a: 'Stripe monthly—no contracts. Cancel anytime in Billing toggle (Settings).',
          expanded:
            'We use Stripe for secure payments. Plans renew monthly on your signup date. Cancel anytime—you keep access until period ends. Upgrade/downgrade instantly. Need a pause? Email us for vacation holds. Enterprise gets NET30 invoicing.',
        },
        {
          q: 'API Documentation?',
          a: 'REST API for Pro/Enterprise. Rate limits: 100/min (Pro), unlimited (Enterprise).',
          expanded:
            'Full REST API with JWT auth. Endpoints: /leads/generate, /leads/export, /analytics/summary. SDKs for Node.js, Python, PHP. Rate limits: Basic (10/min), Pro (100/min), Enterprise (unlimited). See docs.illia-leads.com/api.',
        },
        {
          q: 'Data Privacy & GDPR?',
          a: 'CCPA/GDPR compliant. Public data only, encrypted storage, auto-deletion options.',
          expanded:
            'We only collect publicly available business data. All data encrypted at rest (AES-256) and in transit (TLS 1.3). GDPR: EU data stays in EU servers. Right to deletion within 48hrs. CCPA: California residents can opt-out. SOC2 Type II certified.',
        },
        {
          q: 'Support Response Times?',
          a: 'Email: 24hrs. Chat: 2hrs (Pro), 30min (Enterprise). Phone for Enterprise only.',
          expanded:
            'Starter: Email only (hello@illia-leads.com), 24-48hr response. Basic: Email + chat, 24hr email, 4hr chat. Pro: Priority queue, 12hr email, 2hr chat. Enterprise: Dedicated account manager, 30min SLA, phone support, Slack channel.',
        },
      ],
    },
  ]

  const tocItems = sections.map((section) => ({
    id: section.id,
    title: section.title.split(':')[0],
    icon: getIconForSection(section.id),
  }))

  function getIconForSection(id: string) {
    switch (id) {
      case 'welcome':
        return '🏠'
      case 'how-it-works':
        return '⚙️'
      case 'pricing':
        return '💳'
      case 'dashboard':
        return '📊'
      case 'credits':
        return '🪙'
      case 'faq':
        return '❓'
      default:
        return '📄'
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)

      const scrollPosition = window.scrollY + 100
      let currentSection = ''

      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          currentSection = id
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
      setIsTocOpen(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredSections = sections.filter((section) => {
    if (!searchQuery) {
      return true
    }
    const query = searchQuery.toLowerCase()
    return (
      section.title.toLowerCase().includes(query) ||
      section.subtitle?.toLowerCase().includes(query) ||
      JSON.stringify(section).toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile TOC Toggle */}
      <button
        aria-label="Toggle table of contents"
        className="fixed top-20 left-4 z-50 rounded-lg border border-gray-200 bg-white p-3 shadow-lg hover:bg-gray-50 lg:hidden"
        onClick={() => setIsTocOpen(!isTocOpen)}
      >
        {isTocOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* TOC Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 transform border-gray-200 border-r bg-white shadow-xl transition-transform duration-300 ${
          isTocOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto lg:translate-x-0`}
      >
        <div className="sticky top-0 border-gray-200 border-b bg-white p-6">
          <h2 className="mb-4 font-bold text-gray-800 text-lg">Documentation</h2>
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-500" />
            <input
              aria-label="Search documentation"
              className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-10 text-gray-800 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs..."
              type="text"
              value={searchQuery}
            />
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left transition-all duration-200 ${
                    activeSection === item.id
                      ? 'border-teal-500 border-l-4 bg-teal-50 pl-3 font-semibold text-teal-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-gray-200 border-t p-4">
          <a
            className="block w-full rounded-lg bg-teal-600 px-4 py-2 text-center font-medium text-sm text-white transition-colors hover:bg-teal-700"
            href="/dashboard"
          >
            Back to Dashboard
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="px-4 py-12 sm:px-6 lg:ml-72 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="mb-4 font-bold text-4xl text-teal-600">
              Illia Docs: Your Lowcountry Lead Guide
            </h1>
            <p className="text-gray-700 text-lg">
              Power your Charleston business with AI—step-by-step from setup to scaling.
            </p>
          </header>

          {/* Sections */}
          {filteredSections.map((section) => (
            <section
              className="mb-12 scroll-mt-20 rounded-xl bg-white p-8 shadow-md"
              id={section.id}
              key={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el
              }}
            >
              <h2 className="mb-2 flex items-center font-semibold text-2xl text-gray-900">
                {section.title}
                <ChevronRight className="ml-2 h-5 w-5 text-teal-500" />
              </h2>
              {section.subtitle && <p className="mb-6 text-gray-700 italic">{section.subtitle}</p>}

              {/* Regular content */}
              {section.content && (
                <ul className="mb-6 space-y-3 text-gray-800">
                  {section.content.map((item, j) => (
                    <li className="flex items-start" key={j}>
                      <Check className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-teal-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Expanded content */}
              {section.expanded && (
                <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <h3 className="mb-2 font-semibold text-gray-900">{section.expanded.title}</h3>
                  <p className="mb-3 text-gray-700">{section.expanded.content}</p>
                  <div className="rounded bg-gray-200 p-8 text-center text-gray-600">
                    <Image className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                    <span className="text-sm">{section.expanded.placeholder}</span>
                  </div>
                </div>
              )}

              {/* Steps */}
              {section.steps && (
                <>
                  <div className="mb-6 grid gap-6 md:grid-cols-3">
                    {section.steps.map((step, j) => (
                      <div
                        className="rounded-xl border-2 border-teal-100 bg-gradient-to-b from-teal-50 to-white p-6 text-center transition-shadow hover:shadow-lg"
                        key={j}
                      >
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 shadow-md">
                          <span className="font-bold text-2xl text-teal-700">{step.number}</span>
                        </div>
                        <h3 className="mb-2 font-bold text-gray-900">{step.icon}</h3>
                        <p className="mb-3 text-gray-700 text-sm">{step.description}</p>
                        <p className="text-gray-600 text-xs italic">{step.details}</p>
                      </div>
                    ))}
                  </div>
                  {section.codeExample && (
                    <div className="mt-6 overflow-x-auto rounded-lg bg-gray-900 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-gray-400 text-xs">JavaScript</span>
                        <Code className="h-4 w-4 text-gray-400" />
                      </div>
                      <pre className="text-gray-300 text-sm">
                        <code>{section.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}

              {/* Pricing Tiers */}
              {section.tiers && (
                <div className="grid gap-4 md:grid-cols-4">
                  {section.tiers.map((tier, j) => (
                    <div
                      className={`rounded-xl border-2 p-6 text-center ${
                        tier.popular
                          ? 'scale-105 border-teal-500 bg-gradient-to-b from-teal-50 to-white shadow-lg'
                          : 'border-gray-200 bg-white'
                      }`}
                      key={j}
                    >
                      {tier.popular && (
                        <span className="mb-3 inline-block rounded-full bg-teal-500 px-3 py-1 font-semibold text-white text-xs">
                          Most Popular
                        </span>
                      )}
                      <h3 className="mb-2 font-bold text-gray-900 text-lg">{tier.name}</h3>
                      <p className="mb-4 font-bold text-3xl text-teal-600">{tier.price}</p>
                      <p className="mb-4 font-medium text-gray-700 text-sm">{tier.credits}</p>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        {tier.features.map((f, k) => (
                          <li className="flex items-center justify-center" key={k}>
                            <Check className="mr-2 h-4 w-4 flex-shrink-0 text-teal-500" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Dashboard Guide */}
              {section.guide && (
                <ul className="space-y-6">
                  {section.guide.map((step, j) => (
                    <li className="flex items-start" key={j}>
                      <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 shadow">
                        <span className="font-bold text-sm text-teal-700">{j + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 font-bold text-gray-900">{step.step}</h3>
                        <p className="mb-3 text-gray-700">{step.description}</p>
                        <div className="rounded-lg bg-gray-100 p-6 text-center">
                          <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                          <span className="text-gray-600 text-sm">{step.screenshot}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Credits Table */}
              {section.table && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {section.table.headers.map((header, idx) => (
                          <th
                            className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800"
                            key={idx}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, idx) => (
                        <tr className="hover:bg-gray-50" key={idx}>
                          {row.map((cell, cellIdx) => (
                            <td
                              className="border border-gray-300 px-4 py-2 text-gray-700"
                              key={cellIdx}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* FAQ Accordion */}
              {section.faq && (
                <div className="space-y-4">
                  {section.faq.map((faq, j) => (
                    <FaqItem faq={faq} key={j} />
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Support CTA */}
          <div className="mt-12 rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-teal-100 p-8 text-center shadow-lg">
            <h2 className="mb-4 font-bold text-2xl text-teal-700">Need Help?</h2>
            <p className="mb-6 text-gray-700 text-lg">
              Questions on credits, integrations, or Charleston tips?
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                className="rounded-lg bg-teal-600 px-8 py-3 font-medium text-white shadow-md transition-colors hover:bg-teal-700"
                href="mailto:hello@illia-leads.com"
              >
                Email Support
              </a>
              <a
                className="rounded-lg border-2 border-teal-600 bg-white px-8 py-3 font-medium text-teal-600 transition-colors hover:bg-gray-50"
                href="/dashboard"
              >
                Back to Dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          aria-label="Scroll to top"
          className="fixed right-8 bottom-8 transform rounded-full bg-teal-600 p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-teal-700"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
