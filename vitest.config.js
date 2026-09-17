import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG'],
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'http://localhost:5174', pretendToBeVisual: true } },
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    restoreMocks: true,
  },
})
