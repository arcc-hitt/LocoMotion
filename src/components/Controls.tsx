import type { FC, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { FaPlay, FaPause, FaRedo, FaMapMarkerAlt, FaClock, FaTachometerAlt, FaRoute } from 'react-icons/fa'
import type { VehicleMetadata } from '../types'
import { formatTime, formatDistance } from '../utils/calculations'
import Card from './Card'

// Constants
const BUTTON_STYLES = {
  PRIMARY: 'flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer',
  SECONDARY: 'flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer',
} as const

const PROGRESS_BAR_STYLES = {
  CONTAINER: 'w-full bg-gray-200 h-2',
  FILL: 'bg-blue-600 h-2 transition-all duration-300 ease-out',
} as const

interface ControlsProps {
  playing: boolean
  onPlayPause: () => void
  onReset: () => void
  currentPoint?: {
    latitude: number
    longitude: number
    timestamp: string
  }
  metadata: VehicleMetadata
  showProgressBar?: boolean
  showMetadata?: boolean
  showCurrentTime?: boolean
}

interface ControlButtonProps {
  onClick: () => void
  icon: ReactNode
  label: string
  variant?: 'primary' | 'secondary'
}

interface MetadataCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
}

// Memoized control button component
const ControlButton: FC<ControlButtonProps> = memo(({ 
  onClick, 
  icon, 
  label, 
  variant = 'primary' 
}) => (
  <button
    onClick={onClick}
    className={variant === 'primary' ? BUTTON_STYLES.PRIMARY : BUTTON_STYLES.SECONDARY}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
))

// Memoized metadata card component
const MetadataCard: FC<MetadataCardProps> = memo(({ title, icon, children }) => (
  <Card title={title} icon={icon}>
    {children}
  </Card>
))

// Memoized progress bar component
const ProgressBar: FC<{ progress: number }> = memo(({ progress }) => (
  <div className={PROGRESS_BAR_STYLES.CONTAINER}>
    <div 
      className={PROGRESS_BAR_STYLES.FILL}
      style={{ width: `${progress}%` }}
    />
  </div>
))

// Memoized progress info component
const ProgressInfo: FC<{ metadata: VehicleMetadata }> = memo(({ metadata }) => (
  <div className="text-center sm:text-right">
    <div className="text-2xl font-bold text-gray-800">
      {metadata.progress.toFixed(1)}%
    </div>
    <div className="text-sm text-gray-600">
      {formatDistance(metadata.distanceTraveled)} / {formatDistance(metadata.totalDistance)}
    </div>
  </div>
))

// Memoized current time display component
const CurrentTimeDisplay: FC<{ currentPoint?: { timestamp: string } }> = memo(({ currentPoint }) => (
  <div className="mt-4 text-center">
    <div className="text-sm text-gray-600">
      Current Time: {currentPoint ? new Date(currentPoint.timestamp).toLocaleTimeString() : '--'}
    </div>
  </div>
))

const Controls: FC<ControlsProps> = memo(({
  playing,
  onPlayPause,
  onReset,
  currentPoint,
  metadata,
  showProgressBar = true,
  showMetadata = true,
  showCurrentTime = true
}) => {
  // Memoize button icons
  const playPauseIcon = useMemo(() => (
    playing ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />
  ), [playing])

  const resetIcon = useMemo(() => <FaRedo className="text-sm" />, [])

  // Memoize metadata cards data
  const metadataCards = useMemo(() => [
    {
      title: 'Coordinates',
      icon: <FaMapMarkerAlt className="text-blue-600" />,
      content: (
        <div className="text-sm font-mono text-gray-800">
          {currentPoint
            ? `${currentPoint.latitude.toFixed(6)}, ${currentPoint.longitude.toFixed(6)}`
            : '--'}
        </div>
      )
    },
    {
      title: 'Elapsed Time',
      icon: <FaClock className="text-green-600" />,
      content: (
        <div className="text-lg font-bold text-gray-800">
          {formatTime(metadata.elapsedTime)}
        </div>
      )
    },
    {
      title: 'Current Speed',
      icon: <FaTachometerAlt className="text-red-600" />,
      content: (
        <div className="text-lg font-bold text-gray-800">
          {metadata.currentSpeed.toFixed(1)} km/h
        </div>
      )
    },
    {
      title: 'Distance',
      icon: <FaRoute className="text-purple-600" />,
      content: (
        <div className="text-lg font-bold text-gray-800">
          {formatDistance(metadata.distanceTraveled)}
        </div>
      )
    }
  ], [currentPoint, metadata])

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      {/* Progress Bar */}
      {showProgressBar && <ProgressBar progress={metadata.progress} />}
      
      <div className="p-4">
        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Control Buttons */}
          <div className="flex items-center gap-3">
            <ControlButton
              onClick={onPlayPause}
              icon={playPauseIcon}
              label={playing ? 'Pause' : 'Play'}
              variant="primary"
            />
            
            <ControlButton
              onClick={onReset}
              icon={resetIcon}
              label="Reset"
              variant="secondary"
            />
          </div>

          {/* Progress Info */}
          <ProgressInfo metadata={metadata} />
        </div>

        {/* Metadata Grid */}
        {showMetadata && (
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metadataCards.map((card, index) => (
              <MetadataCard
                key={`${card.title}-${index}`}
                title={card.title}
                icon={card.icon}
              >
                {card.content}
              </MetadataCard>
            ))}
          </div>
        )}

        {/* Current Time Display */}
        {showCurrentTime && <CurrentTimeDisplay currentPoint={currentPoint} />}
      </div>
    </div>
  )
})

Controls.displayName = 'Controls'

export default Controls
