import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  assetsInclude: ['**/*.PNG'],
  server: {
    port: 5174,
    hmr: {
      port: 5174,
    },
    proxy: {
      '/api/v1': {
        target: 'https://autoparts.zubitechnologies.com',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://autoparts.zubitechnologies.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    }
  },
})