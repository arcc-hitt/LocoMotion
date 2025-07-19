import { useCallback } from 'react'
import type { RoutePoint } from '../types'
import { getRouteCoordinates, getMultiPointRoute } from '../utils/roadApi'

// Constants
const ROUTE_CONFIG = {
  NAGPUR_START: [79.0882, 21.1458] as [number, number],
  NAGPUR_END: [79.0982, 21.1558] as [number, number],
  NAGPUR_WAYPOINTS: [
    [79.0882, 21.1458], // Start - Nagpur center
    [79.0922, 21.1498], // Waypoint 1
    [79.0962, 21.1538], // Waypoint 2
    [79.0982, 21.1558], // End
  ] as [number, number][],
} as const

const SIMULATION_CONFIG = {
  DEFAULT_ROUTE_SEGMENTS: 20,
  FALLBACK_TIME_INTERVAL: 3000, // 3 seconds
} as const

/**
 * Custom hook for route loading operations
 * @param setPoints - Function to set route points
 * @param setLoading - Function to set loading state
 * @param setError - Function to set error state
 * @returns Route loading functions
 */
export const useRouteLoader = (
  setPoints: (points: RoutePoint[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
  const generateSimpleRoute = useCallback((): RoutePoint[] => {
    const points: RoutePoint[] = []
    const baseLat = ROUTE_CONFIG.NAGPUR_START[1]
    const baseLng = ROUTE_CONFIG.NAGPUR_START[0]
    
    for (let i = 0; i <= SIMULATION_CONFIG.DEFAULT_ROUTE_SEGMENTS; i++) {
      const timestamp = new Date(Date.now() + (i * SIMULATION_CONFIG.FALLBACK_TIME_INTERVAL)).toISOString()
      points.push({
        latitude: baseLat + (i * 0.0001),
        longitude: baseLng + (i * 0.0001),
        timestamp
      })
    }
    
    return points
  }, [])

  const loadRoute = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const route = await getRouteCoordinates(
        ROUTE_CONFIG.NAGPUR_START,
        ROUTE_CONFIG.NAGPUR_END,
        'driving-car'
      )
      setPoints(route)
    } catch (error) {
      console.error('Failed to load route:', error)
      setError('Failed to load route from API')
      setPoints(generateSimpleRoute())
    }
  }, [setPoints, setLoading, setError, generateSimpleRoute])

  const loadMultiPointRoute = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const route = await getMultiPointRoute(ROUTE_CONFIG.NAGPUR_WAYPOINTS, 'driving-car')
      setPoints(route)
    } catch (error) {
      console.error('Failed to load multi-point route:', error)
      setError('Failed to load multi-point route from API')
    }
  }, [setPoints, setLoading, setError])

  return {
    loadRoute,
    loadMultiPointRoute,
    generateSimpleRoute,
  }
} 