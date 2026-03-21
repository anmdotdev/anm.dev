import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import { captureServerAnalyticsException, getPostHogDistinctId } from 'lib/analytics/server'
import { getBlogPost } from 'lib/blog'
import { addLike, addView, getReactionCounts, hasDisliked, toggleDislike } from 'lib/db'
import { after, NextResponse } from 'next/server'

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
  const startedAt = Date.now()
  const distinctId = getPostHogDistinctId(request)

  after(async () => {
    await flushPostHogLogs()
  })

  try {
    const { slug } = await params
    const post = getBlogPost(slug)

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = (await request.json()) as { type?: string; fingerprint?: string }

    if (!body.type) {
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: 'POST',
          http_route: `/api/blog/${slug}/reactions`,
          http_status_code: 400,
          outcome: 'validation_error',
          post_slug: slug,
          posthog_distinct_id: distinctId,
        },
        body: 'Reaction request failed because type was missing',
        eventName: 'blog.reactions.request.completed',
        level: 'WARN',
      })
      return NextResponse.json({ error: 'Missing type' }, { status: 400 })
    }

    if (body.type === 'view') {
      const result = await addView(slug)
      return NextResponse.json(result)
    }

    if (!body.fingerprint) {
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: 'POST',
          http_route: `/api/blog/${slug}/reactions`,
          http_status_code: 400,
          outcome: 'validation_error',
          post_slug: slug,
          posthog_distinct_id: distinctId,
          reaction_type: body.type,
        },
        body: 'Reaction request failed because fingerprint was missing',
        eventName: 'blog.reactions.request.completed',
        level: 'WARN',
      })
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

    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: 'POST',
        http_route: `/api/blog/${slug}/reactions`,
        http_status_code: 400,
        outcome: 'validation_error',
        post_slug: slug,
        posthog_distinct_id: distinctId,
        reaction_type: body.type,
      },
      body: 'Reaction request failed because the reaction type was invalid',
      eventName: 'blog.reactions.request.completed',
      level: 'WARN',
    })
    return NextResponse.json(
      { error: 'Type must be "like", "dislike", or "view"' },
      { status: 400 },
    )
  } catch (error) {
    const { slug } = await params
    await captureServerAnalyticsException({
      distinctId,
      error,
      properties: {
        page_category: 'blog',
        post_slug: slug,
        request_path: `/api/blog/${slug}/reactions`,
        source: 'reaction_post_api',
      },
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        error_message: error instanceof Error ? error.message : 'reaction_request_failed',
        http_method: 'POST',
        http_route: `/api/blog/${slug}/reactions`,
        http_status_code: 500,
        outcome: 'error',
        post_slug: slug,
        posthog_distinct_id: distinctId,
      },
      body: 'Reaction request failed unexpectedly',
      eventName: 'blog.reactions.request.completed',
      level: 'ERROR',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
