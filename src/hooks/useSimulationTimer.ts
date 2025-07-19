import { useEffect, useRef } from 'react'

// Constants
const SIMULATION_CONFIG = {
  UPDATE_INTERVAL: 1000, // 1 second
} as const

/**
 * Custom hook for managing simulation timer
 * @param playing - Whether the simulation is playing
 * @param currentIdx - Current position index
 * @param pointsLength - Total number of route points
 * @param onUpdate - Callback function when timer updates
 * @returns Timer reference
 */
export const useSimulationTimer = (
  playing: boolean,
  currentIdx: number,
  pointsLength: number,
  onUpdate: (newIndex: number) => void
) => {
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (playing && currentIdx < pointsLength - 1) {
      timerRef.current = window.setTimeout(() => {
        onUpdate(currentIdx + 1)
      }, SIMULATION_CONFIG.UPDATE_INTERVAL)
    }

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [playing, currentIdx, pointsLength, onUpdate])

  return timerRef
} 