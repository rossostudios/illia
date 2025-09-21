'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Check, ChevronDown, Search, Menu, X, Code, FileText, Image, ArrowUp } from 'lucide-react';

function FAQItem({ faq }: { faq: { q: string; a: string; expanded?: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-teal-300 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
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
        <div className="px-6 py-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
          <p className="text-gray-700 mb-3">{faq.a}</p>
          {faq.expanded && (
            <div className="mt-3 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400">
              <p className="text-sm text-gray-700">{faq.expanded}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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
        placeholder: '[Video Player: Illia Dashboard Walkthrough]'
      }
    },
    {
      id: 'how-it-works',
      title: 'How Illia Works: 3 Simple Steps',
      subtitle: 'From query to CSV in minutes.',
      steps: [
        {
          number: '1',
          icon: 'INPUT',
          description: 'Enter Your Turf: Niche (e.g., "cafes") + ZIP (29401 default) + radius (5mi). Takes 30s.',
          details: 'Pro tip: Use specific keywords like "emergency plumber" for higher intent scores.'
        },
        {
          number: '2',
          icon: 'AI',
          description: 'AI Digs Deep: Scrapes public data, extracts emails/phones, scores 0-100 on intent (e.g., "emergency leak" = 95 via ChatGPT 5).',
          details: 'Our algorithm analyzes review patterns, response times, and urgency signals.'
        },
        {
          number: '3',
          icon: 'EXPORT',
          description: 'Export & Crush: CSV with name/email/phone/notes. Book meetings 2x faster—track in Analytics.',
          details: 'Compatible with all major CRMs: Salesforce, HubSpot, Pipedrive, and more.'
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
const leads = await response.json();`
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
          popular: false
        },
        {
          name: 'Basic',
          price: '$99/mo',
          credits: '500 leads/mo',
          features: ['Full ZIP/radius', 'CSV export', 'Analytics', 'Chat support'],
          popular: true
        },
        {
          name: 'Pro',
          price: '$299/mo',
          credits: 'Unlimited',
          features: ['Advanced agent', 'Zapier/Sheets', 'Priority support', 'Custom fields'],
          popular: false
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          credits: 'Unlimited + API',
          features: ['Custom schemas', 'MEDC integrations', 'Dedicated setup', 'SLA guarantee'],
          popular: false
        },
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard Guide: First-Time Walkthrough',
      subtitle: 'What to do when you log in.',
      guide: [
        {
          step: 'Quick Generate Card',
          description: 'Click to input niche/ZIP—get 10 leads instantly. Start here for your first run.',
          icon: 'QUICK',
          screenshot: '[Screenshot: Quick Generate interface with form fields]'
        },
        {
          step: 'Recent Leads',
          description: 'Top 3 from last gen—click "Export CSV" to download. Empty? Hit Generate!',
          icon: 'RECENT',
          screenshot: '[Screenshot: Recent leads table with export button]'
        },
        {
          step: 'Analytics',
          description: 'Track ROI (conversion rate, avg score). See trends for King St spikes.',
          icon: 'ANALYTICS',
          screenshot: '[Screenshot: Analytics dashboard with charts]'
        },
        {
          step: 'Upgrade',
          description: 'Switch tiers—Basic for 500 leads, Pro for unlimited. Billing via Stripe.',
          icon: 'UPGRADE',
          screenshot: '[Screenshot: Pricing tier comparison]'
        },
        {
          step: 'Integrations',
          description: 'Connect Zapier for auto-emails or Sheets for CRM. Pro only.',
          icon: 'INTEGRATIONS',
          screenshot: '[Screenshot: Integration settings panel]'
        },
      ]
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
          ['Bulk Import', '0', 'Pro feature only']
        ]
      }
    },
    {
      id: 'faq',
      title: 'Charleston Tips & FAQ',
      subtitle: 'Maximize your Lowcountry edge.',
      faq: [
        {
          q: 'Best niches for Charleston?',
          a: 'Plumbers/HVAC (summers), cafes/bars (tourists), real estate (NoMo boom). Try "roofers Folly Beach" for storm season leads.',
          expanded: 'Charleston\'s unique climate creates seasonal opportunities. Summer humidity drives HVAC demand, while tourist season (Mar-Nov) boosts hospitality businesses. Hurricane season (Jun-Nov) spikes demand for roofers, tree services, and restoration companies.'
        },
        {
          q: 'How accurate are scores?',
          a: '90% via reviews—high (80+) means urgent (e.g., "leaky faucet now"). Ethical: Public data only.',
          expanded: 'Our AI analyzes review sentiment, response patterns, and keyword urgency. Scores above 80 indicate immediate need ("emergency," "urgent," "ASAP"). 60-79 suggests planned work. Below 60 is general interest. We never access private data—only public reviews and listings.'
        },
        {
          q: 'Integrations available?',
          a: 'Zapier for auto-SMS, Sheets for CRM. Pro unlocks; setup in Integrations card.',
          expanded: 'Connect to 5000+ apps via Zapier: auto-send emails, SMS (Twilio), add to CRMs (HubSpot, Salesforce), or sync with Google Sheets. Pro users get webhooks for real-time data. Setup takes <5 minutes with our templates.'
        },
        {
          q: 'Billing & Cancel?',
          a: 'Stripe monthly—no contracts. Cancel anytime in Billing toggle (Settings).',
          expanded: 'We use Stripe for secure payments. Plans renew monthly on your signup date. Cancel anytime—you keep access until period ends. Upgrade/downgrade instantly. Need a pause? Email us for vacation holds. Enterprise gets NET30 invoicing.'
        },
        {
          q: 'API Documentation?',
          a: 'REST API for Pro/Enterprise. Rate limits: 100/min (Pro), unlimited (Enterprise).',
          expanded: 'Full REST API with JWT auth. Endpoints: /leads/generate, /leads/export, /analytics/summary. SDKs for Node.js, Python, PHP. Rate limits: Basic (10/min), Pro (100/min), Enterprise (unlimited). See docs.illia-leads.com/api.'
        },
        {
          q: 'Data Privacy & GDPR?',
          a: 'CCPA/GDPR compliant. Public data only, encrypted storage, auto-deletion options.',
          expanded: 'We only collect publicly available business data. All data encrypted at rest (AES-256) and in transit (TLS 1.3). GDPR: EU data stays in EU servers. Right to deletion within 48hrs. CCPA: California residents can opt-out. SOC2 Type II certified.'
        },
        {
          q: 'Support Response Times?',
          a: 'Email: 24hrs. Chat: 2hrs (Pro), 30min (Enterprise). Phone for Enterprise only.',
          expanded: 'Starter: Email only (hello@illia-leads.com), 24-48hr response. Basic: Email + chat, 24hr email, 4hr chat. Pro: Priority queue, 12hr email, 2hr chat. Enterprise: Dedicated account manager, 30min SLA, phone support, Slack channel.'
        }
      ]
    }
  ];

  const tocItems = sections.map(section => ({
    id: section.id,
    title: section.title.split(':')[0],
    icon: getIconForSection(section.id)
  }));

  function getIconForSection(id: string) {
    switch(id) {
      case 'welcome': return '🏠';
      case 'how-it-works': return '⚙️';
      case 'pricing': return '💳';
      case 'dashboard': return '📊';
      case 'credits': return '🪙';
      case 'faq': return '❓';
      default: return '📄';
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 100;
      let currentSection = '';

      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setIsTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSections = sections.filter(section => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return section.title.toLowerCase().includes(query) ||
           section.subtitle?.toLowerCase().includes(query) ||
           JSON.stringify(section).toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile TOC Toggle */}
      <button
        onClick={() => setIsTocOpen(!isTocOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Toggle table of contents"
      >
        {isTocOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
      </button>

      {/* TOC Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-40 transform transition-transform duration-300 ${
        isTocOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 overflow-y-auto`}>
        <div className="p-6 sticky top-0 bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Documentation</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500"
              aria-label="Search documentation"
            />
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    activeSection === item.id
                      ? 'bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-500 pl-3'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <a
            href="/dashboard"
            className="block w-full text-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            Back to Dashboard
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-72 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-teal-600 mb-4">Illia Docs: Your Lowcountry Lead Guide</h1>
            <p className="text-gray-700 text-lg">Power your Charleston business with AI—step-by-step from setup to scaling.</p>
          </header>

          {/* Sections */}
          {filteredSections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el }}
              className="mb-12 bg-white rounded-xl shadow-md p-8 scroll-mt-20"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                {section.title}
                <ChevronRight className="h-5 w-5 ml-2 text-teal-500" />
              </h2>
              {section.subtitle && <p className="text-gray-700 mb-6 italic">{section.subtitle}</p>}

              {/* Regular content */}
              {section.content && (
                <ul className="space-y-3 text-gray-800 mb-6">
                  {section.content.map((item, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="h-5 w-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Expanded content */}
              {section.expanded && (
                <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{section.expanded.title}</h3>
                  <p className="text-gray-700 mb-3">{section.expanded.content}</p>
                  <div className="bg-gray-200 rounded p-8 text-center text-gray-600">
                    <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm">{section.expanded.placeholder}</span>
                  </div>
                </div>
              )}

              {/* Steps */}
              {section.steps && (
                <>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {section.steps.map((step, j) => (
                      <div key={j} className="text-center p-6 border-2 border-teal-100 rounded-xl bg-gradient-to-b from-teal-50 to-white hover:shadow-lg transition-shadow">
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                          <span className="text-2xl font-bold text-teal-700">{step.number}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{step.icon}</h3>
                        <p className="text-sm text-gray-700 mb-3">{step.description}</p>
                        <p className="text-xs text-gray-600 italic">{step.details}</p>
                      </div>
                    ))}
                  </div>
                  {section.codeExample && (
                    <div className="mt-6 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">JavaScript</span>
                        <Code className="h-4 w-4 text-gray-400" />
                      </div>
                      <pre className="text-sm text-gray-300">
                        <code>{section.codeExample}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}

              {/* Pricing Tiers */}
              {section.tiers && (
                <div className="grid md:grid-cols-4 gap-4">
                  {section.tiers.map((tier, j) => (
                    <div key={j} className={`border-2 rounded-xl p-6 text-center ${
                      tier.popular
                        ? 'border-teal-500 bg-gradient-to-b from-teal-50 to-white shadow-lg scale-105'
                        : 'border-gray-200 bg-white'
                    }`}>
                      {tier.popular && (
                        <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs rounded-full mb-3 font-semibold">
                          Most Popular
                        </span>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{tier.name}</h3>
                      <p className="text-3xl font-bold text-teal-600 mb-4">{tier.price}</p>
                      <p className="text-sm text-gray-700 mb-4 font-medium">{tier.credits}</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {tier.features.map((f, k) => (
                          <li key={k} className="flex items-center justify-center">
                            <Check className="h-4 w-4 text-teal-500 mr-2 flex-shrink-0" />
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
                    <li key={j} className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow">
                        <span className="text-sm font-bold text-teal-700">{j + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{step.step}</h3>
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <span className="text-sm text-gray-600">{step.screenshot}</span>
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
                          <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="border border-gray-300 px-4 py-2 text-gray-700">
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
                    <FAQItem key={j} faq={faq} />
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Support CTA */}
          <div className="text-center mt-12 p-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl shadow-lg border-2 border-teal-200">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">Need Help?</h2>
            <p className="text-gray-700 mb-6 text-lg">Questions on credits, integrations, or Charleston tips?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@illia-leads.com"
                className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-md"
              >
                Email Support
              </a>
              <a
                href="/dashboard"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium border-2 border-teal-600"
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
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}