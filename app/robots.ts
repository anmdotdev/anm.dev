import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
    },
  ],
  sitemap: 'https://anm.dev/sitemap.xml',
})

export default robots
