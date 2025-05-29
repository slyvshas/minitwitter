import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@supabase/supabase-js']
    }
  },
  envPrefix: 'VITE_' // This ensures only variables prefixed with VITE_ are exposed to your client-side code
})
