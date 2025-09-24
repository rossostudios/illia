import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-2xl text-teal-400">Illia</h3>
            <p className="text-gray-400 text-sm">
              Connect with trusted service providers in your area. Find cleaners, handymen, and home
              services with verified reviews and instant booking.
            </p>
            <div className="flex gap-4">
              <a
                className="text-gray-400 transition-colors hover:text-teal-400"
                href="https://github.com"
              >
                <svg
                  aria-label="icon"
                  className="h-5 w-5"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                >
                  <title>Icon</title>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                className="text-gray-400 transition-colors hover:text-teal-400"
                href="https://twitter.com"
              >
                <svg
                  aria-label="icon"
                  className="h-5 w-5"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                >
                  <title>Icon</title>
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                className="text-gray-400 transition-colors hover:text-teal-400"
                href="https://linkedin.com"
              >
                <svg
                  aria-label="icon"
                  className="h-5 w-5"
                  fill="currentColor"
                  role="img"
                  viewBox="0 0 24 24"
                >
                  <title>Icon</title>
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-100">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/playground"
                >
                  Playground
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/integrations"
                >
                  Integrations
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 transition-colors hover:text-teal-400" href="/api">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-100">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-gray-400 transition-colors hover:text-teal-400" href="/docs">
                  Documentation
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 transition-colors hover:text-teal-400" href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/guides"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/changelog"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="https://github.com/illia"
                >
                  Open Source
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-100">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-gray-400 transition-colors hover:text-teal-400" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-400 transition-colors hover:text-teal-400"
                  href="/partners"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link className="text-gray-400 transition-colors hover:text-teal-400" href="/press">
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Email Signup */}
        <div className="border-gray-800 border-t py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="mb-1 font-semibold text-lg">Stay updated with our newsletter</h3>
              <p className="text-gray-400 text-sm">
                Get the latest tips on lead generation and AI automation
              </p>
            </div>
            <form className="flex w-full gap-2 md:w-auto">
              <input
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none md:w-64"
                placeholder="Enter your email"
                type="email"
              />
              <button
                className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-teal-700"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-gray-800 border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-gray-400 text-sm sm:flex-row">
            <div className="flex items-center gap-6">
              <span>© 2025 Illia. All rights reserved.</span>
              <Link className="transition-colors hover:text-teal-400" href="/privacy">
                Privacy
              </Link>
              <Link className="transition-colors hover:text-teal-400" href="/terms">
                Terms
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <span className="text-teal-400">♥</span>
              <span>Remotely</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
