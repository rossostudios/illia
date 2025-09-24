'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AnnouncementBar() {
  return (
    <div className="border-gray-900/10 border-b bg-gray-900 px-4 py-3 text-white">
      <div className="w-full">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse text-[#7aa3ff]" />
          <span className="max-w-none font-medium text-white/90">
            First intro on us for new members in Medellín & Floripa—let Illia scout and shortlist
            your home team within 24 hours.
          </span>
          <Link
            className="flex-shrink-0 whitespace-nowrap rounded-full bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/20"
            href="/quiz"
          >
            Claim the offer →
          </Link>
        </div>
      </div>
    </div>
  )
}
