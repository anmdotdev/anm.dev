import Link from 'components/ui/link'
import { formatDate, getAllTags, getBlogPosts } from 'lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export const generateStaticParams = () => {
  const tags = getAllTags()
  return tags.map((tag) => ({ tag: encodeURIComponent(tag.toLowerCase()) }))
}

export const generateMetadata = async ({ params }: TagPageProps): Promise<Metadata> => {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getBlogPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase()),
  )

  if (posts.length === 0) {
    return {}
  }

  const title = `Articles tagged "${decodedTag}"`
  const description = `Blog posts about ${decodedTag} by Anmol Mahatpurkar — frontend engineering, React, TypeScript, and more.`

  return {
    title,
    description,
    alternates: { canonical: `/blog/tag/${tag}` },
    openGraph: {
      title,
      description,
      url: `https://anm.dev/blog/tag/${tag}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

const TagPage = async ({ params }: TagPageProps) => {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getBlogPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase()),
  )

  if (posts.length === 0) {
    notFound()
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Articles tagged "${decodedTag}"`,
    description: `Blog posts about ${decodedTag} by Anmol Mahatpurkar.`,
    url: `https://anm.dev/blog/tag/${tag}`,
    author: {
      '@type': 'Person',
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
          datePublished: post.date,
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
        name: decodedTag,
        item: `https://anm.dev/blog/tag/${tag}`,
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
        <span className="text-black dark:text-dark-text">{decodedTag}</span>
      </nav>

      <h1 className="mb-2 font-semibold text-2xl text-black dark:text-dark-text">
        Tag: {decodedTag}
      </h1>
      <p className="mb-12 text-gray-dark text-sm dark:text-dark-text-secondary">
        {posts.length} {posts.length === 1 ? 'article' : 'articles'} tagged with "{decodedTag}"
      </p>

      <div className="divide-y divide-gray-lighter dark:divide-dark-border">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              className="group/post !flex !items-start !no-underline flex-col gap-1 py-4"
              href={`/blog/${post.slug}`}
              showIcon="never"
            >
              <span className="font-medium text-black text-sm group-hover/post:underline dark:text-dark-text">
                {post.title}
              </span>
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
