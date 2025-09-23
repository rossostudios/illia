'use client'

// Real-time Community page with Supabase Realtime features

import dynamic from 'next/dynamic'

// Dynamically import the real-time component to avoid SSR issues
const RealtimeCommunity = dynamic(() => import('@/components/community/RealtimeCommunity'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-warmth-50/30 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
    </div>
  ),
})

export default function CommunityPage() {
  return <RealtimeCommunity />
}
