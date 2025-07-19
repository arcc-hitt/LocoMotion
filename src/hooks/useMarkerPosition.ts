import { useEffect } from 'react'
import type { RefObject } from 'react'
import type { Marker } from 'leaflet'
import type { LatLngExpression } from 'leaflet'

/**
 * Custom hook for updating marker position
 * @param markerRef - Reference to the Leaflet marker
 * @param position - The new position coordinates
 */
export const useMarkerPosition = (
  markerRef: RefObject<Marker | null>,
  position: LatLngExpression | null
) => {
  useEffect(() => {
    if (position && markerRef.current) {
      markerRef.current.setLatLng(position)
    }
  }, [position, markerRef])
} 