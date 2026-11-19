import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // Für die spätere Datenbindung: /api an den Flask-Server weiterleiten.
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
