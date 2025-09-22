import AnnouncementBar from '@/components/AnnouncementBar'
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import SocialProof from '@/components/SocialProof'

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
