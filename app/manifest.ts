import type { MetadataRoute } from 'next'

const manifest = (): MetadataRoute.Manifest => ({
  name: 'anmdotdev - Anmol Mahatpurkar',
  short_name: 'anmdotdev',
  description:
    'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript.',
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
  ],
})

export default manifest
