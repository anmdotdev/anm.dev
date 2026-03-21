import { type NextRequest, NextResponse } from 'next/server'

const BLOG_POST_REGEX = /^\/blog\/([^/]+)$/
const IS_VERCEL_PREVIEW = process.env.VERCEL_ENV === 'preview'

const applyPreviewNoindex = (response: NextResponse): NextResponse => {
  if (IS_VERCEL_PREVIEW) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  }

  return response
}

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const accept = request.headers.get('accept') || ''

  if (pathname.startsWith('/ingest')) {
    return NextResponse.next()
  }

  // Content negotiation for blog posts: serve markdown when requested
  const match = pathname.match(BLOG_POST_REGEX)
  if (match) {
    const slug = match[1]
    const prefersMarkdown =
      accept.includes('text/markdown') ||
      (accept.includes('text/plain') && !accept.includes('text/html'))

    if (prefersMarkdown) {
      return applyPreviewNoindex(
        NextResponse.rewrite(new URL(`/api/blog/${slug}/raw`, request.url)),
      )
    }
  }

  return applyPreviewNoindex(NextResponse.next())
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|ingest).*)'],
}
