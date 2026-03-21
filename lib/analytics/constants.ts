export const DEFAULT_POSTHOG_PROXY_PATH = '/ingest'
export const NEWSLETTER_SUBSCRIBER_ANALYTICS_PREFIX = 'newsletter_subscriber'
export const READING_TIME_MINUTES_REGEX = /(\d+)/
export const SITE_ORIGIN = 'https://anm.dev'

export const getNewsletterSubscriberAnalyticsId = (subscriberId: number | string): string =>
  `${NEWSLETTER_SUBSCRIBER_ANALYTICS_PREFIX}:${subscriberId}`

export const getPostHogBrowserApiHost = (): string =>
  process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH?.trim() || DEFAULT_POSTHOG_PROXY_PATH
