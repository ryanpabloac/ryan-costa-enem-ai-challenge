import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/auth': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/users': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/exams': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
