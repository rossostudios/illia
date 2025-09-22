'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Search, MapPin, Star, Users, Globe, ChevronRight, Lightbulb } from 'lucide-react'

interface SEOTip {
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'gmb' | 'content' | 'keywords' | 'reviews'
  icon: React.ReactNode
}

interface LocalSEOWidgetProps {
  niche?: string
  zipCode?: string
  leadCount?: number
}

export default function LocalSEOWidget({ niche = 'plumbers', zipCode = '29401', leadCount = 0 }: LocalSEOWidgetProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [seoTips, setSeoTips] = useState<SEOTip[]>([])

  useEffect(() => {
    // Generate SEO tips based on niche and location
    const tips = generateSEOTips(niche, zipCode, leadCount)
    setSeoTips(tips)
  }, [niche, zipCode, leadCount])

  useEffect(() => {
    // Auto-rotate tips every 8 seconds
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % seoTips.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [seoTips.length])

  const generateSEOTips = (niche: string, zip: string, leads: number): SEOTip[] => {
    const baseTips: SEOTip[] = []

    // Charleston-specific ZIP insights
    const zipInsights: Record<string, string[]> = {
      '29401': ['Downtown Charleston', 'Historic District', 'King Street'],
      '29403': ['Upper King', 'Cannonborough', 'Elliottborough'],
      '29405': ['North Charleston', 'Park Circle', 'Riverfront'],
      '29407': ['West Ashley', 'Avondale', 'Byrnes Down'],
      '29412': ['James Island', 'Folly Beach Road', 'Harbor View']
    }

    const areaNames = zipInsights[zip] || ['Charleston area']
    const primaryArea = areaNames[0]

    // Google My Business optimization tips
    baseTips.push({
      title: `Add "${primaryArea}" to GMB title`,
      description: `Include neighborhood name for 28% better local visibility. Example: "${niche.charAt(0).toUpperCase() + niche.slice(1)} - ${primaryArea}"`,
      impact: 'high',
      category: 'gmb',
      icon: <MapPin className="h-4 w-4" />
    })

    // Seasonal/event keywords
    const currentMonth = new Date().getMonth()
    const seasonalKeywords: Record<number, string> = {
      0: 'New Year emergency',
      1: 'Valentine prep',
      2: 'Spring Festival',
      3: 'Cooper River Bridge Run',
      4: 'Spoleto Festival',
      5: 'Summer tourism',
      6: 'July 4th weekend',
      7: 'Back-to-school',
      8: 'Fall preparation',
      9: 'Halloween events',
      10: 'Thanksgiving prep',
      11: 'Holiday season'
    }

    baseTips.push({
      title: `Target "${seasonalKeywords[currentMonth]}" keywords`,
      description: `Charleston searches spike 40% for "${niche}" + seasonal terms. Update GMB posts weekly.`,
      impact: 'high',
      category: 'keywords',
      icon: <Search className="h-4 w-4" />
    })

    // Review optimization
    baseTips.push({
      title: 'Request reviews mentioning location',
      description: `Ask customers to mention "${primaryArea}" in reviews. Boosts local ranking by 35%.`,
      impact: 'medium',
      category: 'reviews',
      icon: <Star className="h-4 w-4" />
    })

    // Content suggestions based on lead insights
    if (leads > 10) {
      baseTips.push({
        title: 'Create area-specific landing pages',
        description: `Your ${leads} leads show demand in ${primaryArea}. Create dedicated service pages for each neighborhood.`,
        impact: 'high',
        category: 'content',
        icon: <Globe className="h-4 w-4" />
      })
    }

    // Niche-specific tips
    const nicheSpecificTips: Record<string, SEOTip> = {
      plumbers: {
        title: 'Add "emergency 24/7" to meta description',
        description: 'Charleston plumbing searches include "emergency" 45% of the time. Crucial for visibility.',
        impact: 'high',
        category: 'keywords',
        icon: <TrendingUp className="h-4 w-4" />
      },
      hvac: {
        title: 'Optimize for "AC repair Charleston heat"',
        description: 'Summer HVAC searches triple in Charleston. Add humidity & heat-related keywords.',
        impact: 'high',
        category: 'keywords',
        icon: <TrendingUp className="h-4 w-4" />
      },
      restaurants: {
        title: 'Feature "tourist-friendly" badges',
        description: '7M+ annual visitors search "best restaurants near me". Add visitor amenities to listings.',
        impact: 'medium',
        category: 'gmb',
        icon: <Users className="h-4 w-4" />
      },
      cafes: {
        title: 'Highlight "WiFi + workspace" features',
        description: 'Remote workers in Charleston up 40%. Emphasize work-friendly amenities in GMB.',
        impact: 'medium',
        category: 'gmb',
        icon: <Globe className="h-4 w-4" />
      }
    }

    if (nicheSpecificTips[niche.toLowerCase()]) {
      baseTips.push(nicheSpecificTips[niche.toLowerCase()])
    }

    // Competition insights
    baseTips.push({
      title: 'Monitor competitor GMB Q&As',
      description: `Top ${niche} in ${primaryArea} answer 5+ questions weekly. Stay active to outrank them.`,
      impact: 'medium',
      category: 'gmb',
      icon: <Users className="h-4 w-4" />
    })

    return baseTips.slice(0, 5) // Return top 5 tips
  }

  if (seoTips.length === 0) return null

  const currentTip = seoTips[currentTipIndex]

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold text-gray-900">Local SEO Quick Wins</h3>
          </div>
          <span className="text-xs text-gray-600">Charleston-optimized</span>
        </div>
      </div>

      {/* Carousel Content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Current Tip */}
          <div className="min-h-[100px]">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                currentTip.impact === 'high' ? 'bg-green-100' :
                currentTip.impact === 'medium' ? 'bg-yellow-100' :
                'bg-gray-100'
              }`}>
                {currentTip.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{currentTip.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{currentTip.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    currentTip.impact === 'high' ? 'bg-green-100 text-green-700' :
                    currentTip.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {currentTip.impact} impact
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentTip.category.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {seoTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTipIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentTipIndex
                    ? 'w-8 bg-teal-600'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View tip ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        <button className="flex items-center justify-between w-full group">
          <span className="text-sm text-gray-600">
            Personalized for <span className="font-medium">{niche}</span> in ZIP {zipCode}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}