import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('xlsx')) {
              return 'vendor-xlsx'
            }
            if (id.includes('jspdf')) {
              return 'vendor-jspdf'
            }
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas'
            }
            if (id.includes('dompurify') || id.includes('purify')) {
              return 'vendor-dompurify'
            }
            if (id.includes('pdfjs-dist')) {
              return 'vendor-pdfjs'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide'
            }
            return 'vendor-core'
          }
        },
      },
    },
  },
})
