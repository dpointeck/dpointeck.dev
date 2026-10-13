import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchLatestPosts } from '../lib/post.functions'
import './index.css'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: () => fetchLatestPosts(),
  head: () => ({
    meta: [
      {
        title: 'Daniel Pointecker - software dev',
      },
      {
        name: 'description',
        content:
          "Hi there! I'm Daniel a software dev from 🇦🇹. Checkout posts around web development and software engineering",
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://www.daniel-pointecker.net',
      },
    ],
  }),
})

function HomePage() {
  const latestPosts = Route.useLoaderData()

  return (
    <div className="max-w-2xl mx-auto mt-16 md:mt-24">
      <h1 className="text-4xl md:text-5xl font-semibold mb-8 text-primary leading-tight tracking-tight">
        Hi, I'm Daniel.
      </h1>
      <p className="text-lg md:text-xl leading-relaxed text-secondary">
        I'm a software developer from 🇦🇹 focused on frontend development. This
        site is a collection of things I constantly forget and have to search
        every time I need them. If there's something helpful for you, feel free
        to grab it.
      </p>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-primary tracking-tight">
          Latest Posts
        </h2>
        <ul className="space-y-3">
          {latestPosts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/journal/$slug"
                params={{ slug: post.slug }}
                className="block group py-3 -mx-3 px-3 rounded-lg transition-colors bg-hover"
              >
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted font-mono flex-shrink-0 tabular-nums">
                    {post.rawDate}
                  </span>
                  <span className="text-secondary group-hover:text-primary transition-colors font-medium">
                    {post.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/journal"
          className="inline-flex items-center gap-1 mt-6 text-sm font-medium text-muted hover:text-primary transition-colors"
        >
          View all posts →
        </Link>
      </section>
    </div>
  )
}
