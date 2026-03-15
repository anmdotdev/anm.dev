import Link from 'components/ui/link'
import { formatDate, getBlogPosts } from 'lib/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Anmol Mahatpurkar (@anmdotdev)',
  description:
    'Thoughts on frontend engineering, TypeScript, React, developer tools, AI prompts, and building for the web.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog - Anmol Mahatpurkar (@anmdotdev)',
    description:
      'Thoughts on frontend engineering, TypeScript, React, developer tools, AI prompts, and building for the web.',
    url: 'https://anm.dev/blog',
  },
}

const BlogPage = () => {
  const posts = getBlogPosts()

  const postsByYear: Record<string, typeof posts> = {}
  for (const post of posts) {
    const year = new Date(post.date).getFullYear().toString()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  }

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://anm.dev/blog#blog',
    name: 'Blog - Anmol Mahatpurkar',
    description:
      'Thoughts on frontend engineering, TypeScript, React, developer tools, AI prompts, and building for the web.',
    url: 'https://anm.dev/blog',
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
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': `https://anm.dev/blog/${post.slug}#article`,
      headline: post.title,
      datePublished: post.date,
      url: `https://anm.dev/blog/${post.slug}`,
      description: post.summary,
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        '@id': 'https://anm.dev/#person',
      },
    })),
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
    ],
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-8 pb-24">
      <h1 className="mb-2 font-semibold text-2xl text-black dark:text-dark-text">Blog</h1>
      <p className="mb-12 text-gray-dark text-sm dark:text-dark-text-secondary">
        Writing about web dev, developer tools, and building in the modern AI era.
      </p>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-gray-dark text-sm dark:text-dark-text-secondary">
            Coming soon. Stay tuned.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <div key={year}>
              <h2 className="mb-4 font-semibold text-gray-dark text-xs uppercase tracking-wider dark:text-dark-text-muted">
                {year}
              </h2>
              <div className="divide-y divide-gray-lighter dark:divide-dark-border">
                {postsByYear[year].map((post) => (
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
            </div>
          ))}
        </div>
      )}
      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogJsonLd),
        }}
        type="application/ld+json"
      />
      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
        type="application/ld+json"
      />
    </section>
  )
}

export default BlogPage
