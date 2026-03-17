import Comments from 'components/blog/comments'
import CopyPageMenu from 'components/blog/copy-page-menu'
import PostFooterActions from 'components/blog/post-footer-actions'
import Reactions, { ReactionsProvider } from 'components/blog/reactions'
import ReadingProgress from 'components/blog/reading-progress'
import RelatedPosts from 'components/blog/related-posts'
import SeriesNavigation from 'components/blog/series-navigation'
import ShareButton from 'components/blog/share-button'
import TableOfContents from 'components/blog/table-of-contents'
import mdxComponents from 'components/mdx/mdx-components'
import Link from 'components/ui/link'
import { formatDate, getBlogPost, getBlogPosts, getRelatedPosts, getSeriesPosts } from 'lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

const WHITESPACE_REGEX = /\s+/
const HEADING_REGEX = /^(#{2,3})\s+(.+)$/gm

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

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
  const posts = getBlogPosts()
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
    keywords: post.tags,
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
      publishedTime: post.date,
      modifiedTime: post.lastModified || post.date,
      url: `https://anm.dev/blog/${slug}`,
      authors: ['Anmol Mahatpurkar'],
      tags: post.tags,
      section: 'Frontend Engineering',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || `${post.title} - A blog post by Anmol Mahatpurkar`,
    },
  }
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) {
    notFound()
  }

  const headings = extractHeadings(post.content)
  const relatedPosts = getRelatedPosts(slug, post.tags)
  const seriesPosts = post.series ? getSeriesPosts(post.series) : []

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
                light: 'github-light',
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  })

  const dateModified = post.lastModified || post.date

  const hasToc = headings.length > 2

  return (
    <>
      <ReadingProgress />
      <ReactionsProvider slug={slug}>
        <div className="relative mx-auto mt-4 max-w-5xl border-gray-lighter border-t px-6 pt-10 pb-24 dark:border-dark-border">
          <article
            data-article-date={post.date}
            data-article-reading-time={post.readingTime}
            data-article-slug={slug}
            data-article-tags={post.tags.join(',')}
            data-article-type="blog-post"
            data-article-word-count={post.content.split(WHITESPACE_REGEX).length}
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <nav aria-label="Breadcrumb" className="text-gray text-xs dark:text-dark-text-muted">
                <Link
                  className="hover:text-black dark:hover:text-dark-text"
                  href="/blog"
                  showIcon="never"
                >
                  Blogs
                </Link>
                <span aria-hidden="true" className="mx-1.5">
                  /
                </span>
                <span className="text-black dark:text-dark-text">{post.title}</span>
              </nav>
              <div className="flex shrink-0 items-center gap-1.5">
                <Reactions />
                <ShareButton slug={slug} />
                <CopyPageMenu slug={slug} title={post.title} />
              </div>
            </div>

            {post.draft && (
              <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
                This post is a draft and is only visible in development.
              </div>
            )}
            {post.scheduled && (
              <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 text-sm dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-400">
                This post is scheduled for {formatDate(post.date)} and is only visible in
                development.
              </div>
            )}

            <header className="mb-10 border-gray-lighter border-b pb-8 dark:border-dark-border">
              <h1 className="mb-3 font-semibold text-2xl text-black leading-tight dark:text-dark-text">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-dark text-xs dark:text-dark-text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime}</span>
                {post.tags.length > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      {post.tags.map((tag, index) => (
                        <span key={tag}>
                          <Link
                            className="hover:text-black dark:hover:text-dark-text"
                            href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                            showIcon="never"
                          >
                            {tag}
                          </Link>
                          {index < post.tags.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </>
                )}
                <span className="whitespace-nowrap">
                  <span aria-hidden="true" className="mr-2">
                    ·
                  </span>
                  <span>Anmol Mahatpurkar</span>
                </span>
              </div>
            </header>

            {hasToc && <TableOfContents headings={headings} variant="mobile" />}

            <div className="prose">{content}</div>

            {seriesPosts.length > 0 && <SeriesNavigation currentSlug={slug} posts={seriesPosts} />}

            <PostFooterActions slug={slug} />
            <Comments slug={slug} />

            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
          </article>

          {hasToc && <TableOfContents headings={headings} variant="desktop" />}

          <script
            /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                '@id': `https://anm.dev/blog/${slug}#article`,
                headline: post.title,
                datePublished: post.date,
                dateModified,
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
                isPartOf: {
                  '@type': 'WebSite',
                  '@id': 'https://anm.dev/#website',
                },
                image: `https://anm.dev/blog/${slug}/opengraph-image`,
                thumbnailUrl: `https://anm.dev/blog/${slug}/opengraph-image`,
                wordCount: post.content.split(WHITESPACE_REGEX).length,
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
