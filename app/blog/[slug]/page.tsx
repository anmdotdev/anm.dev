import CopyPageMenu from 'components/blog/copy-page-menu'
import ReadingProgress from 'components/blog/reading-progress'
import RelatedPosts from 'components/blog/related-posts'
import TableOfContents from 'components/blog/table-of-contents'
import mdxComponents from 'components/mdx/mdx-components'
import Link from 'components/ui/link'
import { formatDate, getBlogPost, getBlogPosts, getRelatedPosts } from 'lib/blog'
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
  let match = HEADING_REGEX.exec(content)
  while (match) {
    const level = match[1].length
    const text = match[2]
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    headings.push({ level, text, id })
    match = HEADING_REGEX.exec(content)
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

  return (
    <>
      <ReadingProgress />
      <article
        className="mx-auto mt-4 max-w-5xl border-gray-lighter border-t px-6 pt-10 pb-16 dark:border-dark-border"
        data-article-date={post.date}
        data-article-slug={slug}
        data-article-type="blog-post"
      >
        <div className="mb-6 flex items-center justify-between">
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
          <CopyPageMenu slug={slug} title={post.title} />
        </div>

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
                <span>{post.tags.join(', ')}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>Anmol Mahatpurkar</span>
          </div>
        </header>

        {headings.length > 2 && <TableOfContents headings={headings} />}

        <div className="prose">{content}</div>

        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}

        <script
          /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              datePublished: post.date,
              dateModified,
              author: {
                '@type': 'Person',
                name: 'Anmol Mahatpurkar',
                url: 'https://anm.dev',
              },
              publisher: {
                '@type': 'Person',
                name: 'Anmol Mahatpurkar',
                url: 'https://anm.dev',
              },
              description: post.summary,
              url: `https://anm.dev/blog/${slug}`,
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://anm.dev/blog/${slug}`,
              },
              image: `https://anm.dev/blog/${slug}/opengraph-image`,
              wordCount: post.content.split(WHITESPACE_REGEX).length,
              keywords: post.tags,
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
      </article>
    </>
  )
}

export default BlogPostPage
