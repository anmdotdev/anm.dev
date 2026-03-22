import { getNewsletterSubscriberAnalyticsId } from 'lib/analytics/constants'
import { PostHog } from 'posthog-node'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const POSTHOG_COOKIE_REGEX = /ph_phc_.*?_posthog=([^;]+)/

let posthogServerClient: PostHog | null = null

type AnalyticsPrimitive = boolean | number | string
type AnalyticsProperties = Record<string, AnalyticsPrimitive | null | undefined>

interface PostHogCookieData {
  $sesid?: unknown
  distinct_id?: unknown
}

const withDefaults = (properties?: AnalyticsProperties): Record<string, AnalyticsPrimitive> => {
  const nextProperties: Record<string, AnalyticsPrimitive> = {
    environment: process.env.NODE_ENV ?? 'unknown',
  }

  if (!properties) {
    return nextProperties
  }

  for (const [key, value] of Object.entries(properties)) {
    if (value == null) {
      continue
    }

    nextProperties[key] = value
  }

  return nextProperties
}

const getServerPostHog = (): PostHog | null => {
  if (!(posthogKey && posthogHost)) {
    return null
  }

  if (posthogServerClient) {
    return posthogServerClient
  }

  posthogServerClient = new PostHog(posthogKey, {
    flushAt: 1,
    flushInterval: 0,
    host: posthogHost,
  })

  return posthogServerClient
}

const getRequestHeader = (request: Request, headerName: string): string | undefined => {
  const value = request.headers.get(headerName)?.trim()
  return value ? value : undefined
}

const normalizeHeaderValue = (headerValue?: string | string[]): string | undefined => {
  if (Array.isArray(headerValue)) {
    return headerValue.join('; ')
  }

  const value = headerValue?.trim()
  return value ? value : undefined
}

const normalizeCookieStringValue = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmedValue = value.trim()
  return trimmedValue ? trimmedValue : undefined
}

const normalizePostHogSessionId = (sessionValue: unknown): string | undefined => {
  if (typeof sessionValue === 'string') {
    return normalizeCookieStringValue(sessionValue)
  }

  if (!Array.isArray(sessionValue)) {
    return undefined
  }

  return normalizeCookieStringValue(sessionValue[1])
}

const getPostHogCookieDataFromCookieHeader = (
  cookieHeader?: string | string[],
): PostHogCookieData | null => {
  const normalizedCookieHeader = normalizeHeaderValue(cookieHeader)
  if (!normalizedCookieHeader) {
    return null
  }

  const postHogCookieMatch = normalizedCookieHeader.match(POSTHOG_COOKIE_REGEX)
  if (!postHogCookieMatch?.[1]) {
    return null
  }

  try {
    const decodedCookie = decodeURIComponent(postHogCookieMatch[1])
    return JSON.parse(decodedCookie) as PostHogCookieData
  } catch {
    return null
  }
}

export const getPostHogDistinctIdFromCookieHeader = (
  cookieHeader?: string | string[],
): string | undefined =>
  normalizeCookieStringValue(getPostHogCookieDataFromCookieHeader(cookieHeader)?.distinct_id)

export const getPostHogSessionIdFromCookieHeader = (
  cookieHeader?: string | string[],
): string | undefined =>
  normalizePostHogSessionId(getPostHogCookieDataFromCookieHeader(cookieHeader)?.$sesid)

export const getPostHogDistinctId = (request: Request): string | undefined =>
  getPostHogDistinctIdFromCookieHeader(request.headers.get('cookie') ?? undefined) ??
  getRequestHeader(request, 'x-posthog-distinct-id')

export const getPostHogSessionId = (request: Request): string | undefined =>
  getPostHogSessionIdFromCookieHeader(request.headers.get('cookie') ?? undefined) ??
  getRequestHeader(request, 'x-posthog-session-id')

export const getNewsletterAnalyticsDistinctId = (subscriberId: number | string): string =>
  getNewsletterSubscriberAnalyticsId(subscriberId)

export const captureServerAnalyticsEvent = async (input: {
  distinctId?: string
  event: string
  properties?: AnalyticsProperties
}): Promise<void> => {
  const client = getServerPostHog()
  if (!(client && input.distinctId)) {
    return
  }

  await client.captureImmediate({
    distinctId: input.distinctId,
    event: input.event,
    properties: withDefaults(input.properties),
  })
}

export const captureServerAnalyticsException = async (input: {
  distinctId?: string
  error: unknown
  properties?: AnalyticsProperties
}): Promise<void> => {
  const client = getServerPostHog()
  if (!client) {
    return
  }

  await client.captureExceptionImmediate(
    input.error,
    input.distinctId,
    withDefaults(input.properties),
  )
}
