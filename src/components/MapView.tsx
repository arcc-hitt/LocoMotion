import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet'
import L, { type LatLngExpression } from 'leaflet'
import type { RoutePoint } from '../types'
import 'leaflet/dist/leaflet.css'
import { useRef, useMemo } from 'react'
import { useMapCenter, useMarkerPosition, useVehicleIcon } from '../hooks'

// Constants
const MAP_CONFIG = {
  ZOOM: 15,
  POLYLINE_COLOR: '#3b82f6',
  POLYLINE_WEIGHT: 4,
  POLYLINE_OPACITY: 0.8,
  POLYLINE_SMOOTH_FACTOR: 1,
  VEHICLE_ICON_SIZE: 32,
  VEHICLE_Z_INDEX: 1000,
} as const

const TILE_LAYER_CONFIG = {
  URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const

interface MapViewProps {
  route: RoutePoint[]
  currentIndex: number
  centerOnVehicle?: boolean
  showRoute?: boolean
  showVehicle?: boolean
}

// Map center updater component
const MapCenterUpdater: React.FC<{ center: LatLngExpression | null; enabled: boolean }> = ({ 
  center, 
  enabled 
}) => {
  return useMapCenter(center, enabled)
}

// Marker updater component
const MarkerUpdater: React.FC<{ 
  markerRef: React.RefObject<L.Marker | null>
  position: LatLngExpression | null 
}> = ({ markerRef, position }) => {
  useMarkerPosition(markerRef, position)
  return null
}

const MapView: React.FC<MapViewProps> = ({ 
  route, 
  currentIndex, 
  centerOnVehicle = true,
  showRoute = true,
  showVehicle = true
}) => {
  const markerRef = useRef<L.Marker | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)
  const vehicleIcon = useVehicleIcon()

  // Memoize current position
  const currentPos = useMemo((): LatLngExpression | null => {
    const currentPoint = route[currentIndex]
    return currentPoint 
      ? [currentPoint.latitude, currentPoint.longitude]
      : null
  }, [route, currentIndex])

  // Memoize map center
  const mapCenter = useMemo((): LatLngExpression => {
    return currentPos ?? [route[0]?.latitude || 0, route[0]?.longitude || 0]
  }, [currentPos, route])

  // Memoize polyline positions
  const polylinePositions = useMemo((): LatLngExpression[] => {
    if (!showRoute || route.length === 0) return []
    
    return route
      .slice(0, currentIndex + 1)
      .map((pt) => [pt.latitude, pt.longitude] as LatLngExpression)
  }, [route, currentIndex, showRoute])

  // Memoize route key for polyline re-rendering
  const routeKey = useMemo(() => `${currentIndex}-${route.length}`, [currentIndex, route.length])

  return (
    <MapContainer
      center={mapCenter}
      zoom={MAP_CONFIG.ZOOM}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ 
        background: '#f8fafc',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <TileLayer 
        url={TILE_LAYER_CONFIG.URL}
        attribution={TILE_LAYER_CONFIG.ATTRIBUTION}
      />
      
      {/* Route polyline */}
      {showRoute && polylinePositions.length > 0 && (
        <Polyline
          ref={polylineRef}
          key={routeKey}
          positions={polylinePositions}
          color={MAP_CONFIG.POLYLINE_COLOR}
          weight={MAP_CONFIG.POLYLINE_WEIGHT}
          opacity={MAP_CONFIG.POLYLINE_OPACITY}
          smoothFactor={MAP_CONFIG.POLYLINE_SMOOTH_FACTOR}
        />
      )}
      
      {/* Vehicle marker */}
      {showVehicle && currentPos && (
        <Marker 
          ref={markerRef}
          key={`vehicle-${currentIndex}`}
          position={currentPos} 
          icon={vehicleIcon}
          zIndexOffset={MAP_CONFIG.VEHICLE_Z_INDEX}
        />
      )}
      
      <MapCenterUpdater center={currentPos} enabled={centerOnVehicle} />
      <MarkerUpdater markerRef={markerRef} position={currentPos} />
    </MapContainer>
  )
}

export default MapView
