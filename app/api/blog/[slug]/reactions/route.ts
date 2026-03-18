import { getBlogPost } from 'lib/blog'
import { addLike, addView, getReactionCounts, hasDisliked, toggleDislike } from 'lib/db'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export const GET = async (_request: Request, { params }: RouteParams) => {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const counts = await getReactionCounts(slug)
  const fingerprint = new URL(_request.url).searchParams.get('fingerprint')
  const userDisliked = fingerprint ? await hasDisliked(slug, fingerprint) : false

  return NextResponse.json(
    { ...counts, userDisliked },
    { headers: { 'Cache-Control': 'no-cache' } },
  )
}

export const POST = async (request: Request, { params }: RouteParams) => {
  try {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = (await request.json()) as { type?: string; fingerprint?: string }

    if (!body.type) {
      return NextResponse.json({ error: 'Missing type' }, { status: 400 })
    }

    if (body.type === 'view') {
      const result = await addView(slug)
      return NextResponse.json(result)
    }

    if (!body.fingerprint) {
      return NextResponse.json({ error: 'Missing fingerprint' }, { status: 400 })
    }

    if (body.type === 'like') {
      const result = await addLike(slug, body.fingerprint)
      return NextResponse.json(result)
    }

    if (body.type === 'dislike') {
      const result = await toggleDislike(slug, body.fingerprint)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Type must be "like", "dislike", or "view"' },
      { status: 400 },
    )
  } catch (error) {
    console.error('Reactions POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
