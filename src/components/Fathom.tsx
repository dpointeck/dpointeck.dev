import { load, trackPageview } from 'fathom-client'
import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

export default function Fathom() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const search = useRouterState({ select: (s) => s.location.search })

  useEffect(() => {
    load(import.meta.env.VITE_FATHOM_SITE_ID || '', {
      auto: false,
    })
  }, [])

  useEffect(() => {
    if (!pathname) return

    const searchString = new URLSearchParams(
      search as Record<string, string>,
    ).toString()
    trackPageview({
      url: pathname + (searchString ? `?${searchString}` : ''),
      referrer: document.referrer,
    })
  }, [pathname, search])

  return null
}
