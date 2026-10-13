# AGENTS.md - dp-next Project Guide

## Project Overview

**dp-next** is a personal blog/portfolio website built with TanStack Start and React 19. It's designed as a personal site for Daniel Pointecker, a software developer from Austria, featuring a journal section, resources page, and various utility pages.

### Key Technologies

- **Framework**: TanStack Start
- **Router**: TanStack Router (file-based routing)
- **React**: 19.x
- **TypeScript**: Full TypeScript implementation
- **Styling**: Tailwind CSS v4
- **Content**: Markdown processing with unified/remark/rehype
- **Analytics**: Fathom Analytics
- **Build/Runtime**: Bun + Vite

## Architecture

### Route Structure

```
src/routes/
├── __root.tsx          # Root layout (nav, footer, analytics)
├── index.tsx           # Homepage with animated hero
├── index.css           # Homepage styles
├── about.tsx           # About page
├── journal/
│   ├── index.tsx       # Journal listing (posts by year)
│   └── $slug.tsx       # Dynamic blog post pages
├── resources.tsx       # Resources page
├── uses.tsx            # Uses page (tools & equipment)
├── privacy-policy.tsx
└── site-notice.tsx
```

### Components

```
src/components/
├── Nav.tsx             # Desktop + mobile navigation
├── Nav.css
├── Footer.tsx          # Site footer
├── PageHeader.tsx      # Reusable page header
├── PageHeader.css
├── Fathom.tsx          # Analytics tracking
└── Journal.css         # Journal page styles
```

### Server Functions

```
src/lib/
├── post.ts             # Markdown processing utilities
└── post.functions.ts   # Server function RPC wrappers for data loading
```

Server functions use `createServerFn` from TanStack Start:

- `fetchPost` - Fetches single post by slug (POST method with validator)
- `fetchPostsByYear` - Fetches all posts grouped by year (GET method)

### Data Files

- `src/data/uses.yml` - Equipment and software lists
- `_posts/*.md` - Blog posts in Markdown with frontmatter

## Development

### Commands

```bash
bun install     # Install dependencies
bun run dev     # Development server (port 3000)
bun run build   # Production build
bun run preview # Preview production build
bun run typecheck # TypeScript 7 type checking
bun run lint    # Oxlint correctness checks
bun run format # Oxfmt formatting
bun run format:check # Check formatting without writing
```

### Environment Variables

```
VITE_FATHOM_SITE_ID         # Fathom Analytics site ID
VITE_GOOGLE_SITE_VERIFY_ID  # Google Search Console verification
```

## Content

### Blog Posts

Location: `_posts/` directory

Required frontmatter:

```yaml
---
slug: post-slug
title: 'Post Title'
date: 2024-01-15
metadesc: 'SEO description'
---
```

Markdown is processed with:

- `gray-matter` for frontmatter parsing
- `remark-parse` + `remark-rehype` for Markdown to HTML
- `rehype-pretty-code` with Shiki for syntax highlighting (GitHub Light theme)

### Adding New Pages

1. Create file in `src/routes/` (e.g., `new-page.tsx`)
2. Export Route with `createFileRoute`
3. Add `head` function for meta tags
4. Add navigation link in `src/components/Nav.tsx` if needed

## Styling

### Approach

- Tailwind CSS v4 with `@tailwindcss/typography` plugin
- Plain CSS files for component-specific styles (converted from SCSS)
- Custom fonts: Greycliff, Inter, CodeSaver (in `public/fonts/`)

### Color Scheme

- Primary: Yellow gradient (`#FFF95A` to `#FFF22E`)
- Dark mode: Green gradient (`#064e3b` to `#065f46`)

## Deployment

### Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_FATHOM_SITE_ID=xxx \
  --build-arg NEXT_PUBLIC_GOOGLE_SITE_VERIFY_ID=xxx \
  -t dp-next .
```

The Dockerfile:

- Uses Bun 1.4.3 for both build and production stages
- Builds with Vite/Vinxi
- Outputs to `.output/` directory
- Copies `src/data/` and `_posts/` for runtime data access
- Runs Nitro server on port 3000

### Required in Production

- `src/data/uses.yml` - Uses page data
- `_posts/` - Blog post markdown files
