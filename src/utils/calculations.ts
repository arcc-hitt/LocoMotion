import type { RoutePoint, VehicleMetadata } from '../types'

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Calculate total distance of a route
 * @param route Array of route points
 * @returns Total distance in meters
 */
export function calculateTotalDistance(route: RoutePoint[]): number {
  if (route.length < 2) return 0

  let totalDistance = 0
  for (let i = 1; i < route.length; i++) {
    totalDistance += calculateDistance(
      route[i - 1].latitude,
      route[i - 1].longitude,
      route[i].latitude,
      route[i].longitude
    )
  }
  return totalDistance
}

/**
 * Calculate current speed based on time difference and distance
 * @param currentPoint Current position
 * @param previousPoint Previous position
 * @returns Speed in km/h
 */
export function calculateSpeed(
  currentPoint: RoutePoint,
  previousPoint: RoutePoint
): number {
  const distance = calculateDistance(
    previousPoint.latitude,
    previousPoint.longitude,
    currentPoint.latitude,
    currentPoint.longitude
  )

  const timeDiff =
    new Date(currentPoint.timestamp).getTime() -
    new Date(previousPoint.timestamp).getTime()
  const timeInHours = timeDiff / (1000 * 60 * 60)

  return timeInHours > 0 ? distance / 1000 / timeInHours : 0
}

/**
 * Calculate elapsed time from start
 * @param startTime Start timestamp
 * @param currentTime Current timestamp
 * @returns Elapsed time in seconds
 */
export function calculateElapsedTime(
  startTime: string,
  currentTime: string
): number {
  return (
    (new Date(currentTime).getTime() - new Date(startTime).getTime()) / 1000
  )
}

/**
 * Calculate distance traveled up to current point
 * @param route Full route array
 * @param currentIndex Current position index
 * @returns Distance traveled in meters
 */
export function calculateDistanceTraveled(
  route: RoutePoint[],
  currentIndex: number
): number {
  if (currentIndex < 1) return 0

  let distanceTraveled = 0
  for (let i = 1; i <= currentIndex; i++) {
    distanceTraveled += calculateDistance(
      route[i - 1].latitude,
      route[i - 1].longitude,
      route[i].latitude,
      route[i].longitude
    )
  }
  return distanceTraveled
}

/**
 * Calculate vehicle metadata for current position
 * @param route Full route array
 * @param currentIndex Current position index
 * @returns Vehicle metadata object
 */
export function calculateVehicleMetadata(
  route: RoutePoint[],
  currentIndex: number
): VehicleMetadata {
  if (route.length === 0 || currentIndex < 0) {
    return {
      currentSpeed: 0,
      elapsedTime: 0,
      distanceTraveled: 0,
      totalDistance: 0,
      progress: 0,
    }
  }

  const totalDistance = calculateTotalDistance(route)
  const distanceTraveled = calculateDistanceTraveled(route, currentIndex)
  const elapsedTime = calculateElapsedTime(
    route[0].timestamp,
    route[currentIndex].timestamp
  )

  const currentSpeed =
    currentIndex > 0
      ? calculateSpeed(route[currentIndex], route[currentIndex - 1])
      : 0

  const progress = totalDistance > 0 ? (distanceTraveled / totalDistance) * 100 : 0

  return {
    currentSpeed,
    elapsedTime,
    distanceTraveled,
    totalDistance,
    progress,
  }
}

/**
 * Format time in seconds to MM:SS format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

/**
 * Format distance in meters to readable format
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(2)}km`
} 