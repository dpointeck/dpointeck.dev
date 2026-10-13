import { useEffect, useRef, useCallback } from 'react'

interface SwipeGestureOptions {
  /** Minimum horizontal distance in pixels to trigger a swipe (default: 50) */
  threshold?: number
  /** Maximum vertical distance allowed during swipe (default: 100) */
  maxVerticalMovement?: number
  /** Called when user swipes left */
  onSwipeLeft?: () => void
  /** Called when user swipes right */
  onSwipeRight?: () => void
  /** Whether swipe detection is enabled (default: true) */
  enabled?: boolean
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
}

/**
 * Hook to detect horizontal swipe gestures on touch devices.
 * Useful for navigation between content like blog posts.
 */
export function useSwipeGesture(options: SwipeGestureOptions = {}) {
  const {
    threshold = 50,
    maxVerticalMovement = 100,
    onSwipeLeft,
    onSwipeRight,
    enabled = true,
  } = options

  const touchState = useRef<TouchState | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return

    const touch = e.touches[0]
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchState.current || e.changedTouches.length !== 1) return

      const touch = e.changedTouches[0]
      const { startX, startY, startTime } = touchState.current

      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      const deltaTime = Date.now() - startTime

      // Reset state
      touchState.current = null

      // Ignore if vertical movement is too large (user is scrolling)
      if (Math.abs(deltaY) > maxVerticalMovement) return

      // Ignore if swipe was too slow (> 500ms)
      if (deltaTime > 500) return

      // Check if swipe meets threshold
      if (Math.abs(deltaX) < threshold) return

      // Determine direction and call appropriate callback
      if (deltaX > 0) {
        // Swiped right (go to previous)
        onSwipeRight?.()
      } else {
        // Swiped left (go to next)
        onSwipeLeft?.()
      }
    },
    [threshold, maxVerticalMovement, onSwipeLeft, onSwipeRight],
  )

  useEffect(() => {
    if (!enabled) return

    // Use passive listeners for better scroll performance
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, handleTouchStart, handleTouchEnd])
}
