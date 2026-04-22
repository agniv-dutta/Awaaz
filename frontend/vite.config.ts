import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) return 'react'
          if (id.includes('zustand') || id.includes('@tanstack/react-query')) return 'state'
          if (id.includes('recharts')) return 'charts'
          if (id.includes('framer-motion')) return 'motion'
          return 'vendor'
        },
      },
    },
  },
})
