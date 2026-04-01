import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 15000,
    hookTimeout: 15000,
    setupFiles: ['./tests/setup.js'],
    fileParallelism: false,
  },
})
