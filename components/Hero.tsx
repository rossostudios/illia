'use client'

import { ArrowRight, CheckCircle, Play } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-green-50 pt-20 pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-20 w-96 h-96 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-20 w-96 h-96 bg-gradient-to-r from-teal-100 to-green-100 rounded-full opacity-30 blur-3xl animate-pulse" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Turn Local Searches Into Your
            <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Trusted Home Team
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Automate your expat setup in Medellín or Florianópolis—find, match, and connect with
            vetted cleaners & cooks in seconds.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/dashboard/explore"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No card needed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>2-min quiz</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>100 free matches</span>
            </div>
          </div>
        </div>

        {/* Interactive Demo Preview */}
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-600">Illia.club - Explore Matches</span>
              </div>
            </div>
            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <div className="space-y-3">
                  <div className="bg-green-600 text-white rounded-lg px-4 py-2 font-medium">
                    Explore
                  </div>
                  <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                    My Matches
                  </div>
                  <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                    Analytics
                  </div>
                  <div className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                    Settings
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="flex-1 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Weekly cleaner in El Poblado
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Maria Rodriguez',
                      service: 'Reliable cook, $200/mo',
                      rating: 4.9,
                      reviews: 47,
                    },
                    {
                      name: 'Carlos Martinez',
                      service: 'Weekly cleaner, $150/mo',
                      rating: 4.8,
                      reviews: 31,
                    },
                    {
                      name: 'Ana Silva',
                      service: 'Deep clean expert, $180/mo',
                      rating: 4.7,
                      reviews: 28,
                    },
                    { name: 'Luis Gomez', service: 'Meal prep, $220/mo', rating: 4.9, reviews: 42 },
                  ].map((match) => (
                    <div
                      key={match.name}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{match.name}</h4>
                        <span className="text-sm text-gray-600">{match.service}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-gray-900">{match.rating}</span>
                          <span className="text-sm text-gray-500">({match.reviews})</span>
                        </div>
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-6 w-full bg-green-50 text-green-700 border border-green-200 rounded-lg py-3 font-medium hover:bg-green-100 transition-colors"
                >
                  View All Matches
                </button>
              </div>
            </div>
          </div>

          {/* Shadow effect */}
          <div className="absolute -inset-x-4 -bottom-4 h-20 bg-gradient-to-t from-gray-100 to-transparent blur-xl -z-10"></div>
        </div>
      </div>
    </section>
  )
}
