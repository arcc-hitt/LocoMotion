import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

/**
 * Custom hook for updating map center with smooth animation
 * @param center - The center coordinates to move to
 * @param enabled - Whether the center update is enabled
 * @returns null (this hook doesn't return anything)
 */
export const useMapCenter = (center: LatLngExpression | null, enabled: boolean = true) => {
  const map = useMap()
  
  useEffect(() => {
    if (enabled && center) {
      map.setView(center, map.getZoom(), { animate: true })
    }
  }, [center, map, enabled])
  
  return null
} 