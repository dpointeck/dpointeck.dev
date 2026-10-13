import { useState, useRef, useEffect } from 'react'
import './ProgressiveImage.css'

interface ProgressiveImageProps {
  src: string
  alt: string
  /**
   * Low-resolution placeholder image URL (should be very small, e.g., 20-40px wide).
   * This creates the pixelated effect when scaled up.
   */
  placeholder: string
  /** Aspect ratio as width/height (e.g., 16/9, 4/3, 1). Defaults to auto. */
  aspectRatio?: number
  /** Additional CSS classes for the container */
  className?: string
  /** Object-fit property for the image */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  /** Object-position property for the image */
  objectPosition?: string
  /** Duration of the reveal transition in ms. Defaults to 600. */
  transitionDuration?: number
  /** Optional width constraint */
  width?: number | string
  /** Optional height constraint */
  height?: number | string
}

export function ProgressiveImage({
  src,
  alt,
  placeholder,
  aspectRatio,
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
  transitionDuration = 600,
  width,
  height,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Handle image load
  useEffect(() => {
    if (!isVisible) return

    const img = imgRef.current
    if (!img) return

    // If image is already cached
    if (img.complete && img.naturalHeight !== 0) {
      setIsLoaded(true)
      return
    }

    const handleLoad = () => setIsLoaded(true)
    img.addEventListener('load', handleLoad)
    return () => img.removeEventListener('load', handleLoad)
  }, [isVisible])

  const containerStyle: React.CSSProperties = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
    ...(aspectRatio && { aspectRatio: aspectRatio.toString() }),
    ['--transition-duration' as string]: `${transitionDuration}ms`,
  }

  const imageStyle: React.CSSProperties = {
    objectFit,
    objectPosition,
  }

  return (
    <div
      ref={containerRef}
      className={`progressive-image ${className}`}
      style={containerStyle}
    >
      {/* Pixelated placeholder layer */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={`progressive-image__placeholder ${isLoaded ? 'is-hidden' : ''}`}
        style={imageStyle}
      />

      {/* Main high-res image */}
      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`progressive-image__full ${isLoaded ? 'is-loaded' : ''}`}
          style={imageStyle}
        />
      )}
    </div>
  )
}
