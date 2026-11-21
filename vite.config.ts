import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Puerto dedicado 5199 para no chocar con el resto de proyectos locales
// (3000, 3100, 4001, 5432, 8000, 8080, 8443, 8880 ya estan en uso).
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5199,
    strictPort: true,
  },
  preview: {
    port: 5199,
    strictPort: true,
  },
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
})
