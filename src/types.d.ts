export interface RoutePoint {
  latitude: number
  longitude: number
  timestamp: string
}

export interface VehicleMetadata {
  currentSpeed: number // km/h
  elapsedTime: number // seconds
  distanceTraveled: number // meters
  totalDistance: number // meters
  progress: number // percentage (0-100)
}
  