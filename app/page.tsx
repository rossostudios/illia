import AnnouncementBar from '@/components/AnnouncementBar'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SocialProof from '@/components/SocialProof'
import Features from '@/components/Features'

export default function Home() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
    </div>
  )
}