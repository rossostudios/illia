import { CheckCircle, Home, MessageSquare, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function ProviderSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-white p-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <CheckCircle className="mx-auto mb-6 h-20 w-20 text-green-500" />

          <h1 className="mb-4 font-bold text-3xl text-gray-900">Welcome to Illia.club! 🎉</h1>

          <p className="mb-8 text-gray-600 text-lg">
            Your application has been received and is under review. We typically approve new
            providers within 24-48 hours.
          </p>

          <div className="mb-8 rounded-lg border border-teal-200 bg-teal-50 p-6 text-left">
            <h2 className="mb-3 font-semibold text-gray-900">What happens next?</h2>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-teal-600">1.</span>
                <span>Our team will review your application to ensure quality standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-teal-600">2.</span>
                <span>You'll receive an email confirmation once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-teal-600">3.</span>
                <span>Your profile will be visible to expats searching for services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-teal-600">4.</span>
                <span>Get your $50 bonus after completing your first service!</span>
              </li>
            </ol>
          </div>

          <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-left">
            <h2 className="mb-3 font-semibold text-gray-900">🎁 Earn Extra Bonuses</h2>
            <p className="mb-3 text-gray-700">
              Refer other quality providers and earn $25 for each approved referral!
            </p>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600 text-sm">
                Share your unique referral link once approved
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
              href="/"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>
            <Link
              className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 text-white transition-all hover:from-teal-700 hover:to-teal-800"
              href="/dashboard/community"
            >
              <MessageSquare className="h-5 w-5" />
              Join Community Forum
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="mb-2 text-gray-600 text-sm">
            Questions? Contact us at{' '}
            <a className="text-teal-600 hover:underline" href="mailto:providers@illia.club">
              providers@illia.club
            </a>
          </p>
          <p className="text-gray-500 text-xs">Follow us on social media for tips and updates</p>
        </div>
      </div>
    </div>
  )
}
