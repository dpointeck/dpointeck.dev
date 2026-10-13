import { useNavigate } from '@tanstack/react-router'
import { useCallback, type MouseEvent } from 'react'
import './PostNavigation.css'

interface PostNavLink {
  slug: string
  title: string
}

interface PostNavigationProps {
  prevPost: PostNavLink | null
  nextPost: PostNavLink | null
}

type NavigationDirection = 'forward' | 'backward'

/**
 * Navigate with View Transition API support.
 * Falls back to regular navigation if not supported.
 */
function useViewTransitionNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (slug: string, direction: NavigationDirection) => {
      const performNavigation = () => {
        navigate({ to: '/journal/$slug', params: { slug } })
        window.scrollTo({ top: 0, behavior: 'instant' })
      }

      // Check for View Transition API support
      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document
      ) {
        // Set direction for CSS to style the transition
        document.documentElement.dataset.viewTransitionDirection = direction

        document.startViewTransition(async () => {
          performNavigation()
          // Wait for React to flush the update
          await new Promise((resolve) => setTimeout(resolve, 0))
        })
      } else {
        performNavigation()
      }
    },
    [navigate],
  )
}

export function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
  const navigateWithTransition = useViewTransitionNavigate()

  const handlePrevClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!prevPost) return
      e.preventDefault()
      navigateWithTransition(prevPost.slug, 'backward')
    },
    [prevPost, navigateWithTransition],
  )

  const handleNextClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (!nextPost) return
      e.preventDefault()
      navigateWithTransition(nextPost.slug, 'forward')
    },
    [nextPost, navigateWithTransition],
  )

  return (
    <>
      {/* Desktop side navigation */}
      <nav className="post-nav-desktop" aria-label="Post navigation">
        {prevPost && (
          <a
            href={`/journal/${prevPost.slug}`}
            onClick={handlePrevClick}
            className="post-nav-link post-nav-prev"
            aria-label={`Previous post: ${prevPost.title}`}
          >
            <span className="post-nav-arrow">←</span>
            <span className="post-nav-title">{prevPost.title}</span>
          </a>
        )}
        {nextPost && (
          <a
            href={`/journal/${nextPost.slug}`}
            onClick={handleNextClick}
            className="post-nav-link post-nav-next"
            aria-label={`Next post: ${nextPost.title}`}
          >
            <span className="post-nav-arrow">→</span>
            <span className="post-nav-title">{nextPost.title}</span>
          </a>
        )}
      </nav>

      {/* Mobile bottom navigation */}
      <nav className="post-nav-mobile" aria-label="Post navigation">
        {prevPost && (
          <a
            href={`/journal/${prevPost.slug}`}
            onClick={handlePrevClick}
            className="post-nav-mobile-link post-nav-mobile-link-prev"
            aria-label={`Previous post: ${prevPost.title}`}
          >
            <span className="post-nav-mobile-arrow">←</span>
            <span className="post-nav-mobile-label">Previous</span>
          </a>
        )}
        {nextPost && (
          <a
            href={`/journal/${nextPost.slug}`}
            onClick={handleNextClick}
            className="post-nav-mobile-link post-nav-mobile-link-next"
            aria-label={`Next post: ${nextPost.title}`}
          >
            <span className="post-nav-mobile-label">Next</span>
            <span className="post-nav-mobile-arrow">→</span>
          </a>
        )}
      </nav>
    </>
  )
}
