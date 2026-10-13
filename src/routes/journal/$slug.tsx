import { useRef, useCallback } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { fetchPostWithNavigation } from '../../lib/post.functions'
import { PostNavigation } from '../../components/PostNavigation'
import { PostSwipeTransition } from '../../components/PostSwipeTransition'
import { useProgressiveImages, useSwipeGesture } from '../../hooks'
import '../../components/ProgressiveMarkdownImages.css'

export const Route = createFileRoute('/journal/$slug')({
  component: PostPage,
  loader: ({ params }) => fetchPostWithNavigation({ data: params.slug }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title || 'Post' },
      { name: 'description', content: loaderData?.metadesc || '' },
    ],
    links: [
      {
        rel: 'canonical',
        href: `https://www.daniel-pointecker.net/journal/${loaderData?.slug}`,
      },
    ],
  }),
})

/**
 * Navigate with View Transition API support for swipe gestures.
 */
function useSwipeNavigation() {
  const navigate = useNavigate()

  return useCallback(
    (slug: string, direction: 'forward' | 'backward') => {
      const performNavigation = () => {
        navigate({ to: '/journal/$slug', params: { slug } })
        window.scrollTo({ top: 0, behavior: 'instant' })
      }

      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document
      ) {
        document.documentElement.dataset.viewTransitionDirection = direction
        document.startViewTransition(async () => {
          performNavigation()
          await new Promise((resolve) => setTimeout(resolve, 0))
        })
      } else {
        performNavigation()
      }
    },
    [navigate],
  )
}

function PostPage() {
  const post = Route.useLoaderData()
  const articleRef = useRef<HTMLElement>(null)
  const navigateWithTransition = useSwipeNavigation()

  // Enhance images with progressive loading
  useProgressiveImages(articleRef, { contentKey: post.slug })

  // Swipe gesture navigation
  useSwipeGesture({
    onSwipeLeft: () => {
      // Swipe left = go to next post
      if (post.nextPost) {
        navigateWithTransition(post.nextPost.slug, 'forward')
      }
    },
    onSwipeRight: () => {
      // Swipe right = go to previous post
      if (post.prevPost) {
        navigateWithTransition(post.prevPost.slug, 'backward')
      }
    },
    threshold: 50,
  })

  return (
    <div className="max-w-2xl mx-auto">
      <PostSwipeTransition>
        <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-primary tracking-tight leading-tight">
          {post.title}
        </h1>
        <article
          ref={articleRef}
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </PostSwipeTransition>
      <PostNavigation prevPost={post.prevPost} nextPost={post.nextPost} />
    </div>
  )
}
