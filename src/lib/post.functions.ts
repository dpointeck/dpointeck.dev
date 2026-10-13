import { createServerFn } from '@tanstack/react-start'
// RPC wrappers are shared with the client; handler implementations stay on the server.
import {
  getLatestPosts,
  getPostBySlug,
  getPostsByYear,
  getPostWithNavigation,
} from './post'

export const fetchPost = createServerFn({ method: 'POST' })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    return getPostBySlug(data)
  })

export const fetchPostWithNavigation = createServerFn({ method: 'POST' })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    return getPostWithNavigation(data)
  })

export const fetchPostsByYear = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getPostsByYear()
  },
)

export const fetchLatestPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getLatestPosts(3)
  },
)
