import { useMemo } from 'react'
import L from 'leaflet'
import { FaCarSide } from "react-icons/fa6"
import ReactDOMServer from 'react-dom/server'

// Constants
const VEHICLE_ICON_CONFIG = {
  SIZE: 32,
  CLASS_NAME: 'vehicle-marker',
} as const

/**
 * Custom hook for creating vehicle icon with memoization
 * @returns Leaflet div icon for vehicle marker
 */
export const useVehicleIcon = () => {
  return useMemo(() => {
    const carHtml = ReactDOMServer.renderToString(
      <div className="relative">
        <FaCarSide 
          size={VEHICLE_ICON_CONFIG.SIZE} 
          className="text-blue-600 drop-shadow-lg" 
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </div>
    )
    
    return L.divIcon({
      html: carHtml,
      className: VEHICLE_ICON_CONFIG.CLASS_NAME,
      iconSize: [VEHICLE_ICON_CONFIG.SIZE, VEHICLE_ICON_CONFIG.SIZE],
      iconAnchor: [VEHICLE_ICON_CONFIG.SIZE / 2, VEHICLE_ICON_CONFIG.SIZE / 2],
    })
  }, [])
} 