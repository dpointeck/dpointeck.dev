# dp-next

Personal blog/portfolio website for Daniel Pointecker, built with TanStack Start.

## Tech Stack

- **Framework**: TanStack Start v1 (React 19, Vite 8)
- **Type checking**: TypeScript 7
- **Linting / formatting**: Oxlint / Oxfmt
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4
- **Content**: Markdown with gray-matter + rehype-pretty-code
- **Analytics**: Fathom Analytics
- **Runtime**: Bun

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Check types, lint, and formatting without changing files
bun run typecheck
bun run lint
bun run format:check

# Format files, or format + fix lint issues + check types
bun run format
bun run check
```

Vite requires Node.js 22.12+ (or 20.19+); TanStack Start requires Node.js
22.12+ when using Node. Docker builds and production use Bun.

Oxfmt retains single quotes, no semicolons, and an 80-column print width.
Published Markdown posts are left untouched by formatting, and generated routes
are excluded from linting and formatting. Oxlint checks
correctness with TypeScript and React rules; this replaces the TanStack ESLint
preset rather than reproducing every rule. The existing hydration guards in
`Nav` and `ThemeSwitcher` are exempt from `react/set-state-in-effect`.

Security overrides keep `js-yaml` on patched v4 and `postcss-selector-parser`
on patched v7 until gray-matter and Typography update their dependency ranges.
Frontmatter uses the existing `yaml` package through gray-matter's custom engine;
do not use gray-matter's default engine, which calls the removed `safeLoad` API.

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_FATHOM_SITE_ID=your_fathom_site_id
VITE_GOOGLE_SITE_VERIFY_ID=your_google_site_verification_id
```

## Docker

Both build and production stages use the pinned Bun 1.4.3 image.

```bash
docker build \
  --build-arg NEXT_PUBLIC_FATHOM_SITE_ID=xxx \
  --build-arg NEXT_PUBLIC_GOOGLE_SITE_VERIFY_ID=xxx \
  -t dp-next .

docker run -p 3000:3000 dp-next
```

## Project Structure

```
src/
├── routes/           # File-based routing
│   ├── __root.tsx    # Root layout
│   ├── index.tsx     # Homepage
│   ├── about.tsx
│   ├── journal/
│   │   ├── index.tsx
│   │   └── $slug.tsx
│   ├── resources.tsx
│   ├── uses.tsx
│   ├── privacy-policy.tsx
│   └── site-notice.tsx
├── components/       # Shared components
├── lib/              # Utilities & server functions
├── data/             # YAML data files
└── styles.css        # Global styles
_posts/               # Markdown blog posts
public/               # Static assets
```

## Adding Blog Posts

Create a markdown file in `_posts/` with frontmatter:

```yaml
---
slug: my-post
title: 'My Post Title'
date: 2024-01-15
metadesc: 'SEO description'
---
Post content here...
```

## Images in Blog Posts

Images in blog posts automatically get **progressive loading** with a pixelated placeholder effect. The image loads a tiny version first (displayed pixelated), then fades to the full resolution when loaded.

### Supported Image Services

For the best pixelated placeholder effect, use images from these CDNs:

| Service        | Example URL                                                |
| -------------- | ---------------------------------------------------------- |
| **Unsplash**   | `https://images.unsplash.com/photo-xxx?w=1200`             |
| **Cloudinary** | `https://res.cloudinary.com/xxx/image/upload/v1/photo.jpg` |
| **Imgix**      | `https://xxx.imgix.net/photo.jpg?w=1200`                   |

These services allow dynamic resizing, so the hook automatically generates a tiny 20px placeholder.

### Using Unsplash (Recommended)

1. Find an image on [Unsplash](https://unsplash.com)
2. Copy the image URL (right-click → Copy Image Address)
3. Add width parameter for optimal loading:

```markdown
![Mountain landscape](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80)
```

**Tip:** Use `w=1200` or `w=800` for a good balance of quality and file size.

### Local Images

For local images in `/public/images/`, the progressive loader falls back to a blur effect (no pixelated placeholder). To get the pixelated effect with local images, you would need to:

1. Generate a tiny placeholder manually (20px wide)
2. Or upload images to a supported CDN

### How It Works

1. Images are detected after the markdown renders
2. For supported CDNs, a tiny 20px placeholder URL is generated
3. The placeholder loads immediately and displays pixelated (`image-rendering: pixelated`)
4. The full image lazy-loads when scrolled into view
5. Once loaded, it fades in over the pixelated placeholder
