import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'
import L, { type LatLngExpression } from 'leaflet'
import type { RoutePoint } from '../types'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { FaCarSide } from "react-icons/fa6"
import ReactDOMServer from 'react-dom/server'

interface Props {
  route: RoutePoint[]
  currentIndex: number
}

const MapView = ({ route, currentIndex }: Props) => {
  const markerRef = useRef<L.Marker | null>(null)
  const polylineRef = useRef<L.Polyline | null>(null)

  const currentPos: LatLngExpression | null =
    route[currentIndex]
      ? [route[currentIndex].latitude, route[currentIndex].longitude]
      : null

  // Center map on current position with smooth animation
  const CenterUpdater = () => {
    const map = useMap()
    useEffect(() => {
      if (currentPos) map.setView(currentPos, map.getZoom(), { animate: true })
    }, [currentPos, map])
    return null
  }

  // Smooth marker animation
  const MarkerUpdater = () => {
    useEffect(() => {
      if (currentPos && markerRef.current) {
        markerRef.current.setLatLng(currentPos)
      }
    }, [currentPos])
    return null
  }

  // Create custom vehicle icon
  const carHtml = ReactDOMServer.renderToString(
    <div className="relative">
      <FaCarSide size={32} className="text-blue-600 drop-shadow-lg" />
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  )
  
  const vehicleIcon = L.divIcon({
    html: carHtml,
    className: 'vehicle-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })

  return (
    <MapContainer
      center={
        currentPos ?? [route[0]?.latitude || 0, route[0]?.longitude || 0]
      }
      zoom={15}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ 
        background: '#f8fafc',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Route polyline */}
      {route.length > 0 && (
        <Polyline
          ref={polylineRef}
          positions={route
            .slice(0, currentIndex + 1)
            .map((pt) => [pt.latitude, pt.longitude] as LatLngExpression)}
          color="#3b82f6"
          weight={4}
          opacity={0.8}
          smoothFactor={1}
        />
      )}
      
      {/* Vehicle marker */}
      {currentPos && (
        <Marker 
          ref={markerRef}
          key={currentIndex} 
          position={currentPos} 
          icon={vehicleIcon}
          zIndexOffset={1000}
        />
      )}
      
      <CenterUpdater />
      <MarkerUpdater />
    </MapContainer>
  )
}

export default MapView
