'use client'

// Real-time Community page with Supabase Realtime features

import dynamic from 'next/dynamic'

// Dynamically import the real-time component to avoid SSR issues
const RealtimeCommunity = dynamic(() => import('@/components/community/RealtimeCommunity'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-warmth-50/30">
      <div className="h-12 w-12 animate-spin rounded-full border-teal-600 border-b-2" />
    </div>
  ),
})

export default function CommunityPage() {
  return <RealtimeCommunity />
}
