import { useEffect, useRef, type RefObject } from 'react'

interface UseProgressiveImagesOptions {
  /** Root margin for intersection observer. Default: '50px' */
  rootMargin?: string
  /** Transition duration in ms. Default: 600 */
  transitionDuration?: number
  /** Dependency to trigger re-processing (e.g., post slug or content hash) */
  contentKey?: string
  /** Width of the tiny placeholder image. Default: 20 */
  placeholderWidth?: number
}

/**
 * Generate a tiny placeholder URL for known image services.
 * Falls back to original URL if service is not recognized.
 */
function getTinyImageUrl(src: string, width: number): string | null {
  try {
    const url = new URL(src, window.location.origin)

    // Unsplash: change w= parameter
    if (url.hostname.includes('unsplash.com')) {
      url.searchParams.set('w', String(width))
      url.searchParams.set('q', '30')
      return url.toString()
    }

    // Cloudinary: insert transformation
    if (url.hostname.includes('cloudinary.com')) {
      const parts = url.pathname.split('/upload/')
      if (parts.length === 2) {
        url.pathname = `${parts[0]}/upload/w_${width},q_30/${parts[1]}`
        return url.toString()
      }
    }

    // Imgix: add w parameter
    if (url.hostname.includes('imgix.net')) {
      url.searchParams.set('w', String(width))
      url.searchParams.set('q', '30')
      return url.toString()
    }

    // Local images with query params support (e.g., Next.js Image optimization)
    if (url.pathname.match(/\.(jpg|jpeg|png|webp)$/i)) {
      // For local images, we can't easily generate tiny versions
      // Return null to use CSS-only fallback
      return null
    }

    return null
  } catch {
    return null
  }
}

/**
 * Hook to enhance images in rendered markdown/HTML content with progressive loading.
 * Creates a pixelated placeholder effect by loading a tiny version of the image first.
 *
 * @param containerRef - Ref to the container element with rendered HTML
 * @param options - Configuration options
 */
export function useProgressiveImages(
  containerRef: RefObject<HTMLElement | null>,
  options: UseProgressiveImagesOptions = {},
) {
  const {
    rootMargin = '50px',
    transitionDuration = 600,
    contentKey,
    placeholderWidth = 20,
  } = options
  const processedImages = useRef(new WeakSet<HTMLImageElement>())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const images = container.querySelectorAll<HTMLImageElement>('img')
    if (images.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const wrapper = entry.target as HTMLDivElement
            const fullImg = wrapper.querySelector<HTMLImageElement>(
              '.progressive-img__full',
            )

            if (fullImg) {
              // Start loading the full image
              const actualSrc = fullImg.dataset.src
              if (actualSrc) {
                fullImg.src = actualSrc
              }
            }

            observer.unobserve(wrapper)
          }
        })
      },
      { rootMargin, threshold: 0.01 },
    )

    images.forEach((img) => {
      // Skip if already processed
      if (processedImages.current.has(img)) return
      processedImages.current.add(img)

      // Skip images that are already wrapped
      if (img.parentElement?.classList.contains('progressive-img')) return

      const originalSrc = img.src
      const tinyUrl = getTinyImageUrl(originalSrc, placeholderWidth)

      // Create wrapper
      const wrapper = document.createElement('div')
      wrapper.className = 'progressive-img'
      wrapper.style.setProperty(
        '--transition-duration',
        `${transitionDuration}ms`,
      )

      // Create placeholder image (tiny, pixelated)
      const placeholder = document.createElement('img')
      placeholder.className = 'progressive-img__placeholder'
      placeholder.alt = ''
      placeholder.setAttribute('aria-hidden', 'true')

      // Create full resolution image
      const fullImg = document.createElement('img')
      fullImg.className = 'progressive-img__full'
      fullImg.alt = img.alt || ''

      // Store original src, don't load yet (lazy)
      fullImg.dataset.src = originalSrc

      // Handle full image load
      const handleFullLoad = () => {
        fullImg.classList.add('is-loaded')
        placeholder.classList.add('is-hidden')
      }
      fullImg.addEventListener('load', handleFullLoad, { once: true })

      // Insert wrapper and elements
      img.parentNode?.insertBefore(wrapper, img)
      wrapper.appendChild(placeholder)
      wrapper.appendChild(fullImg)
      img.remove()

      if (tinyUrl) {
        // Load tiny placeholder immediately
        placeholder.src = tinyUrl
        // Observe wrapper for lazy loading the full image
        observer.observe(wrapper)
      } else {
        // No tiny URL available - use CSS-only blur fallback
        wrapper.classList.add('progressive-img--no-placeholder')
        placeholder.style.display = 'none'
        fullImg.src = originalSrc
        fullImg.classList.add('is-visible')

        if (fullImg.complete && fullImg.naturalHeight !== 0) {
          fullImg.classList.add('is-loaded')
        }
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [
    containerRef,
    rootMargin,
    transitionDuration,
    contentKey,
    placeholderWidth,
  ])
}
