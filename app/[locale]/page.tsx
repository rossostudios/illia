import dynamic from 'next/dynamic'
import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import SocialProof from '@/components/SocialProof'
import FeaturesSkeleton from '@/components/skeletons/FeaturesSkeleton'
import HeroSkeleton from '@/components/skeletons/HeroSkeleton'

const AnimatedHero = dynamic(() => import('@/components/AnimatedHero'), {
  loading: () => <HeroSkeleton />,
  ssr: true,
})

const AnimatedFeatures = dynamic(() => import('@/components/AnimatedFeatures'), {
  loading: () => <FeaturesSkeleton />,
  ssr: true,
})

export default function Home() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <AnimatedHero />
      <SocialProof />
      <AnimatedFeatures />
    </div>
  )
}
