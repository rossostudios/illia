'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="border-teal-100 border-b bg-teal-50 px-4 py-3">
      <div className="w-full">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse text-teal-600" />
          <span className="max-w-none font-medium text-gray-800">
            Automate your expat setup in Medellín or Florianópolis—find, match, and connect with
            vetted cleaners & cooks in seconds.
          </span>
          <Link
            className="flex-shrink-0 whitespace-nowrap font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700"
            href="/dashboard/explore"
          >
            Explore Now →
          </Link>
        </div>
      </div>
    </div>
  )
}
