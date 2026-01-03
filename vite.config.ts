/// <reference types="vite-plugin-pwa/client" />
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallback: 'index.html',
      },
      includeAssets: ['icon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Zyfter - Workout Logger',
        short_name: 'Zyfter',
        description: 'Track your gym workouts, log exercises, and monitor your strength progress',
        start_url: '/',
        display: 'standalone',
        background_color: '#09090b',
        theme_color: '#10b981',
        orientation: 'portrait',
        scope: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        categories: ['health', 'fitness', 'lifestyle']
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
})
