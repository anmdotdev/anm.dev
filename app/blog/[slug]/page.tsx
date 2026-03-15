import mdxComponents from 'components/mdx/mdx-components'
import Link from 'components/ui/link'
import { formatDate, getBlogPost, getBlogPosts } from 'lib/blog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
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
    title: `${post.title} - Anmol Mahatpurkar`,
    description: post.summary || `${post.title} - A blog post by Anmol Mahatpurkar`,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.summary || `${post.title} - A blog post by Anmol Mahatpurkar`,
      type: 'article',
      publishedTime: post.date,
      url: `https://anm.dev/blog/${slug}`,
      authors: ['Anmol Mahatpurkar'],
    },
    twitter: {
      card: 'summary',
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

  return (
    <article className="mx-auto mt-4 max-w-5xl border-gray-lighter border-t px-6 pt-10 pb-16 dark:border-dark-border">
      <nav aria-label="Breadcrumb" className="mb-6 text-gray text-xs dark:text-dark-text-muted">
        <Link className="hover:text-black dark:hover:text-dark-text" href="/blog" showIcon="never">
          Blogs
        </Link>
        <span aria-hidden="true" className="mx-1.5">
          /
        </span>
        <span className="text-black dark:text-dark-text">{post.title}</span>
      </nav>

      <header className="mb-10 border-gray-lighter border-b pb-8 dark:border-dark-border">
        <h1 className="mb-3 font-semibold text-2xl text-black leading-tight dark:text-dark-text">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-dark text-xs dark:text-dark-text-muted">
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

      <div className="prose">{content}</div>

      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              '@type': 'Person',
              name: 'Anmol Mahatpurkar',
              url: 'https://anm.dev',
            },
            description: post.summary,
            url: `https://anm.dev/blog/${slug}`,
          }),
        }}
        type="application/ld+json"
      />
    </article>
  )
}

export default BlogPostPage
