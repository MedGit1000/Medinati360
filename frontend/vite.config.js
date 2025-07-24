import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The proxy block might be here, that's fine to keep.
  // Just make sure the 'resolve' block is removed.
})