import { useEffect, useState, useRef } from 'react'
import MapView from './components/MapView'
import Controls from './components/Controls'
import type { RoutePoint, VehicleMetadata } from './types'
import { calculateVehicleMetadata } from './utils/calculations'
import routeData from './dummy-path.json'

const App = () => {
  const [points, setPoints] = useState<RoutePoint[]>([])
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<VehicleMetadata>({
    currentSpeed: 0,
    elapsedTime: 0,
    distanceTraveled: 0,
    totalDistance: 0,
    progress: 0,
  })
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Load dummy data
    setPoints(routeData)
  }, [])

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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LocoMotion</h1>
            <p className="text-sm text-gray-600">Real-time Vehicle Tracking Simulation</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Vehicle ID: VH-001</div>
            <div className="text-sm text-gray-500">Status: {playing ? 'Moving' : 'Stopped'}</div>
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
