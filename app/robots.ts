import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
    },
    {
      userAgent: 'GPTBot',
      allow: '/',
    },
    {
      userAgent: 'Google-Extended',
      allow: '/',
    },
    {
      userAgent: 'anthropic-ai',
      allow: '/',
    },
    {
      userAgent: 'CCBot',
      allow: '/',
    },
    {
      userAgent: 'PerplexityBot',
      allow: '/',
    },
    {
      userAgent: 'Bytespider',
      allow: '/',
    },
  ],
  sitemap: 'https://anm.dev/sitemap.xml',
})

export default robots
