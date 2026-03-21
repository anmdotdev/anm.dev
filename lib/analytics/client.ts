import { ensureAnalyticsInitialized } from 'lib/analytics/browser-init'
import { READING_TIME_MINUTES_REGEX, SITE_ORIGIN } from 'lib/analytics/constants'
import posthog from 'lib/analytics/posthog-browser'

type AnalyticsPrimitive = boolean | number | string

type AnalyticsProperties = Record<string, AnalyticsPrimitive | null | undefined>

const withDefaults = (properties?: AnalyticsProperties): Record<string, AnalyticsPrimitive> => {
  const baseProperties: Record<string, AnalyticsPrimitive> = {
    environment: process.env.NODE_ENV ?? 'unknown',
  }

  if (!properties) {
    return baseProperties
  }

  for (const [key, value] of Object.entries(properties)) {
    if (value == null) {
      continue
    }

    baseProperties[key] = value
  }

  return baseProperties
}

export const isAnalyticsEnabled = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST)

const canCaptureAnalytics = (): boolean => isAnalyticsEnabled() && ensureAnalyticsInitialized()

export const captureAnalyticsEvent = (
  eventName: string,
  properties?: AnalyticsProperties,
): void => {
  if (!canCaptureAnalytics()) {
    return
  }

  posthog.capture(eventName, withDefaults(properties))
}

export const captureAnalyticsException = (
  error: unknown,
  properties?: AnalyticsProperties,
): void => {
  if (!canCaptureAnalytics()) {
    return
  }

  posthog.captureException(error, withDefaults(properties))
}

export const identifyAnalyticsUser = (
  distinctId: string,
  properties?: AnalyticsProperties,
): void => {
  if (!(canCaptureAnalytics() && distinctId)) {
    return
  }

  posthog.identify(distinctId, withDefaults(properties))
}

export const getAnalyticsHeaders = (): HeadersInit => {
  if (!canCaptureAnalytics()) {
    return {}
  }

  const distinctId = posthog.get_distinct_id()
  const sessionId = posthog.get_session_id()

  return {
    ...(distinctId ? { 'x-posthog-distinct-id': distinctId } : {}),
    ...(sessionId ? { 'x-posthog-session-id': sessionId } : {}),
  }
}

const parseReadingTimeMinutes = (readingTime: string): number | undefined => {
  const match = readingTime.match(READING_TIME_MINUTES_REGEX)
  if (!match) {
    return undefined
  }

  return Number.parseInt(match[1], 10)
}

const getReferrerType = (referrerUrl: URL): string =>
  referrerUrl.origin === window.location.origin ? 'internal' : 'external'

export const getReferrerAnalyticsContext = (): AnalyticsProperties => {
  if (!(typeof document !== 'undefined' && document.referrer)) {
    return {}
  }

  try {
    const referrerUrl = new URL(document.referrer)
    return {
      referrer_domain: referrerUrl.hostname,
      referrer_path: referrerUrl.pathname,
      referrer_type: getReferrerType(referrerUrl),
    }
  } catch {
    return {}
  }
}

export const getPageCategoryFromSource = (source: string): string =>
  source.startsWith('blog') ? 'blog' : 'website'

export const getArticleAnalyticsContext = (article: HTMLElement | null): AnalyticsProperties => {
  if (!article) {
    return {}
  }

  const slug = article.getAttribute('data-article-slug') ?? undefined
  const readingTime = article.getAttribute('data-article-reading-time') ?? undefined
  const articleTags = article.getAttribute('data-article-tags')
  const wordCount = article.getAttribute('data-article-word-count')

  return {
    article_path: slug ? `/blog/${slug}` : undefined,
    article_type: article.getAttribute('data-article-type') ?? undefined,
    page_category: 'blog',
    page_name: slug ? `blog:${slug}` : undefined,
    post_slug: slug,
    post_tags: articleTags ?? undefined,
    post_url: slug ? `${SITE_ORIGIN}/blog/${slug}` : undefined,
    reading_time: readingTime,
    reading_time_minutes: readingTime ? parseReadingTimeMinutes(readingTime) : undefined,
    word_count: wordCount ? Number.parseInt(wordCount, 10) : undefined,
  }
}
