import { type NextRequest, NextResponse } from 'next/server'

const BLOG_POST_REGEX = /^\/blog\/([^/]+)$/

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const accept = request.headers.get('accept') || ''

  // Content negotiation for blog posts: serve markdown when requested
  const match = pathname.match(BLOG_POST_REGEX)
  if (match) {
    const slug = match[1]
    const prefersMarkdown =
      accept.includes('text/markdown') ||
      (accept.includes('text/plain') && !accept.includes('text/html'))

    if (prefersMarkdown) {
      return NextResponse.rewrite(new URL(`/api/blog/${slug}/raw`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/blog/:slug',
}
