import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import Fathom from '../components/Fathom'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

const fontFaceCSS = `
/* Fallback font with adjusted metrics to match Greycliff - prevents CLS */
@font-face {
  font-family: "Greycliff Fallback";
  src: local("BlinkMacSystemFont"), local("-apple-system"), local("Segoe UI"), local("Roboto"), local("Arial");
  size-adjust: 100%;
  ascent-override: 95%;
  descent-override: 22%;
  line-gap-override: 0%;
}

@font-face {
  font-family: "Greycliff";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/Greycliff/GreycliffCF-Regular.woff2") format("woff2"),
    url("/fonts/Greycliff/GreycliffCF-Regular.woff") format("woff");
}
@font-face {
  font-family: "Greycliff";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/Greycliff/GreycliffCF-Medium.woff2") format("woff2"),
    url("/fonts/Greycliff/GreycliffCF-Medium.woff") format("woff");
}
@font-face {
  font-family: "Greycliff";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/Greycliff/GreycliffCF-Bold.woff2") format("woff2"),
    url("/fonts/Greycliff/GreycliffCF-Bold.woff") format("woff");
}

/* Fallback font with adjusted metrics for monospace */
@font-face {
  font-family: "Codesaver Fallback";
  src: local("Menlo"), local("Monaco"), local("Consolas"), local("Liberation Mono"), local("Courier New");
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 0%;
}

@font-face {
  font-family: "Codesaver";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/CodeSaver/CodeSaver-Regular.woff2") format("woff2"),
    url("/fonts/CodeSaver/CodeSaver-Regular.woff") format("woff");
}
@font-face {
  font-family: "Codesaver";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/CodeSaver/CodeSaver-Bold.woff2") format("woff2"),
    url("/fonts/CodeSaver/CodeSaver-Bold.woff") format("woff");
}
`

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Daniel Pointecker - software dev',
      },
      {
        name: 'description',
        content:
          "Hi there! I'm Daniel a software dev from Austria. Checkout posts around web development and software engineering",
      },
      {
        name: 'google-site-verification',
        content: import.meta.env.VITE_GOOGLE_SITE_VERIFY_ID || '',
      },
    ],
    links: [
      // Preload critical fonts to reduce FOUT
      {
        rel: 'preload',
        href: '/fonts/Greycliff/GreycliffCF-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/Greycliff/GreycliffCF-Bold.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.svg',
      },
    ],
  }),

  component: RootComponent,
})

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl md:text-2xl text-secondary mb-8">
        Oops! This page doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to Home
      </Link>
    </div>
  )
}

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFaceCSS }} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for icons - prevent FOUC */
            .social-link svg,
            .social-link .icon {
              width: 1rem !important;
              height: 1rem !important;
              display: block;
              flex-shrink: 0;
            }
            /* Theme switcher button sizing */
            button[aria-label="Toggle theme"] {
              width: 24px !important;
              height: 24px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 4px !important;
            }
            button[aria-label="Toggle theme"] svg {
              width: 16px !important;
              height: 16px !important;
            }
            /* Navigation visibility - prevent both showing */
            .desktop-nav { 
              display: none !important; 
            }
            @media (min-width: 768px) {
              .desktop-nav { 
                display: block !important; 
              }
            }
            .mobile-nav {
              display: flex !important;
              position: fixed;
              bottom: 0;
              width: 100%;
              z-index: 100;
            }
            @media (min-width: 768px) {
              .mobile-nav { 
                display: none !important; 
              }
            }
          `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const root = document.documentElement;
                if (theme === 'dark') {
                  root.classList.add('dark');
                } else if (theme === 'light') {
                  root.classList.remove('dark');
                } else {
                  // System preference
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (prefersDark) {
                    root.classList.add('dark');
                  } else {
                    root.classList.remove('dark');
                  }
                }
              })();
            `,
          }}
        />
        <HeadContent />
      </head>
      <body className="pb-20 md:pb-0">
        <Fathom />
        <Nav />
        <main className="layout-page container mx-auto px-4 md:px-8 py-8">
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
