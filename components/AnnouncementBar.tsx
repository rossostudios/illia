'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
      <div className="w-full">
        <div className="flex items-center justify-center text-sm gap-3">
          <Sparkles className="h-4 w-4 text-teal-600 animate-pulse flex-shrink-0" />
          <span className="text-gray-800 font-medium max-w-none">
            Automate your expat setup in Medellín or Florianópolis—find, match, and connect with
            vetted cleaners & cooks in seconds.
          </span>
          <Link
            href="/dashboard/explore"
            className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2 whitespace-nowrap flex-shrink-0"
          >
            Explore Now →
          </Link>
        </div>
      </div>
    </div>
  )
}
