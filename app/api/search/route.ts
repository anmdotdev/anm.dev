import { getBlogPosts } from 'lib/blog'
import type { NextRequest } from 'next/server'

const WHITESPACE_REGEX = /\s+/

export const GET = (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get('q')?.trim().toLowerCase()

  if (!query) {
    return Response.json({ error: 'Missing query parameter "q"', results: [] }, { status: 400 })
  }

  const posts = getBlogPosts()
  const terms = query.split(WHITESPACE_REGEX)

  const scored = posts
    .map((post) => {
      const titleLower = post.title.toLowerCase()
      const summaryLower = (post.summary || '').toLowerCase()
      const contentLower = post.plainText.toLowerCase()
      const tagsLower = post.tags.map((t) => t.toLowerCase())

      let score = 0

      for (const term of terms) {
        if (titleLower.includes(term)) {
          score += 10
        }
        if (tagsLower.some((tag) => tag.includes(term))) {
          score += 5
        }
        if (summaryLower.includes(term)) {
          score += 3
        }
        if (contentLower.includes(term)) {
          score += 1
        }
      }

      return { post, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  const results = scored.map(({ post, score }) => ({
    title: post.title,
    slug: post.slug,
    url: `https://anm.dev/blog/${post.slug}`,
    summary: post.summary,
    date: post.date,
    readingTime: post.readingTime,
    tags: post.tags,
    markdownUrl: `https://anm.dev/api/blog/${post.slug}/raw`,
    score,
  }))

  return Response.json(
    {
      query,
      count: results.length,
      results,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    },
  )
}
