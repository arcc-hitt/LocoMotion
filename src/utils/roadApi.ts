import axios from 'axios'
import type { RoutePoint } from '../types'

// OpenRouteService API (free tier available)
const API_BASE_URL = 'https://api.openrouteservice.org/v2/directions'
const API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImQzMmEyMzkwYTM5NTQxZTE4ZDVjNjdjNzg0ZGI2YzczIiwiaCI6Im11cm11cjY0In0=' // Replace with your key

interface RouteRequest {
  coordinates: [number, number][]
  profile: 'driving-car' | 'foot-walking' | 'cycling-regular'
  format: 'geojson' | 'json'
}

interface RouteResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number][]
    }
    properties: {
      segments: Array<{
        distance: number
        duration: number
      }>
      summary: {
        distance: number
        duration: number
      }
    }
  }>
}

// Get route coordinates from OpenRouteService API
export async function getRouteCoordinates(
  startPoint: [number, number],
  endPoint: [number, number],
  profile: 'driving-car' | 'foot-walking' | 'cycling-regular' = 'driving-car'
): Promise<RoutePoint[]> {
  try {
    const request: RouteRequest = {
      coordinates: [startPoint, endPoint],
      profile,
      format: 'geojson'
    }

    const response = await axios.post<RouteResponse>(
      `${API_BASE_URL}/${profile}/geojson`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const coordinates = response.data.features[0].geometry.coordinates
    const segments = response.data.features[0].properties.segments
    const summary = response.data.features[0].properties.summary
    
    // Robust timestamp assignment
    let totalDuration = 0
    if (summary && summary.duration) {
      totalDuration = summary.duration // seconds
    } else if (segments && segments.length > 0) {
      totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0)
    } else {
      totalDuration = coordinates.length * 3 // fallback: 3s per point
    }
    
    const interval = coordinates.length > 1 ? totalDuration / (coordinates.length - 1) : 0
    const startTime = Date.now()
    
    const points: RoutePoint[] = coordinates.map((coord, idx) => ({
      latitude: coord[1],
      longitude: coord[0],
      timestamp: new Date(startTime + idx * interval * 1000).toISOString()
    }))
    
    return points
  } catch (error) {
    console.error('Error fetching route:', error)
    // Fallback to generated route if API fails
    return generateFallbackRoute(startPoint, endPoint)
  }
}

// Generate fallback route if API is unavailable
function generateFallbackRoute(
  startPoint: [number, number],
  endPoint: [number, number]
): RoutePoint[] {
  const points: RoutePoint[] = []
  const segments = 20
  
  for (let i = 0; i <= segments; i++) {
    const progress = i / segments
    const lat = startPoint[1] + (endPoint[1] - startPoint[1]) * progress
    const lng = startPoint[0] + (endPoint[0] - startPoint[0]) * progress
    const timestamp = new Date(Date.now() + (i * 3000)).toISOString()
    
    points.push({
      latitude: lat,
      longitude: lng,
      timestamp
    })
  }
  
  return points
}

// Get route between multiple waypoints
export async function getMultiPointRoute(
  waypoints: [number, number][],
  profile: 'driving-car' | 'foot-walking' | 'cycling-regular' = 'driving-car'
): Promise<RoutePoint[]> {
  try {
    const request: RouteRequest = {
      coordinates: waypoints,
      profile,
      format: 'geojson'
    }

    const response = await axios.post<RouteResponse>(
      `${API_BASE_URL}/${profile}/geojson`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const coordinates = response.data.features[0].geometry.coordinates
    const segments = response.data.features[0].properties.segments
    const summary = response.data.features[0].properties.summary
    
    // Robust timestamp assignment
    let totalDuration = 0
    if (summary && summary.duration) {
      totalDuration = summary.duration // seconds
    } else if (segments && segments.length > 0) {
      totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0)
    } else {
      totalDuration = coordinates.length * 3 // fallback: 3s per point
    }
    
    const interval = coordinates.length > 1 ? totalDuration / (coordinates.length - 1) : 0
    const startTime = Date.now()
    
    const points: RoutePoint[] = coordinates.map((coord, idx) => ({
      latitude: coord[1],
      longitude: coord[0],
      timestamp: new Date(startTime + idx * interval * 1000).toISOString()
    }))
    
    return points
  } catch (error) {
    console.error('Error fetching multi-point route:', error)
    return generateFallbackMultiPointRoute(waypoints)
  }
}

// Generate fallback route for multiple waypoints
function generateFallbackMultiPointRoute(waypoints: [number, number][]): RoutePoint[] {
  const points: RoutePoint[] = []
  let totalTime = 0
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const start = waypoints[i]
    const end = waypoints[i + 1]
    const segments = 10
    
    for (let j = 0; j <= segments; j++) {
      const progress = j / segments
      const lat = start[1] + (end[1] - start[1]) * progress
      const lng = start[0] + (end[0] - start[0]) * progress
      const timestamp = new Date(Date.now() + (totalTime * 1000)).toISOString()
      
      points.push({
        latitude: lat,
        longitude: lng,
        timestamp
      })
      
      totalTime += 3 // 3 seconds per segment
    }
  }
  
  return points
} 