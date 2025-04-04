import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/React_portfolio/', // Replace 'vite-project' with your repository name
  plugins: [react()],
})