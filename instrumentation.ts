import { initializePostHogLogs } from 'lib/analytics/logs'
import {
  captureServerAnalyticsException,
  getPostHogDistinctIdFromCookieHeader,
} from 'lib/analytics/server'
import type { Instrumentation } from 'next'

export const register = () => {
  // PostHog server error capture is handled in onRequestError.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    initializePostHogLogs()
  }
}

const getHeaderValue = (headerValue?: string | string[]): string | undefined => {
  if (Array.isArray(headerValue)) {
    return headerValue[0]?.trim() || undefined
  }

  return headerValue?.trim() || undefined
}

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return
  }

  const distinctId =
    getHeaderValue(request.headers['x-posthog-distinct-id']) ??
    getPostHogDistinctIdFromCookieHeader(request.headers.cookie)

  await captureServerAnalyticsException({
    distinctId,
    error,
    properties: {
      render_source: context.renderSource,
      request_method: request.method,
      request_path: request.path,
      revalidate_reason: context.revalidateReason,
      route_kind: context.routerKind,
      route_path: context.routePath,
      route_type: context.routeType,
      source: 'nextjs_on_request_error',
    },
  })
}
