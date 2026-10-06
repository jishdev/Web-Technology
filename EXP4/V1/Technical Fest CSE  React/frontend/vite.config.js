import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The backend (Express) runs on :5000 by default. Proxying keeps the browser on a single
// origin during development, so no CORS setup is needed and VITE_API_URL can stay empty.
const backend = process.env.VITE_DEV_API_TARGET || 'http://localhost:5000'
const proxy = { '/api': backend, '/uploads': backend }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
