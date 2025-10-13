import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use root path for Appwrite deployment
  base: '/',
  plugins: [react()],

  // Optimize for production deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          appwrite: ['appwrite']
        }
      }
    }
  },

  // Ensure proper asset handling
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],

  // Development server configuration
  server: {
    port: 5173,
    host: true
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true
  }
})