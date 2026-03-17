import Link from 'components/ui/link'
import { formatDate, getBlogPosts } from 'lib/blog'
import type { Metadata } from 'next'

const formatMonthYear = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

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

  const sections: { label: string; posts: typeof posts }[] = []
  for (const post of posts) {
    const label = formatMonthYear(post.date)
    const currentSection = sections.at(-1)

    if (!currentSection || currentSection.label !== label) {
      sections.push({
        label,
        posts: [post],
      })
      continue
    }

    currentSection.posts.push(post)
  }

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
          {sections.map((section) => (
            <div key={section.label}>
              <h2 className="mb-4 font-semibold text-gray-dark text-xs uppercase tracking-wider dark:text-dark-text-muted">
                {section.label}
              </h2>
              <div className="divide-y divide-gray-lighter dark:divide-dark-border">
                {section.posts.map((post) => (
                  <article key={post.slug}>
                    <Link
                      className="group/post !flex !items-start !no-underline flex-col gap-1 py-4"
                      href={`/blog/${post.slug}`}
                      showIcon="never"
                    >
                      <span className="flex items-center gap-2 font-medium text-black text-sm group-hover/post:underline dark:text-dark-text">
                        {post.title}
                        {post.draft && (
                          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 font-medium text-[10px] text-amber-800 uppercase leading-none dark:bg-amber-900/30 dark:text-amber-400">
                            Draft
                          </span>
                        )}
                        {post.scheduled && (
                          <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 font-medium text-[10px] text-blue-800 uppercase leading-none dark:bg-blue-900/30 dark:text-blue-400">
                            Scheduled
                          </span>
                        )}
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
