import type { FC } from 'react'
import { FaPlay, FaPause, FaRedo, FaMapMarkerAlt, FaClock, FaTachometerAlt, FaRoute } from 'react-icons/fa'
import type { VehicleMetadata } from '../types'
import { formatTime, formatDistance } from '../utils/calculations'
import Card from './Card'

interface Props {
  playing: boolean
  onPlayPause: () => void
  onReset: () => void
  currentPoint?: {
    latitude: number
    longitude: number
    timestamp: string
  }
  metadata: VehicleMetadata
}

const Controls: FC<Props> = ({
  playing,
  onPlayPause,
  onReset,
  currentPoint,
  metadata
}) => (
  <div className="bg-white border-t border-gray-200 shadow-lg">
    {/* Progress Bar */}
    <div className="w-full bg-gray-200 h-2">
      <div 
        className="bg-blue-600 h-2 transition-all duration-300 ease-out"
        style={{ width: `${metadata.progress}%` }}
      />
    </div>
    
    <div className="p-4">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            {playing ? (
              <>
                <FaPause className="text-sm" />
                <span className="font-medium">Pause</span>
              </>
            ) : (
              <>
                <FaPlay className="text-sm" />
                <span className="font-medium">Play</span>
              </>
            )}
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <FaRedo className="text-sm" />
            <span className="font-medium">Reset</span>
          </button>
        </div>

        {/* Progress Info */}
        <div className="text-center sm:text-right">
          <div className="text-2xl font-bold text-gray-800">
            {metadata.progress.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            {formatDistance(metadata.distanceTraveled)} / {formatDistance(metadata.totalDistance)}
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Coordinates" icon={<FaMapMarkerAlt className="text-blue-600" />}>
          <div className="text-sm font-mono text-gray-800">
            {currentPoint
              ? `${currentPoint.latitude.toFixed(6)}, ${currentPoint.longitude.toFixed(6)}`
              : '--'}
          </div>
        </Card>
        <Card title="Elapsed Time" icon={<FaClock className="text-green-600" />}>
          <div className="text-lg font-bold text-gray-800">
            {formatTime(metadata.elapsedTime)}
          </div>
        </Card>
        <Card title="Current Speed" icon={<FaTachometerAlt className="text-red-600" />}>
          <div className="text-lg font-bold text-gray-800">
            {metadata.currentSpeed.toFixed(1)} km/h
          </div>
        </Card>
        <Card title="Distance" icon={<FaRoute className="text-purple-600" />}>
          <div className="text-lg font-bold text-gray-800">
            {formatDistance(metadata.distanceTraveled)}
          </div>
        </Card>
      </div>

      {/* Current Time Display */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Current Time: {currentPoint ? new Date(currentPoint.timestamp).toLocaleTimeString() : '--'}
        </div>
      </div>
    </div>
  </div>
)

export default Controls
