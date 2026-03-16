import { getAllTags, getBlogPosts } from 'lib/blog'
import type { MetadataRoute } from 'next'

const sitemap = (): MetadataRoute.Sitemap => {
  const posts = getBlogPosts()

  const latestPostDate = posts.length > 0 ? new Date(posts[0].date) : new Date()

  const blogEntries = posts.map((post) => ({
    url: `https://anm.dev/blog/${post.slug}`,
    lastModified: new Date(post.lastModified || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const tagEntries = getAllTags().map((tag) => ({
    url: `https://anm.dev/blog/tag/${encodeURIComponent(tag.toLowerCase())}`,
    lastModified: latestPostDate,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [
    {
      url: 'https://anm.dev',
      lastModified: latestPostDate,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://anm.dev/open-source',
      lastModified: latestPostDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://anm.dev/journey',
      lastModified: latestPostDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://anm.dev/blog',
      lastModified: latestPostDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogEntries,
    ...tagEntries,
  ]
}

export default sitemap
