import { useState, useCallback } from 'react'
import type { RoutePoint } from '../types'

interface AppState {
  points: RoutePoint[]
  currentIdx: number
  playing: boolean
  loading: boolean
  error: string | null
}

/**
 * Custom hook for managing route state and operations
 * @returns Route state and management functions
 */
export const useRouteManagement = () => {
  const [state, setState] = useState<AppState>({
    points: [],
    currentIdx: 0,
    playing: false,
    loading: true,
    error: null,
  })

  const setPoints = useCallback((points: RoutePoint[]) => {
    setState(prev => ({ ...prev, points, loading: false, error: null }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  const resetRoute = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      currentIdx: 0, 
      playing: false 
    }))
  }, [])

  const setPlaying = useCallback((playing: boolean) => {
    setState(prev => ({ ...prev, playing }))
  }, [])

  const setCurrentIdx = useCallback((currentIdx: number) => {
    setState(prev => ({ ...prev, currentIdx }))
  }, [])

  return {
    ...state,
    setPoints,
    setLoading,
    setError,
    resetRoute,
    setPlaying,
    setCurrentIdx,
  }
} 