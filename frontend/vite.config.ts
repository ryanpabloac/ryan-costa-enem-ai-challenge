import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})
