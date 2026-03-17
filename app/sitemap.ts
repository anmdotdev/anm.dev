import fs from 'node:fs'
import path from 'node:path'

import { getArticleModifiedTime, getBlogPosts, getIndexableTags, getTagSlug } from 'lib/blog'
import type { MetadataRoute } from 'next'

export const revalidate = 300

const getLatestFileModifiedTime = (paths: string[]): Date =>
  paths.reduce<Date>((latestDate, relativePath) => {
    const absolutePath = path.join(process.cwd(), relativePath)

    if (!fs.existsSync(absolutePath)) {
      return latestDate
    }

    const modifiedTime = fs.statSync(absolutePath).mtime
    return modifiedTime > latestDate ? modifiedTime : latestDate
  }, new Date(0))

const getLatestPublishedPostDate = (posts: ReturnType<typeof getBlogPosts>): Date | null =>
  posts.length > 0 ? new Date(getArticleModifiedTime(posts[0])) : null

const sitemap = (): MetadataRoute.Sitemap => {
  const posts = getBlogPosts()
  const latestPublishedPostDate = getLatestPublishedPostDate(posts)

  const homeLastModified = latestPublishedPostDate
    ? new Date(
        Math.max(
          latestPublishedPostDate.getTime(),
          getLatestFileModifiedTime([
            'app/page.tsx',
            'components/home/intro.tsx',
            'components/home/open-source-projects.tsx',
            'components/home/recent-posts.tsx',
            'lib/projects.ts',
          ]).getTime(),
        ),
      )
    : getLatestFileModifiedTime([
        'app/page.tsx',
        'components/home/intro.tsx',
        'components/home/open-source-projects.tsx',
        'components/home/recent-posts.tsx',
        'lib/projects.ts',
      ])

  const openSourceLastModified = getLatestFileModifiedTime([
    'app/open-source/page.tsx',
    'components/open-source/open-source-project.tsx',
    'lib/projects.ts',
  ])

  const journeyLastModified = getLatestFileModifiedTime([
    'app/journey/page.tsx',
    'components/journey/timeline.tsx',
    'components/journey/timeline-entry.tsx',
    'lib/journey.ts',
  ])

  const blogIndexLastModified =
    latestPublishedPostDate ??
    getLatestFileModifiedTime(['app/blog/page.tsx', 'components/home/recent-posts.tsx'])

  const blogEntries = posts.map((post) => ({
    url: `https://anm.dev/blog/${post.slug}`,
    lastModified: new Date(getArticleModifiedTime(post)),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const tagEntries = getIndexableTags()
    .map((tag) => {
      const taggedPosts = posts.filter((post) => post.tags.includes(tag))
      const latestTaggedPost = taggedPosts.at(0)

      if (!latestTaggedPost) {
        return null
      }

      return {
        url: `https://anm.dev/blog/tag/${getTagSlug(tag)}`,
        lastModified: new Date(getArticleModifiedTime(latestTaggedPost)),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

  return [
    {
      url: 'https://anm.dev',
      lastModified: homeLastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://anm.dev/open-source',
      lastModified: openSourceLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://anm.dev/journey',
      lastModified: journeyLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://anm.dev/blog',
      lastModified: blogIndexLastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogEntries,
    ...tagEntries,
  ]
}

export default sitemap
