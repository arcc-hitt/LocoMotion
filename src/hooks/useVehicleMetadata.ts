import { useMemo } from 'react'
import type { RoutePoint, VehicleMetadata } from '../types'
import { calculateVehicleMetadata } from '../utils/calculations'

/**
 * Custom hook for calculating vehicle metadata with memoization
 * @param points - Array of route points
 * @param currentIdx - Current position index
 * @returns Vehicle metadata object
 */
export const useVehicleMetadata = (points: RoutePoint[], currentIdx: number): VehicleMetadata => {
  return useMemo(() => {
    if (points.length === 0) {
      return {
        currentSpeed: 0,
        elapsedTime: 0,
        distanceTraveled: 0,
        totalDistance: 0,
        progress: 0,
      }
    }
    return calculateVehicleMetadata(points, currentIdx)
  }, [points, currentIdx])
} 