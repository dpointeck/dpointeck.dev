import { useEffect, type ReactNode } from 'react'
import './PostSwipeTransition.css'

interface PostSwipeTransitionProps {
  children: ReactNode
}

export function PostSwipeTransition({ children }: PostSwipeTransitionProps) {
  // Clean up direction attribute after transition completes
  useEffect(() => {
    const cleanup = () => {
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset.viewTransitionDirection
      }
    }

    // Clean up after transition animation (matches CSS duration)
    const timer = setTimeout(cleanup, 400)
    return () => clearTimeout(timer)
  })

  return (
    <div
      className="post-content"
      style={{ viewTransitionName: 'post-content' }}
    >
      {children}
    </div>
  )
}
