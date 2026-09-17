import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/trabajos/" : "/",
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
}))