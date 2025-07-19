import { useEffect, useState, useRef } from 'react'
import MapView from './components/MapView'
import Controls from './components/Controls'
import type { RoutePoint, VehicleMetadata } from './types'
import { calculateVehicleMetadata } from './utils/calculations'
import { getRouteCoordinates, getMultiPointRoute } from './utils/roadApi'

const App = () => {
  const [points, setPoints] = useState<RoutePoint[]>([])
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [metadata, setMetadata] = useState<VehicleMetadata>({
    currentSpeed: 0,
    elapsedTime: 0,
    distanceTraveled: 0,
    totalDistance: 0,
    progress: 0,
  })
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Load route from road API
    loadRoute()
  }, [])

  const loadRoute = async () => {
    setLoading(true)
    try {
      // Example route in Nagpur
      const startPoint: [number, number] = [79.0882, 21.1458] // [lng, lat]
      const endPoint: [number, number] = [79.0982, 21.1558] // [lng, lat]
      
      const route = await getRouteCoordinates(startPoint, endPoint, 'driving-car')
      setPoints(route)
    } catch (error) {
      console.error('Failed to load route:', error)
      // Fallback to a simple route
      setPoints(generateSimpleRoute())
    } finally {
      setLoading(false)
    }
  }

  const generateSimpleRoute = (): RoutePoint[] => {
    const points: RoutePoint[] = []
    const baseLat = 21.1458 // Nagpur latitude
    const baseLng = 79.0882 // Nagpur longitude
    
    for (let i = 0; i <= 20; i++) {
      const timestamp = new Date(Date.now() + (i * 3000)).toISOString()
      points.push({
        latitude: baseLat + (i * 0.0001),
        longitude: baseLng + (i * 0.0001),
        timestamp
      })
    }
    
    return points
  }

  const loadMultiPointRoute = async () => {
    setLoading(true)
    try {
      // Multi-point route example in Nagpur
      const waypoints: [number, number][] = [
        [79.0882, 21.1458], // Start - Nagpur center
        [79.0922, 21.1498], // Waypoint 1
        [79.0962, 21.1538], // Waypoint 2
        [79.0982, 21.1558], // End
      ]
      
      const route = await getMultiPointRoute(waypoints, 'driving-car')
      setPoints(route)
      setCurrentIdx(0)
      setPlaying(false)
    } catch (error) {
      console.error('Failed to load multi-point route:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Update metadata when current index changes
    if (points.length > 0) {
      const newMetadata = calculateVehicleMetadata(points, currentIdx)
      setMetadata(newMetadata)
    }
  }, [points, currentIdx])

  useEffect(() => {
    // Play/pause logic with smooth timing
    if (playing && currentIdx < points.length - 1) {
      timerRef.current = window.setTimeout(() => {
        setCurrentIdx((i) => i + 1)
      }, 1000) // Update every second for smooth movement
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [playing, currentIdx, points.length])

  const handlePlayPause = () => {
    setPlaying((p) => !p)
  }

  const handleReset = () => {
    setPlaying(false)
    setCurrentIdx(0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading route from road API...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LocoMotion</h1>
            <p className="text-sm text-gray-600">Real-time Vehicle Tracking Simulation</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Vehicle ID: VH-001</div>
              <div className="text-sm text-gray-500">Status: {playing ? 'Moving' : 'Stopped'}</div>
            </div>
            {/* Route Options */}
            <div className="flex gap-2">
              <button
                onClick={loadRoute}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Simple Route
              </button>
              <button
                onClick={loadMultiPointRoute}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Multi-Point Route
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1">
        <MapView
          route={points}
          currentIndex={currentIdx}
        />
      </div>

      {/* Controls Panel */}
      <Controls
        playing={playing}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        currentPoint={points[currentIdx]}
        metadata={metadata}
      />
    </div>
  )
}

export default App
