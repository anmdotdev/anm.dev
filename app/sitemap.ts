import { getArticleModifiedTime, getBlogPosts, getIndexableTags, getTagSlug } from 'lib/blog'
import { JOURNEY_LAST_UPDATED } from 'lib/journey'
import { OPEN_SOURCE_LAST_UPDATED } from 'lib/projects'
import type { MetadataRoute } from 'next'

export const revalidate = 300

const toUtcDate = (value: string): Date => new Date(`${value}T00:00:00.000Z`)

const getLatestDate = (...values: (Date | null | undefined)[]): Date =>
  values.reduce<Date>((latestDate, value) => {
    if (!(value && value > latestDate)) {
      return latestDate
    }

    return value
  }, new Date(0))

const getLatestPublishedPostDate = (posts: ReturnType<typeof getBlogPosts>): Date | null =>
  posts.length > 0 ? new Date(getArticleModifiedTime(posts[0])) : null

const sitemap = (): MetadataRoute.Sitemap => {
  const posts = getBlogPosts()
  const latestPublishedPostDate = getLatestPublishedPostDate(posts)
  const openSourceLastModified = toUtcDate(OPEN_SOURCE_LAST_UPDATED)
  const journeyLastModified = toUtcDate(JOURNEY_LAST_UPDATED)
  const blogIndexLastModified =
    latestPublishedPostDate ?? getLatestDate(openSourceLastModified, journeyLastModified)
  const homeLastModified = getLatestDate(
    latestPublishedPostDate,
    openSourceLastModified,
    journeyLastModified,
  )

  const blogEntries = posts.map((post) => ({
    url: `https://anm.dev/blog/${post.slug}`,
    lastModified: new Date(getArticleModifiedTime(post)),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    images: [`https://anm.dev/blog/${post.slug}/opengraph-image`],
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
