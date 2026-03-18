import Comments from 'components/blog/comments'
import PostFooterActions from 'components/blog/post-footer-actions'
import { ReactionsProvider } from 'components/blog/reactions'
import ReadingProgress from 'components/blog/reading-progress'
import RelatedPosts from 'components/blog/related-posts'
import SeriesNavigation from 'components/blog/series-navigation'
import StickyPostHeader from 'components/blog/sticky-post-header'
import TableOfContents from 'components/blog/table-of-contents'
import mdxComponents from 'components/mdx/mdx-components'
import {
  formatDate,
  getArticleDateTime,
  getArticleModifiedTime,
  getBlogPost,
  getBlogPosts,
  getRelatedPosts,
  getSeriesPosts,
  getTagPath,
  SCHEDULED_CONTENT_PREVIEW_ENABLED,
} from 'lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

const WHITESPACE_REGEX = /\s+/
const HEADING_REGEX = /^(#{2,3})\s+(.+)$/gm
export const revalidate = 300
export const dynamicParams = true

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

const getWordCount = (content: string): number =>
  content
    .split(WHITESPACE_REGEX)
    .map((word) => word.trim())
    .filter(Boolean).length

const extractHeadings = (content: string) => {
  const headings: { level: number; text: string; id: string }[] = []

  // Strip fenced code blocks so we don't pick up headings from code examples
  const stripped = content.replace(/```[\s\S]*?```/g, '')

  let match = HEADING_REGEX.exec(stripped)
  while (match) {
    const level = match[1].length
    const text = match[2]
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    headings.push({ level, text, id })
    match = HEADING_REGEX.exec(stripped)
  }
  return headings
}

export const generateStaticParams = () => {
  const posts = getBlogPosts({ includeScheduled: SCHEDULED_CONTENT_PREVIEW_ENABLED })
  return posts.map((post) => ({ slug: post.slug }))
}

export const generateMetadata = async ({ params }: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.summary || `${post.title} - A blog post by Anmol Mahatpurkar`,
    alternates: {
      canonical: `/blog/${slug}`,
      types: {
        'text/markdown': `/api/blog/${slug}/raw`,
        'application/rss+xml': '/feed.xml',
        'application/feed+json': '/feed.json',
      },
    },
    openGraph: {
      title: post.title,
      description: post.summary || `${post.title} - A blog post by Anmol Mahatpurkar`,
      type: 'article',
      publishedTime: getArticleDateTime(post),
      modifiedTime: getArticleModifiedTime(post),
      url: `https://anm.dev/blog/${slug}`,
      authors: ['Anmol Mahatpurkar'],
      tags: post.tags,
      section: 'Frontend Engineering',
      locale: 'en_US',
      siteName: 'anmdotdev',
      images: [
        {
          url: `https://anm.dev/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || `${post.title} - A blog post by Anmol Mahatpurkar`,
      creator: '@anmdotdev',
      site: '@anmdotdev',
      images: [
        {
          url: `https://anm.dev/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        },
      ],
    },
    ...(post.scheduled
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  }
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)
  const includeScheduledSeriesPreview = post.scheduled
  const relatedPosts = getRelatedPosts(slug, post.tags, 3, {
    includeScheduled: includeScheduledSeriesPreview,
  })
  const seriesPosts = post.series
    ? getSeriesPosts(post.series, {
        includeScheduled: includeScheduledSeriesPreview,
      })
    : []
  const wordCount = getWordCount(post.plainText)

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: {
                dark: 'github-dark-dimmed',
                light: 'github-light-high-contrast',
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  })

  const dateModified = getArticleModifiedTime(post)
  const lastModifiedLabel =
    post.lastModified && post.lastModified !== post.date ? formatDate(post.lastModified) : undefined
  const lastModifiedTime =
    post.lastModified && post.lastModified !== post.date ? post.lastModifiedTime : undefined

  const hasToc = headings.length > 2

  return (
    <>
      <ReadingProgress />
      <ReactionsProvider slug={slug}>
        <div className="relative mx-auto mt-4 max-w-5xl border-gray-lighter border-t px-6 pt-10 pb-16 dark:border-dark-border">
          <article
            data-article-date={post.date}
            data-article-reading-time={post.readingTime}
            data-article-slug={slug}
            data-article-tags={post.tags.join(',')}
            data-article-type="blog-post"
            data-article-word-count={wordCount}
          >
            <StickyPostHeader
              dateLabel={formatDate(post.date)}
              dateTime={getArticleDateTime(post)}
              draft={post.draft}
              lastModifiedLabel={lastModifiedLabel}
              lastModifiedTime={lastModifiedTime}
              readingTime={post.readingTime}
              scheduledPreviewLabel={post.scheduled ? formatDate(post.date) : undefined}
              slug={slug}
              tags={post.tags.map((tag) => ({ href: getTagPath(tag), label: tag }))}
              title={post.title}
            />

            <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:items-start xl:gap-10">
              <div className="min-w-0">
                {hasToc && <TableOfContents headings={headings} variant="mobile" />}

                <div className="prose">{content}</div>

                {seriesPosts.length > 0 && (
                  <SeriesNavigation currentSlug={slug} posts={seriesPosts} />
                )}

                <PostFooterActions slug={slug} title={post.title} />
                <Comments slug={slug} />

                {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
              </div>

              {hasToc && <TableOfContents headings={headings} variant="desktop" />}
            </div>
          </article>

          <script
            /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                '@id': `https://anm.dev/blog/${slug}#article`,
                headline: post.title,
                datePublished: getArticleDateTime(post),
                dateModified,
                dateCreated: getArticleDateTime(post),
                author: {
                  '@type': 'Person',
                  '@id': 'https://anm.dev/#person',
                  name: 'Anmol Mahatpurkar',
                  url: 'https://anm.dev',
                },
                publisher: {
                  '@type': 'Person',
                  '@id': 'https://anm.dev/#person',
                  name: 'Anmol Mahatpurkar',
                  url: 'https://anm.dev',
                },
                description: post.summary,
                url: `https://anm.dev/blog/${slug}`,
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://anm.dev/blog/${slug}`,
                },
                isPartOf: [
                  {
                    '@type': 'WebSite',
                    '@id': 'https://anm.dev/#website',
                  },
                  ...(post.series
                    ? [
                        {
                          '@type': 'CreativeWorkSeries',
                          '@id': `https://anm.dev/blog#series-${post.series}`,
                          name: post.seriesTitle || post.series,
                          url: 'https://anm.dev/blog',
                        },
                      ]
                    : []),
                ],
                ...(post.seriesOrder == null ? {} : { position: post.seriesOrder }),
                image: `https://anm.dev/blog/${slug}/opengraph-image`,
                thumbnailUrl: `https://anm.dev/blog/${slug}/opengraph-image`,
                wordCount,
                keywords: post.tags,
                inLanguage: 'en-US',
                articleSection: 'Frontend Engineering',
                speakable: {
                  '@type': 'SpeakableSpecification',
                  cssSelector: ['article h1', 'article header', '.prose'],
                },
              }),
            }}
            type="application/ld+json"
          />
          <script
            /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
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
                    name: post.title,
                    item: `https://anm.dev/blog/${slug}`,
                  },
                ],
              }),
            }}
            type="application/ld+json"
          />
        </div>
      </ReactionsProvider>
    </>
  )
}

export default BlogPostPage
