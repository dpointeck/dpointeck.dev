import { defineConfig } from 'vitest/config'

// Server utility tests do not need Start's client/server bundling plugins.
export default defineConfig({
  test: {
    environment: 'node',
  },
})
