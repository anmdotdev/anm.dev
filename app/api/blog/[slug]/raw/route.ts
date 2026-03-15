import { formatDate, getBlogPost } from 'lib/blog'

interface RawRouteParams {
  params: Promise<{ slug: string }>
}

export const GET = async (_request: Request, { params }: RawRouteParams) => {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return new Response('Not found', { status: 404 })
  }

  const markdown = `# ${post.title}

> By Anmol Mahatpurkar | ${formatDate(post.date)} | ${post.readingTime}
> Tags: ${post.tags.join(', ')}
> Source: https://anm.dev/blog/${slug}

${post.summary ? `**${post.summary}**\n\n---\n` : ''}
${post.content}`

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  })
}
