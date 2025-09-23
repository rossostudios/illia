'use client'

import { Loader2, MapPin, Maximize, Navigation, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
// Import map components - React Leaflet handles client-side rendering automatically
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Button } from '@/components/ui/Button'

export interface ProviderLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  services: string[]
  rating: number
  price: number
  verified: boolean
  specialties: string[]
}

interface MapViewProps {
  providers: ProviderLocation[]
  center?: [number, number]
  zoom?: number
  radius?: number
  radiusCenter?: [number, number]
  onProviderClick?: (provider: ProviderLocation) => void
  onLocationChange?: (location: [number, number], zoom: number) => void
  className?: string
  showControls?: boolean
}

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onCenter: () => void
  onFullscreen: () => void
}

// Separate component for map controls to avoid SSR issues
function MapControls({ onZoomIn, onZoomOut, onCenter, onFullscreen }: MapControlsProps) {
  const map = useMap()

  const handleZoomIn = useCallback(() => {
    map.zoomIn()
    onZoomIn()
  }, [map, onZoomIn])

  const handleZoomOut = useCallback(() => {
    map.zoomOut()
    onZoomOut()
  }, [map, onZoomOut])

  const handleCenter = useCallback(() => {
    map.locate({ setView: true, maxZoom: 16 })
    onCenter()
  }, [map, onCenter])

  const handleFullscreen = useCallback(() => {
    if (map.getContainer().requestFullscreen) {
      map.getContainer().requestFullscreen()
    }
    onFullscreen()
  }, [map, onFullscreen])

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        onClick={handleZoomIn}
        size="sm"
        variant="secondary"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
        title="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleZoomOut}
        size="sm"
        variant="secondary"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
        title="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleCenter}
        size="sm"
        variant="secondary"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
        title="Find my location"
      >
        <Navigation className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleFullscreen}
        size="sm"
        variant="secondary"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
        title="Fullscreen"
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Provider marker component
function ProviderMarker({
  provider,
  onClick,
}: {
  provider: ProviderLocation
  onClick?: (provider: ProviderLocation) => void
}) {
  const getMarkerColor = (provider: ProviderLocation) => {
    if (provider.verified) return '#059669' // emerald-600
    if (provider.rating >= 4.5) return '#f59e0b' // amber-500
    if (provider.rating >= 4.0) return '#3b82f6' // blue-500
    return '#6b7280' // gray-500
  }

  // Create custom icon using Leaflet (only on client side)
  const createCustomIcon = useCallback((color: string) => {
    if (typeof window === 'undefined') return null

    // Use the global L variable from react-leaflet
    const L = (window as any).L
    if (!L) return null

    return new L.DivIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50% 50% 50% 0;
          border: 2px solid white;
          transform: rotate(-45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    })
  }, [])

  const icon = createCustomIcon(getMarkerColor(provider))

  if (!icon) {
    return null // Don't render marker if icon creation fails
  }

  return (
    <Marker
      position={[provider.latitude, provider.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onClick?.(provider),
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
            {provider.verified && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                Verified
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{provider.address}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>⭐ {provider.rating}</span>
              <span className="font-medium text-teal-600">${provider.price}/mo</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {provider.services.slice(0, 2).map((service) => (
                <span
                  key={service}
                  className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded"
                >
                  {service}
                </span>
              ))}
              {provider.services.length > 2 && (
                <span className="text-xs text-gray-500">+{provider.services.length - 2} more</span>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

// Map event handler component
function MapEventHandler({
  onLocationChange,
}: {
  onLocationChange?: (location: [number, number], zoom: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    if (!onLocationChange) return

    const handleMove = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      onLocationChange([center.lat, center.lng], zoom)
    }

    map.on('moveend', handleMove)
    return () => {
      map.off('moveend', handleMove)
    }
  }, [map, onLocationChange])

  return null
}

export function MapView({
  providers,
  center = [-27.5954, -48.548], // Default to Florianópolis
  zoom = 12,
  radius,
  radiusCenter,
  onProviderClick,
  onLocationChange,
  className = '',
  showControls = true,
}: MapViewProps) {
  const [isClient, setIsClient] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-2 animate-spin" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Provider markers */}
        {providers.map((provider) => (
          <ProviderMarker key={provider.id} provider={provider} onClick={onProviderClick} />
        ))}

        {/* Search radius circle */}
        {radius && radiusCenter && (
          <Circle
            center={radiusCenter}
            radius={radius * 1000} // Convert km to meters
            pathOptions={{
              color: '#059669',
              fillColor: '#059669',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

        {/* Map event handler */}
        {onLocationChange && <MapEventHandler onLocationChange={onLocationChange} />}

        {/* Map controls */}
        {showControls && (
          <MapControls
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onCenter={() => {}}
            onFullscreen={() => {}}
          />
        )}
      </MapContainer>

      {/* Map overlay info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="h-4 w-4 text-teal-600" />
          <span>{providers.length} providers shown</span>
        </div>
        {radius && <div className="text-xs text-gray-600 mt-1">Search radius: {radius} km</div>}
      </div>
    </div>
  )
}
