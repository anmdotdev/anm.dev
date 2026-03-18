const NEWSLETTER_EMAIL_STORAGE_KEY = 'anm-newsletter-email'

const normalizeStoredEmail = (email: string): string => email.trim()

export const getStoredNewsletterEmail = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  const storedEmail = window.localStorage.getItem(NEWSLETTER_EMAIL_STORAGE_KEY)
  return storedEmail ? normalizeStoredEmail(storedEmail) : ''
}

export const setStoredNewsletterEmail = (email: string): void => {
  if (typeof window === 'undefined') {
    return
  }

  const normalizedEmail = normalizeStoredEmail(email)
  if (!normalizedEmail) {
    window.localStorage.removeItem(NEWSLETTER_EMAIL_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(NEWSLETTER_EMAIL_STORAGE_KEY, normalizedEmail)
}
