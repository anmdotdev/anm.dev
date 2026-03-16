import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: ['/', '/api/search'],
      disallow: '/api/',
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
    {
      userAgent: 'ClaudeBot',
      allow: '/',
    },
    {
      userAgent: 'Applebot-Extended',
      allow: '/',
    },
    {
      userAgent: 'cohere-ai',
      allow: '/',
    },
    {
      userAgent: 'Meta-ExternalAgent',
      allow: '/',
    },
    {
      userAgent: 'Amazonbot',
      allow: '/',
    },
    {
      userAgent: 'FacebookBot',
      allow: '/',
    },
    {
      userAgent: 'YouBot',
      allow: '/',
    },
    {
      userAgent: 'Diffbot',
      allow: '/',
    },
    {
      userAgent: 'DeepSeekBot',
      allow: '/',
    },
    {
      userAgent: 'OAI-SearchBot',
      allow: '/',
    },
    {
      userAgent: 'Twitterbot',
      allow: '/',
    },
  ],
  sitemap: 'https://anm.dev/sitemap.xml',
})

export default robots
