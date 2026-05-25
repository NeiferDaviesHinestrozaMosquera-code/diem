import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-accordion',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
          ],
        }
      }
    },
    cssCodeSplit: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    drop: ['console', 'debugger'],
  }
});
