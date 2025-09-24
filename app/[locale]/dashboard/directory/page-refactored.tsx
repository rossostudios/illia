'use client'

import { AnimatePresence } from 'framer-motion'
import { Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DirectoryFilters } from '@/components/directory/DirectoryFilters'
import { ProviderCard } from '@/components/directory/ProviderCard'
import { ProviderModal } from '@/components/directory/ProviderModal'
import { MapSearchView } from '@/components/MapSearchView'
import { MOCK_PROVIDERS, type Provider } from '@/data/mock-providers'

export default function DirectoryPage() {
  const router = useRouter()
  const [filters, setFilters] = useState({
    search: '',
    service: 'All Services',
    location: 'All Areas',
    city: 'medellin' as 'medellin' | 'florianopolis',
    rating: 'all',
    verified: false,
  })

  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'map'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Filter providers based on current filters
  const filteredProviders = useMemo(() => {
    return MOCK_PROVIDERS.filter((provider) => {
      // City filter
      if (provider.city !== filters.city) return false

      // Search filter
      if (
        filters.search &&
        !provider.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !provider.service.toLowerCase().includes(filters.search.toLowerCase()) &&
        !provider.bio.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Service filter
      if (
        filters.service !== 'All Services' &&
        !provider.service.toLowerCase().includes(filters.service.toLowerCase())
      ) {
        return false
      }

      // Location filter
      if (filters.location !== 'All Areas' && !provider.location.includes(filters.location)) {
        return false
      }

      // Rating filter
      if (filters.rating !== 'all') {
        const minRating = Number.parseFloat(filters.rating)
        if (provider.rating < minRating) return false
      }

      // Verified filter
      if (filters.verified && !provider.verified) return false

      return true
    })
  }, [filters])

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider)
    setShowModal(true)
  }

  const handleContact = (provider: Provider) => {
    toast.success(`Contacting ${provider.name}`)
    router.push('/en/dashboard/messages')
  }

  const handleSave = (provider: Provider) => {
    toast.success(`${provider.name} saved to favorites`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-gray-200 border-b bg-white px-4 py-6 sm:px-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center gap-2 font-bold text-3xl text-gray-900 dark:text-white">
                <Users className="h-8 w-8 text-teal-600" />
                Service Provider Directory
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Find trusted home service providers in{' '}
                {filters.city === 'medellin' ? 'Medellín' : 'Florianópolis'}
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-bold text-2xl text-gray-900 dark:text-white">
                {filteredProviders.length}
              </p>
              <p className="text-gray-600 text-sm dark:text-gray-400">Available Providers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DirectoryFilters
        filters={filters}
        onFiltersChange={setFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onViewModeChange={setViewMode}
        resultCount={filteredProviders.length}
        showFilters={showFilters}
        viewMode={viewMode}
      />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Results */}
        {filteredProviders.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 font-medium text-gray-900 text-lg dark:text-white">
              No providers found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : viewMode === 'map' ? (
          <MapSearchView
            center={
              filters.city === 'medellin'
                ? { lat: 6.2476, lng: -75.5658 }
                : { lat: -27.5954, lng: -48.548 }
            }
            results={filteredProviders.map((provider) => ({
              ...provider,
              coords: {
                lat: provider.city === 'medellin' ? 6.2476 : -27.5954,
                lng: provider.city === 'medellin' ? -75.5658 : -48.548,
              },
              type: 'provider',
            }))}
            zoom={12}
          />
        ) : viewMode === 'table' ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <table className="w-full">
              <thead className="border-gray-100 border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-900 text-xs uppercase tracking-wider dark:text-white">
                    Provider
                  </th>
                  <th className="hidden px-6 py-3 text-left font-medium text-gray-900 text-xs uppercase tracking-wider lg:table-cell dark:text-white">
                    Location
                  </th>
                  <th className="hidden px-6 py-3 text-left font-medium text-gray-900 text-xs uppercase tracking-wider sm:table-cell dark:text-white">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-900 text-xs uppercase tracking-wider dark:text-white">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      onClick={() => handleProviderClick(provider)}
                      provider={provider}
                      viewMode="table"
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  onClick={() => handleProviderClick(provider)}
                  provider={provider}
                  viewMode="grid"
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Provider Modal */}
      <ProviderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onContact={handleContact}
        onSave={handleSave}
        provider={selectedProvider}
      />
    </div>
  )
}
