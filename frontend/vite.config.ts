import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev proxy: any request the app makes to "/api/..." is forwarded to the
    // NestJS backend on http://localhost:3000, with the "/api" prefix removed.
    // Example: the app calls  GET /api/courses  ->  backend gets  GET /courses.
    //
    // Why bother? It lets the frontend and backend look like the SAME origin
    // during development, so the browser never complains about CORS. In the
    // app code we only ever talk to "/api" (see src/lib/apiClient.ts).
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
