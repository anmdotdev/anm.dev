import { ANALYTICS_EVENTS } from 'lib/analytics/events'
import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import {
  captureServerAnalyticsEvent,
  getPostHogDistinctId,
  getPostHogSessionId,
} from 'lib/analytics/server'
import { subscribeToNewsletter } from 'lib/newsletter'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

interface SubscribeRequestBody {
  company?: string
  email?: string
  source?: string
}

const getRequestIpAddress = (request: NextRequest): string | null => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null
  }

  return request.headers.get('x-real-ip')
}

export const POST = async (request: NextRequest) => {
  const startedAt = Date.now()
  const body = (await request.json().catch(() => null)) as SubscribeRequestBody | null
  const distinctId = getPostHogDistinctId(request)
  const sessionId = getPostHogSessionId(request)

  after(async () => {
    await flushPostHogLogs()
  })

  const getNewsletterProperties = (
    signupSource: string,
    additionalProperties?: Record<string, boolean | number | string | null | undefined>,
  ) => ({
    $session_id: sessionId,
    page_category: signupSource.startsWith('blog') ? 'blog' : 'website',
    request_path: request.nextUrl.pathname,
    signup_source: signupSource,
    ...additionalProperties,
  })

  if (!body) {
    await captureServerAnalyticsEvent({
      distinctId,
      event: ANALYTICS_EVENTS.newsletterSignupFailed,
      properties: getNewsletterProperties('website', {
        error_message: 'invalid_request_body',
      }),
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 400,
        outcome: 'validation_error',
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
      },
      body: 'Newsletter subscribe request failed because the request body was invalid',
      eventName: 'newsletter.subscribe.request.completed',
      level: 'WARN',
    })
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (body.company?.trim()) {
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 200,
        outcome: 'bot_blocked',
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
        signup_source: body.source?.trim() || 'website',
      },
      body: 'Newsletter subscribe request matched honeypot validation',
      eventName: 'newsletter.subscribe.request.completed',
      level: 'WARN',
    })
    return Response.json(
      {
        message: 'If this email can receive updates, a confirmation link is on its way.',
      },
      { status: 200 },
    )
  }

  if (!body.email?.trim()) {
    await captureServerAnalyticsEvent({
      distinctId,
      event: ANALYTICS_EVENTS.newsletterSignupFailed,
      properties: getNewsletterProperties(body.source?.trim() || 'website', {
        error_message: 'email_required',
      }),
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 400,
        outcome: 'validation_error',
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
        signup_source: body.source?.trim() || 'website',
      },
      body: 'Newsletter subscribe request failed because email was missing',
      eventName: 'newsletter.subscribe.request.completed',
      level: 'WARN',
    })
    return Response.json({ error: 'Email is required.' }, { status: 400 })
  }

  const signupSource = body.source?.trim() || 'website'

  try {
    const result = await subscribeToNewsletter({
      email: body.email,
      ipAddress: getRequestIpAddress(request),
      source: signupSource,
    })

    await captureServerAnalyticsEvent({
      distinctId,
      event: ANALYTICS_EVENTS.newsletterSignupSucceeded,
      properties: getNewsletterProperties(signupSource, {
        signup_status: 'pending_confirmation',
      }),
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 200,
        outcome: 'success',
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
        signup_source: signupSource,
      },
      body: 'Newsletter subscribe request completed successfully',
      eventName: 'newsletter.subscribe.request.completed',
    })

    return Response.json(result, { status: 200 })
  } catch (error) {
    await captureServerAnalyticsEvent({
      distinctId,
      event: ANALYTICS_EVENTS.newsletterSignupFailed,
      properties: getNewsletterProperties(signupSource, {
        error_message: error instanceof Error ? error.message : 'subscribe_failed',
      }),
    })
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        error_message: error instanceof Error ? error.message : 'subscribe_failed',
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 400,
        outcome: 'error',
        posthog_distinct_id: distinctId,
        posthog_session_id: sessionId,
        signup_source: signupSource,
      },
      body: 'Newsletter subscribe request failed',
      eventName: 'newsletter.subscribe.request.completed',
      level: 'ERROR',
    })

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to subscribe right now.',
      },
      { status: 400 },
    )
  }
}
