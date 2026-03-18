import Link from 'components/ui/link'
import {
  formatDate,
  getAllTags,
  getArticleDateTime,
  getBlogPosts,
  getTagCounts,
  getTagPath,
  getTagSlug,
  MIN_INDEXABLE_TAG_POSTS,
  resolveTag,
} from 'lib/blog'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

export const revalidate = 300
export const dynamicParams = true

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export const generateStaticParams = () => {
  const tags = getAllTags()
  return tags.map((tag) => ({ tag: getTagSlug(tag) }))
}

export const generateMetadata = async ({ params }: TagPageProps): Promise<Metadata> => {
  const { tag } = await params
  const resolvedTag = resolveTag(decodeURIComponent(tag))
  const posts = resolvedTag
    ? getBlogPosts().filter((post) => post.tags.some((t) => t === resolvedTag))
    : []

  if (!resolvedTag || posts.length === 0) {
    return {}
  }

  const tagSlug = getTagSlug(resolvedTag)
  const title = `Articles tagged "${resolvedTag}"`
  const description = `Blog posts about ${resolvedTag} by Anmol Mahatpurkar — frontend engineering, React, TypeScript, and more.`
  const isIndexable = posts.length >= MIN_INDEXABLE_TAG_POSTS

  return {
    title,
    description,
    alternates: { canonical: `/blog/tag/${tagSlug}` },
    openGraph: {
      title,
      description,
      url: `https://anm.dev/blog/tag/${tagSlug}`,
      type: 'website',
      siteName: 'anmdotdev',
      locale: 'en_US',
      images: [
        {
          url: 'https://anm.dev/opengraph-image',
          width: 1200,
          height: 630,
          alt: `Articles tagged ${resolvedTag}`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@anmdotdev',
      site: '@anmdotdev',
      images: ['https://anm.dev/opengraph-image'],
    },
    robots: {
      index: isIndexable,
      follow: true,
    },
  }
}

const TagPage = async ({ params }: TagPageProps) => {
  const { tag } = await params
  const resolvedTag = resolveTag(decodeURIComponent(tag))
  if (!resolvedTag) {
    notFound()
  }

  const canonicalTagSlug = getTagSlug(resolvedTag)

  if (canonicalTagSlug !== tag) {
    permanentRedirect(getTagPath(resolvedTag))
  }

  const posts = getBlogPosts().filter((post) => post.tags.some((t) => t === resolvedTag))
  const tagCounts = getTagCounts()
  const isIndexable = (tagCounts[resolvedTag] ?? 0) >= MIN_INDEXABLE_TAG_POSTS

  if (posts.length === 0) {
    notFound()
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://anm.dev/blog/tag/${canonicalTagSlug}#collection`,
    name: `Articles tagged "${resolvedTag}"`,
    description: `Blog posts about ${resolvedTag} by Anmol Mahatpurkar.`,
    url: `https://anm.dev/blog/tag/${canonicalTagSlug}`,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://anm.dev/#website',
    },
    author: {
      '@type': 'Person',
      '@id': 'https://anm.dev/#person',
      name: 'Anmol Mahatpurkar',
      url: 'https://anm.dev',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'BlogPosting',
          headline: post.title,
          datePublished: getArticleDateTime(post),
          url: `https://anm.dev/blog/${post.slug}`,
          description: post.summary,
        },
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://anm.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://anm.dev/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: resolvedTag,
        item: `https://anm.dev/blog/tag/${canonicalTagSlug}`,
      },
    ],
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-8 pb-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-gray text-xs dark:text-dark-text-muted">
        <Link className="hover:text-black dark:hover:text-dark-text" href="/blog" showIcon="never">
          Blog
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        <span className="text-black dark:text-dark-text">{resolvedTag}</span>
      </nav>

      <h1 className="mb-2 font-semibold text-2xl text-black dark:text-dark-text">
        Tag: {resolvedTag}
      </h1>
      <p className="mb-12 text-gray-dark text-sm dark:text-dark-text-secondary">
        {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with "{resolvedTag}"
      </p>
      {!isIndexable && (
        <p className="mb-8 text-gray text-xs dark:text-dark-text-muted">
          This topic archive is intentionally kept out of search until it has more published
          articles.
        </p>
      )}

      <div className="divide-y divide-gray-lighter dark:divide-dark-border">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              className="group/post !flex !items-start !no-underline flex-col gap-1 py-4"
              href={`/blog/${post.slug}`}
              showIcon="never"
            >
              <h2 className="font-medium text-black text-sm group-hover/post:underline dark:text-dark-text">
                {post.title}
              </h2>
              {post.summary && (
                <span className="line-clamp-2 text-gray-dark text-xs dark:text-dark-text-secondary">
                  {post.summary}
                </span>
              )}
              <span className="text-gray text-xs tabular-nums dark:text-dark-text-muted">
                {formatDate(post.date)} · {post.readingTime}
              </span>
            </Link>
          </article>
        ))}
      </div>

      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        type="application/ld+json"
      />
      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
    </section>
  )
}

export default TagPage
