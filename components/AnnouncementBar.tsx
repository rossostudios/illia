"use client";

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 px-4 py-2.5 border-b border-green-100">
      <div className="flex items-center justify-center text-sm gap-2">
        <Sparkles className="h-4 w-4 text-green-600 animate-pulse" />
        <span className="text-gray-800 font-medium">
          New in Medellín: 50+ Vetted Cleaners Added!
        </span>
        <Link href="/dashboard/explore" className="font-semibold text-green-600 hover:text-green-700 underline underline-offset-2">
          Explore Now →
        </Link>
      </div>
    </div>
  )
}