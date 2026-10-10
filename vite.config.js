import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "three",
              test: /node_modules[\\/]three[\\/]/,
            },
            {
              name: "react-three",
              test: /node_modules[\\/]@react-three[\\/]fiber[\\/]/,
            },
            {
              name: "particle-effect",
              test: /node_modules[\\/]antigravity-particle[\\/]/,
            },
          ],
        },
      },
    },
  },
})
