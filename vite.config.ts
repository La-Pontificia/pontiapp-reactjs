import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ponti App | La Pontificia',
        short_name: 'Ponti App',
        description: 'Ponti App | Grupo La Pontificia',
        theme_color: '#07060e',
        background_color: '#05030c',
        display: 'standalone',
        lang: 'es-ES',
        start_url: 'http://localhost:5173',
        scope: 'http://localhost:5173',
        id: 'pontiapp',
        icons: [
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: './icon512_maskable.png',
            type: 'image/png'
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: './icon512_rounded.png',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: [{ find: '~', replacement: path.resolve(__dirname, 'src') }]
  }
})
