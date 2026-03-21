import { ANALYTICS_EVENTS } from 'lib/analytics/events'
import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import {
  captureServerAnalyticsEvent,
  captureServerAnalyticsException,
  getPostHogDistinctId,
  getPostHogSessionId,
} from 'lib/analytics/server'
import { getBlogPost } from 'lib/blog'
import { createComment, deleteComment, getComments } from 'lib/db'
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

  const comments = await getComments(slug)
  return NextResponse.json(
    { comments, count: comments.length },
    {
      headers: { 'Cache-Control': 'no-cache' },
    },
  )
}

export const POST = async (request: Request, { params }: RouteParams) => {
  const startedAt = Date.now()
  const distinctId = getPostHogDistinctId(request)
  const sessionId = getPostHogSessionId(request)

  after(async () => {
    await flushPostHogLogs()
  })

  try {
    const { slug } = await params
    const post = getBlogPost(slug)

    const getCommentProperties = (
      additionalProperties?: Record<string, boolean | number | string | null | undefined>,
    ) => ({
      $session_id: sessionId,
      page_category: 'blog',
      post_slug: slug,
      request_path: `/api/blog/${slug}/comments`,
      ...additionalProperties,
    })

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = (await request.json()) as {
      authorName?: string
      authorEmail?: string
      content?: string
      parentId?: number
      fingerprint?: string
    }

    if (!(body.authorName && body.content && body.fingerprint)) {
      await captureServerAnalyticsEvent({
        distinctId,
        event: ANALYTICS_EVENTS.blogCommentSubmissionFailed,
        properties: getCommentProperties({
          error_message: 'missing_required_fields',
          is_reply: Boolean(body.parentId),
        }),
      })
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: 'POST',
          http_route: `/api/blog/${slug}/comments`,
          http_status_code: 400,
          is_reply: Boolean(body.parentId),
          outcome: 'validation_error',
          post_slug: slug,
          posthog_distinct_id: distinctId,
          posthog_session_id: sessionId,
        },
        body: 'Comment request failed because required fields were missing',
        eventName: 'blog.comments.request.completed',
        level: 'WARN',
      })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const authorName = body.authorName.trim()
    const content = body.content.trim()

    if (authorName.length < 1 || authorName.length > 50) {
      await captureServerAnalyticsEvent({
        distinctId,
        event: ANALYTICS_EVENTS.blogCommentSubmissionFailed,
        properties: getCommentProperties({
          error_message: 'invalid_name_length',
          is_reply: Boolean(body.parentId),
        }),
      })
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: 'POST',
          http_route: `/api/blog/${slug}/comments`,
          http_status_code: 400,
          is_reply: Boolean(body.parentId),
          outcome: 'validation_error',
          post_slug: slug,
          posthog_distinct_id: distinctId,
          posthog_session_id: sessionId,
        },
        body: 'Comment request failed because the author name length was invalid',
        eventName: 'blog.comments.request.completed',
        level: 'WARN',
      })
      return NextResponse.json({ error: 'Name must be 1-50 characters' }, { status: 400 })
    }

    if (content.length < 1 || content.length > 2000) {
      await captureServerAnalyticsEvent({
        distinctId,
        event: ANALYTICS_EVENTS.blogCommentSubmissionFailed,
        properties: getCommentProperties({
          error_message: 'invalid_content_length',
          is_reply: Boolean(body.parentId),
        }),
      })
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: 'POST',
          http_route: `/api/blog/${slug}/comments`,
          http_status_code: 400,
          is_reply: Boolean(body.parentId),
          outcome: 'validation_error',
          post_slug: slug,
          posthog_distinct_id: distinctId,
          posthog_session_id: sessionId,
        },
        body: 'Comment request failed because the comment length was invalid',
        eventName: 'blog.comments.request.completed',
        level: 'WARN',
      })
      return NextResponse.json({ error: 'Comment must be 1-2000 characters' }, { status: 400 })
    }

    const comment = await createComment({
      slug,
      parentId: body.parentId ?? null,
      authorName,
      authorEmail: body.authorEmail?.trim(),
      content,
      fingerprint: body.fingerprint,
    })

    await captureServerAnalyticsEvent({
      distinctId,
      event: ANALYTICS_EVENTS.blogCommentSubmitted,
      properties: getCommentProperties({
        has_email: Boolean(body.authorEmail?.trim()),
        is_reply: Boolean(body.parentId),
      }),
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        has_email: Boolean(body.authorEmail?.trim()),
        http_method: 'POST',
        http_route: `/api/blog/${slug}/comments`,
        http_status_code: 201,
        is_reply: Boolean(body.parentId),
        outcome: 'success',
        post_slug: slug,
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
      },
      body: 'Comment request completed successfully',
      eventName: 'blog.comments.request.completed',
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    const { slug } = await params
    await captureServerAnalyticsException({
      distinctId,
      error,
      properties: {
        $session_id: sessionId,
        page_category: 'blog',
        post_slug: slug,
        request_path: `/api/blog/${slug}/comments`,
        source: 'comment_post_api',
      },
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        error_message: error instanceof Error ? error.message : 'comment_post_failed',
        http_method: 'POST',
        http_route: `/api/blog/${slug}/comments`,
        http_status_code: 500,
        outcome: 'error',
        post_slug: slug,
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
      },
      body: 'Comment request failed unexpectedly',
      eventName: 'blog.comments.request.completed',
      level: 'ERROR',
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const DELETE = async (request: Request, { params }: RouteParams) => {
  const startedAt = Date.now()
  const { slug } = await params
  const post = getBlogPost(slug)
  const distinctId = getPostHogDistinctId(request)
  const sessionId = getPostHogSessionId(request)

  after(async () => {
    await flushPostHogLogs()
  })

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = (await request.json()) as { id?: number; fingerprint?: string }

  if (!(body.id && body.fingerprint)) {
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: 'DELETE',
        http_route: `/api/blog/${slug}/comments`,
        http_status_code: 400,
        outcome: 'validation_error',
        post_slug: slug,
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
      },
      body: 'Comment delete request failed because the id or fingerprint was missing',
      eventName: 'blog.comments.delete.request.completed',
      level: 'WARN',
    })
    return NextResponse.json({ error: 'Missing id or fingerprint' }, { status: 400 })
  }

  const deleted = await deleteComment(body.id, body.fingerprint)
  if (!deleted) {
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: 'DELETE',
        http_route: `/api/blog/${slug}/comments`,
        http_status_code: 403,
        outcome: 'forbidden',
        post_slug: slug,
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
      },
      body: 'Comment delete request was rejected because the comment was not found or authorized',
      eventName: 'blog.comments.delete.request.completed',
      level: 'WARN',
    })
    return NextResponse.json({ error: 'Comment not found or not authorized' }, { status: 403 })
  }

  await captureServerAnalyticsEvent({
    distinctId,
    event: ANALYTICS_EVENTS.blogCommentDeleted,
    properties: {
      $session_id: sessionId,
      page_category: 'blog',
      post_slug: slug,
      request_path: `/api/blog/${slug}/comments`,
    },
  })
  emitBackendLog({
    attributes: {
      duration_ms: Date.now() - startedAt,
      http_method: 'DELETE',
      http_route: `/api/blog/${slug}/comments`,
      http_status_code: 200,
      outcome: 'success',
      post_slug: slug,
      posthog_distinct_id: distinctId,
      posthog_session_id: sessionId,
    },
    body: 'Comment delete request completed successfully',
    eventName: 'blog.comments.delete.request.completed',
  })

  return NextResponse.json({ success: true })
}
