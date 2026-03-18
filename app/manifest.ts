import { EXPERIENCE_YEARS_LABEL } from 'lib/profile'
import type { MetadataRoute } from 'next'

const manifest = (): MetadataRoute.Manifest => ({
  name: 'anmdotdev - Anmol Mahatpurkar',
  short_name: 'anmdotdev',
  description: `Software Engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript.`,
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#6a35ff',
  icons: [
    {
      src: '/icon',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      src: '/apple-icon',
      sizes: '180x180',
      type: 'image/png',
    },
    {
      src: '/apple-icon',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/apple-icon',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
})

export default manifest
