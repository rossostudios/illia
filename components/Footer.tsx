import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 text-sm">
          <span className="text-gray-300">© 2025 Illia. All rights reserved.</span>
          <span className="hidden sm:inline text-gray-500">|</span>
          <Link
            href="/privacy"
            className="text-gray-300 hover:text-teal-400 transition-colors"
          >
            Privacy
          </Link>
          <span className="hidden sm:inline text-gray-500">|</span>
          <Link
            href="/terms"
            className="text-gray-300 hover:text-teal-400 transition-colors"
          >
            Terms
          </Link>
          <span className="hidden sm:inline text-gray-500">|</span>
          <a
            href="mailto:hello@illia.club"
            className="text-gray-300 hover:text-teal-400 transition-colors"
          >
            hello@illia.club
          </a>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Built with <span className="text-teal-400">♥</span> in Charleston, SC
          </p>
        </div>
      </div>
    </footer>
  )
}