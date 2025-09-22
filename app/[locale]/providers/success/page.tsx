import { CheckCircle, Home, MessageSquare, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function ProviderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Illia.club! 🎉</h1>

          <p className="text-lg text-gray-600 mb-8">
            Your application has been received and is under review. We typically approve new
            providers within 24-48 hours.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">What happens next?</h2>
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">🎁 Earn Extra Bonuses</h2>
            <p className="text-gray-700 mb-3">
              Refer other quality providers and earn $25 for each approved referral!
            </p>
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                Share your unique referral link once approved
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </Link>
            <Link
              href="/dashboard/community"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all"
            >
              <MessageSquare className="h-5 w-5" />
              Join Community Forum
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Questions? Contact us at{' '}
            <a href="mailto:providers@illia.club" className="text-teal-600 hover:underline">
              providers@illia.club
            </a>
          </p>
          <p className="text-xs text-gray-500">Follow us on social media for tips and updates</p>
        </div>
      </div>
    </div>
  )
}
