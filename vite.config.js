import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { API_BACKEND_URL, API_ORIGIN } from './src/config/constant.js'

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
        target: API_ORIGIN,
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: API_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    }
  },
})
