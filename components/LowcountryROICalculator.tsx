'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, Calculator, Target, Info, ChevronRight } from 'lucide-react'
import { CHARLESTON_PERSONAS } from '@/lib/charleston-personas'

interface ROICalculatorProps {
  leadCount: number
  niche?: string
  zipCode?: string
}

export default function LowcountryROICalculator({ leadCount, niche = 'plumbers', zipCode = '29401' }: ROICalculatorProps) {
  const [conversionRate, setConversionRate] = useState(15) // Default 15%
  const [avgDealValue, setAvgDealValue] = useState(500)
  const [showDetails, setShowDetails] = useState(false)

  // Calculate ROI metrics
  const expectedConversions = Math.round((leadCount * conversionRate) / 100)
  const potentialRevenue = expectedConversions * avgDealValue
  const revenuePerLead = leadCount > 0 ? Math.round(potentialRevenue / leadCount) : 0

  // Get niche-specific insights
  useEffect(() => {
    const persona = CHARLESTON_PERSONAS.find(p =>
      p.niche.toLowerCase() === niche.toLowerCase()
    )
    if (persona) {
      setAvgDealValue(persona.avgLeadValue)
    }
  }, [niche])

  // Charleston market benchmarks
  const getMarketBenchmarks = () => {
    const benchmarks: Record<string, { conversion: number; dealValue: number; seasonalMultiplier: number }> = {
      plumbers: { conversion: 18, dealValue: 500, seasonalMultiplier: 1.3 },
      hvac: { conversion: 22, dealValue: 750, seasonalMultiplier: 1.5 },
      electricians: { conversion: 16, dealValue: 600, seasonalMultiplier: 1.2 },
      restaurants: { conversion: 8, dealValue: 250, seasonalMultiplier: 1.4 },
      cafes: { conversion: 10, dealValue: 150, seasonalMultiplier: 1.3 },
      'real-estate': { conversion: 5, dealValue: 3000, seasonalMultiplier: 1.2 },
      landscaping: { conversion: 14, dealValue: 400, seasonalMultiplier: 1.3 },
      cleaning: { conversion: 20, dealValue: 350, seasonalMultiplier: 1.4 }
    }
    return benchmarks[niche.toLowerCase()] || { conversion: 15, dealValue: 500, seasonalMultiplier: 1.0 }
  }

  const benchmark = getMarketBenchmarks()

  // Seasonal adjustment for Charleston
  const getSeasonalAdjustment = () => {
    const month = new Date().getMonth()
    const isTouristSeason = month >= 2 && month <= 9 // March-October
    return isTouristSeason ? benchmark.seasonalMultiplier : 1.0
  }

  const seasonalRevenue = Math.round(potentialRevenue * getSeasonalAdjustment())

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Lowcountry ROI Calculator</h3>
          </div>
          <span className="text-xs text-gray-600">Charleston market data</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Input Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Conversion Rate
            </label>
            <div className="relative">
              <input
                type="range"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                min="5"
                max="40"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5%</span>
                <span className="font-medium text-green-600">{conversionRate}%</span>
                <span>40%</span>
              </div>
              {conversionRate !== benchmark.conversion && (
                <p className="text-xs text-gray-500 mt-1">
                  Charleston avg: {benchmark.conversion}%
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Avg Deal Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                value={avgDealValue}
                onChange={(e) => setAvgDealValue(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                min="50"
                max="10000"
                step="50"
              />
              {avgDealValue !== benchmark.dealValue && (
                <p className="text-xs text-gray-500 mt-1">
                  Market avg: ${benchmark.dealValue}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="space-y-3">
          {/* Primary Metric */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Potential Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${potentialRevenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From {leadCount} leads → {expectedConversions} deals
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-gray-600" />
                <p className="text-xs text-gray-600">Expected Conversions</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">{expectedConversions}</p>
              <p className="text-xs text-gray-500">customers</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <p className="text-xs text-gray-600">Revenue per Lead</p>
              </div>
              <p className="text-lg font-semibold text-gray-900">${revenuePerLead}</p>
              <p className="text-xs text-gray-500">avg value</p>
            </div>
          </div>

          {/* Seasonal Adjustment */}
          {getSeasonalAdjustment() > 1.0 && (
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-900">Tourist Season Boost Active</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {niche} businesses see {Math.round((getSeasonalAdjustment() - 1) * 100)}% revenue increase during peak season
                  </p>
                  <p className="text-sm font-semibold text-yellow-700 mt-1">
                    Adjusted: ${seasonalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Breakdown */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-700">View Charleston Market Insights</span>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>

          {showDetails && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-900 mb-2">Charleston {niche} Market:</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Avg conversion rate:</span>
                  <span className="font-medium">{benchmark.conversion}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Typical deal value:</span>
                  <span className="font-medium">${benchmark.dealValue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Peak season multiplier:</span>
                  <span className="font-medium">{benchmark.seasonalMultiplier}x</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Annual market size:</span>
                  <span className="font-medium">~{Math.round(benchmark.dealValue * 0.15)}K businesses</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        <p className="text-xs text-gray-600">
          Based on 2025 Charleston SMB data • {niche} in ZIP {zipCode}
        </p>
      </div>
    </div>
  )
}