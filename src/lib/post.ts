import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import { getYear, parseISO } from 'date-fns'
import path from 'path'
import fs from 'fs/promises'

interface PostFrontMatter {
  slug: string
  title: string
  date: string
  metadesc: string
  published?: boolean
}

interface PostMetadata {
  slug: string
  title: string
  metadesc: string
  date: string
  rawDate: string // ISO date for sorting
  year: number
  published: boolean
}

async function getMarkdownFiles(): Promise<string[]> {
  const postsDir = path.join(process.cwd(), '_posts')
  const files = await fs.readdir(postsDir)
  return files.filter((file) => file.endsWith('.md'))
}

async function parseMarkdownFile(
  filePath: string,
): Promise<{ data: PostFrontMatter; content: string }> {
  const fileContent = await fs.readFile(filePath, 'utf-8')
  // gray-matter's default engine calls safeLoad, removed in patched js-yaml 4.
  const { data, content } = matter(fileContent, {
    engines: { yaml: parseYaml },
  })

  if (data.date instanceof Date) {
    data.date = data.date.toISOString().split('T')[0]
  }

  return { data: data as PostFrontMatter, content }
}

async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(
      rehypePrettyCode as any,
      {
        theme: {
          light: 'github-light',
          dark: 'github-dark',
        },
        keepBackground: false,
        onVisitLine(node: any) {
          if (node.children.length === 0) {
            node.children = [{ type: 'text', value: ' ' }]
          }
        },
        onVisitHighlightedLine(node: any) {
          node.properties.className.push('highlighted')
        },
        onVisitHighlightedWord(node: any) {
          node.properties.className = ['word']
        },
      } as any,
    )
    .use(rehypeStringify)

  const html = await processor.process(markdown)
  return String(html.value)
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  const files = await getMarkdownFiles()

  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(process.cwd(), '_posts', file)
      const { data } = await parseMarkdownFile(filePath)

      const dateString =
        typeof data.date === 'string' ? data.date : String(data.date)
      const date = parseISO(dateString)

      if (isNaN(date.getTime())) {
        console.error(`Invalid date for ${file}: ${dateString}`)
        throw new Error(`Invalid date format in ${file}: ${dateString}`)
      }

      const year = getYear(date)
      const shortDate = date.toLocaleDateString('en-AT', {
        day: '2-digit',
        month: 'short',
      })

      return {
        slug: data.slug,
        title: data.title,
        metadesc: data.metadesc,
        date: shortDate,
        rawDate: dateString,
        year: year,
        published: data.published !== false, // Default to true if not specified
      }
    }),
  )

  // Filter to only return published posts
  return posts.filter((post) => post.published)
}

export async function getPostBySlug(
  slug: string,
): Promise<{ title: string; metadesc: string; content: string; slug: string }> {
  const files = await getMarkdownFiles()

  for (const file of files) {
    const filePath = path.join(process.cwd(), '_posts', file)
    const { data, content } = await parseMarkdownFile(filePath)

    if (data.slug === slug) {
      const html = await renderMarkdownToHtml(content)
      return {
        title: data.title,
        metadesc: data.metadesc,
        content: html,
        slug: data.slug,
      }
    }
  }

  return {
    title: '',
    metadesc: '',
    content: '',
    slug: '',
  }
}

interface PostNavLink {
  slug: string
  title: string
}

interface PostWithNavigation {
  title: string
  metadesc: string
  content: string
  slug: string
  prevPost: PostNavLink | null
  nextPost: PostNavLink | null
}

export async function getPostWithNavigation(
  slug: string,
): Promise<PostWithNavigation> {
  const allPosts = await getAllPosts()

  // Sort by date descending (newest first)
  const sortedPosts = allPosts.sort((a, b) =>
    b.rawDate.localeCompare(a.rawDate),
  )

  // Find current post index
  const currentIndex = sortedPosts.findIndex((post) => post.slug === slug)

  // Get prev/next posts (prev = newer, next = older)
  const prevPost =
    currentIndex > 0
      ? {
          slug: sortedPosts[currentIndex - 1].slug,
          title: sortedPosts[currentIndex - 1].title,
        }
      : null
  const nextPost =
    currentIndex < sortedPosts.length - 1
      ? {
          slug: sortedPosts[currentIndex + 1].slug,
          title: sortedPosts[currentIndex + 1].title,
        }
      : null

  // Get the full post content
  const post = await getPostBySlug(slug)

  return {
    ...post,
    prevPost,
    nextPost,
  }
}

export async function getLatestPosts(count: number): Promise<PostMetadata[]> {
  const posts = await getAllPosts()

  // Sort by date descending and take the first N
  return posts
    .sort((a, b) => b.rawDate.localeCompare(a.rawDate))
    .slice(0, count)
}

export async function getPostsByYear(): Promise<
  { year: number; posts: PostMetadata[] }[]
> {
  const posts = await getAllPosts()

  // Sort all posts by date descending (most recent first)
  posts.sort((a, b) => b.rawDate.localeCompare(a.rawDate))

  const years = getYears(posts)
  const postsByYear = []

  for (const year of years) {
    const thisYearsPosts = posts.filter((post) => post.year === year)
    postsByYear.push({
      year: year,
      posts: thisYearsPosts,
    })
  }

  return postsByYear
}

function getYears(posts: PostMetadata[]): Array<number> {
  const years: Set<number> = new Set()

  posts.forEach((post) => {
    years.add(post.year)
  })

  // Sort years descending (newest first)
  return Array.from(years).sort((a, b) => b - a)
}
