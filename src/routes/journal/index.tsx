import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '../../components/PageHeader'
import { fetchPostsByYear } from '../../lib/post.functions'
import '../../components/Journal.css'

export const Route = createFileRoute('/journal/')({
  component: JournalPage,
  loader: () => fetchPostsByYear(),
  head: () => ({
    meta: [
      { title: 'Journal' },
      {
        name: 'description',
        content: 'My journal about work and side projects',
      },
    ],
    links: [
      { rel: 'canonical', href: 'https://www.daniel-pointecker.net/journal' },
    ],
  }),
})

function JournalPage() {
  const posts = Route.useLoaderData()

  return (
    <>
      <PageHeader>
        <span>Journal</span>
      </PageHeader>
      <PostsListYears posts={posts} />
    </>
  )
}

function PostsListYears({
  posts,
}: {
  posts: {
    year: number
    posts: { slug: string; title: string; date: string }[]
  }[]
}) {
  return (
    <div className="styledPostsList max-w-2xl mx-auto">
      {posts.map((year) => (
        <div key={year.year} className="mt-16 first:mt-0">
          <h2 className="text-2xl font-semibold mb-8 text-primary tracking-tight">
            {year.year}
          </h2>
          <ul className="space-y-4">
            {year.posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/journal/$slug"
                  params={{ slug: post.slug }}
                  className="block group py-3 -mx-3 px-3 rounded-lg transition-colors bg-hover"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm text-muted font-mono flex-shrink-0 tabular-nums">
                      {post.date}
                    </span>
                    <span className="text-secondary group-hover:text-primary transition-colors font-medium">
                      {post.title}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
