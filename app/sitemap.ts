import { getBlogPosts } from 'lib/blog'
import type { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap => {
  const posts = getBlogPosts()

  const blogEntries = posts.map((post) => ({
    url: `https://anm.dev/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://anm.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://anm.dev/open-source',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://anm.dev/journey',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://anm.dev/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogEntries,
  ]
}

export default sitemap
