import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Keine data:-URIs für Schriften/Bilder → strenge Content-Security-Policy (public/_headers) bleibt gültig.
  build: { assetsInlineLimit: 0 },
})
