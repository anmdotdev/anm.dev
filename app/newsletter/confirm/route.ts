import { ANALYTICS_EVENTS } from 'lib/analytics/events'
import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import {
  captureServerAnalyticsEvent,
  getPostHogDistinctIdFromCookieHeader,
  getPostHogSessionIdFromCookieHeader,
} from 'lib/analytics/server'
import { confirmNewsletterSubscription } from 'lib/newsletter'
import { after, NextResponse } from 'next/server'

const createRedirectResponse = (request: Request, status: string) =>
  NextResponse.redirect(new URL(`/blog?newsletter=${status}#newsletter`, request.url))

export const GET = async (request: Request) => {
  const startedAt = Date.now()
  const url = new URL(request.url)
  const token = url.searchParams.get('token')?.trim()
  const posthogDistinctId = getPostHogDistinctIdFromCookieHeader(
    request.headers.get('cookie') ?? undefined,
  )
  const posthogSessionId = getPostHogSessionIdFromCookieHeader(
    request.headers.get('cookie') ?? undefined,
  )

  after(async () => {
    await flushPostHogLogs()
  })

  const baseAttributes = {
    duration_ms: 0,
    has_token: Boolean(token),
    http_method: 'GET',
    http_route: url.pathname,
    posthog_distinct_id: posthogDistinctId,
  }

  if (!token) {
    emitBackendLog({
      attributes: {
        ...baseAttributes,
        duration_ms: Date.now() - startedAt,
        http_status_code: 302,
        outcome: 'invalid_token',
      },
      body: 'Newsletter confirmation request redirected because token was missing',
      eventName: 'newsletter.confirm.request.completed',
      level: 'WARN',
    })
    return createRedirectResponse(request, 'invalid-token')
  }

  try {
    const result = await confirmNewsletterSubscription(token)

    if (result.status === 'confirmed') {
      await captureServerAnalyticsEvent({
        distinctId: result.subscriberAnalyticsId ?? posthogDistinctId,
        event: ANALYTICS_EVENTS.newsletterSignupConfirmed,
        properties: {
          ...(posthogDistinctId ? { $anon_distinct_id: posthogDistinctId } : {}),
          $session_id: posthogSessionId,
          confirmation_status: result.status,
          page_category: result.source?.startsWith('blog') ? 'blog' : 'website',
          request_path: url.pathname,
          signup_source: result.source,
        },
      })
      emitBackendLog({
        attributes: {
          ...baseAttributes,
          duration_ms: Date.now() - startedAt,
          http_status_code: 302,
          outcome: 'confirmed',
        },
        body: 'Newsletter confirmation request completed successfully',
        eventName: 'newsletter.confirm.request.completed',
      })
      return createRedirectResponse(request, 'confirmed')
    }

    if (result.status === 'already-confirmed') {
      await captureServerAnalyticsEvent({
        distinctId: result.subscriberAnalyticsId ?? posthogDistinctId,
        event: ANALYTICS_EVENTS.newsletterSignupConfirmed,
        properties: {
          ...(posthogDistinctId ? { $anon_distinct_id: posthogDistinctId } : {}),
          $session_id: posthogSessionId,
          confirmation_status: result.status,
          page_category: result.source?.startsWith('blog') ? 'blog' : 'website',
          request_path: url.pathname,
          signup_source: result.source,
        },
      })
      emitBackendLog({
        attributes: {
          ...baseAttributes,
          duration_ms: Date.now() - startedAt,
          http_status_code: 302,
          outcome: 'already_confirmed',
        },
        body: 'Newsletter confirmation request completed for an already confirmed subscriber',
        eventName: 'newsletter.confirm.request.completed',
      })
      return createRedirectResponse(request, 'already-confirmed')
    }

    emitBackendLog({
      attributes: {
        ...baseAttributes,
        duration_ms: Date.now() - startedAt,
        http_status_code: 302,
        outcome: 'invalid_token',
      },
      body: 'Newsletter confirmation request redirected because token was invalid',
      eventName: 'newsletter.confirm.request.completed',
      level: 'WARN',
    })
    return createRedirectResponse(request, 'invalid-token')
  } catch (error) {
    emitBackendLog({
      attributes: {
        ...baseAttributes,
        duration_ms: Date.now() - startedAt,
        error_message: error instanceof Error ? error.message : 'confirm_error',
        http_status_code: 302,
        outcome: 'error',
      },
      body: 'Newsletter confirmation request failed',
      eventName: 'newsletter.confirm.request.completed',
      level: 'ERROR',
    })
    return createRedirectResponse(request, 'confirm-error')
  }
}
