const TRAILING_SLASH_REGEX = /\/+$/

export const SITE_NAME = 'anmdotdev'
export const SITE_URL = (process.env.SITE_URL ?? 'https://anm.dev').replace(
  TRAILING_SLASH_REGEX,
  '',
)
export const AUTHOR_NAME = 'Anmol Mahatpurkar'
export const AUTHOR_EMAIL = 'hey@anm.dev'
export const NEWSLETTER_FROM_NAME =
  process.env.RESEND_FROM_NAME ?? `${AUTHOR_NAME} via ${SITE_NAME}`

export const getAbsoluteUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}
