import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    nitro({
      // Enable compression for text-based responses
      compressPublicAssets: {
        gzip: true,
        brotli: true,
      },
      // Route rules for caching headers
      routeRules: {
        // Font files - cache for 1 year (immutable)
        '/fonts/**': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        },
        // Static assets (JS, CSS) - cache for 1 year (they have hashed filenames)
        '/assets/**': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        },
        // Images - cache for 1 week
        '/images/**': {
          headers: {
            'Cache-Control':
              'public, max-age=604800, stale-while-revalidate=86400',
          },
        },
        // Favicon - cache for 1 week
        '/favicon.svg': {
          headers: {
            'Cache-Control': 'public, max-age=604800',
          },
        },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  build: {
    // Enable minification with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})

export default config
