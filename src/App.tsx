import { useEffect, useCallback } from 'react'
import MapView from './components/MapView'
import Controls from './components/Controls'
import { 
  useRouteManagement, 
  useSimulationTimer, 
  useVehicleMetadata, 
  useRouteLoader 
} from './hooks'

const App: React.FC = () => {
  const {
    points,
    currentIdx,
    playing,
    loading,
    error,
    setPoints,
    setLoading,
    setError,
    resetRoute,
    setPlaying,
    setCurrentIdx,
  } = useRouteManagement()

  const { loadRoute, loadMultiPointRoute } = useRouteLoader(setPoints, setLoading, setError)
  const metadata = useVehicleMetadata(points, currentIdx)
  useSimulationTimer(playing, currentIdx, points.length, setCurrentIdx)

  // Load initial route
  useEffect(() => {
    loadRoute()
  }, [loadRoute])

  // Event handlers
  const handlePlayPause = useCallback(() => {
    setPlaying(!playing)
  }, [playing, setPlaying])

  const handleReset = useCallback(() => {
    resetRoute()
  }, [resetRoute])

  const handleLoadRoute = useCallback(() => {
    loadRoute()
    resetRoute()
  }, [loadRoute, resetRoute])

  const handleLoadMultiPointRoute = useCallback(() => {
    loadMultiPointRoute()
    resetRoute()
  }, [loadMultiPointRoute, resetRoute])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading route from road API...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleLoadRoute}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Title Section */}
          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">LocoMotion</h1>
            <p className="text-xs sm:text-sm text-gray-600">Real-time Vehicle Tracking Simulation</p>
          </div>
          
          {/* Status and Controls Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            {/* Vehicle Status */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-gray-500">Vehicle ID: VH-001</div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Status: 
                  <span className={`ml-1 font-medium ${playing ? 'text-green-600' : 'text-red-600'}`}>
                    {playing ? 'Moving' : 'Stopped'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Route Options */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleLoadRoute}
                className="px-2 sm:px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 cursor-pointer transition-colors duration-200"
              >
                Simple Route
              </button>
              <button
                onClick={handleLoadMultiPointRoute}
                className="px-2 sm:px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer transition-colors duration-200"
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
          centerOnVehicle={true}
          showRoute={true}
          showVehicle={true}
        />
      </div>

      {/* Controls Panel */}
      <Controls
        playing={playing}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        currentPoint={points[currentIdx]}
        metadata={metadata}
        showProgressBar={true}
        showMetadata={true}
        showCurrentTime={true}
      />
    </div>
  )
}

export default App
