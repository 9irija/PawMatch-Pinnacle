import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repo-name>/
  // This must match the repository name exactly.
  base: '/PawMatch-Pinnacle/',
})
