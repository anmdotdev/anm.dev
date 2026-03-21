'use client'

import {
  captureAnalyticsEvent,
  getAnalyticsHeaders,
  getPageCategoryFromSource,
  identifyAnalyticsUser,
} from 'lib/analytics/client'
import { ANALYTICS_EVENTS } from 'lib/analytics/events'
import { classnames } from 'lib/helpers'
import { getStoredNewsletterEmail, setStoredNewsletterEmail } from 'lib/newsletter-email-storage'
import { useState } from 'react'

interface NewsletterSignupFormProps {
  buttonLabel?: string
  disabled?: boolean
  inputId: string
  onSuccess?: (email: string) => void
  source: string
}

interface SubscribeResponse {
  error?: string
  subscriberAnalyticsId?: string
}

type SubmissionStatus = 'idle' | 'submitting'

const NewsletterSignupForm = ({
  buttonLabel = 'Subscribe',
  disabled = false,
  inputId,
  onSuccess,
  source,
}: NewsletterSignupFormProps) => {
  const [email, setEmail] = useState(() => getStoredNewsletterEmail())
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const isSubmitting = status === 'submitting'
  const isFormDisabled = disabled || isSubmitting
  const inputClassName =
    'w-full rounded-lg border border-gray-lighter bg-white px-3 py-2 text-black text-xs placeholder:text-gray focus:border-gray-light focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:focus:border-dark-border-highlight dark:placeholder:text-dark-text-muted'
  const buttonClassName =
    'rounded-lg bg-purple px-3 py-2 font-semibold text-xs text-white transition-colors hover:bg-purple-dark disabled:cursor-not-allowed disabled:opacity-60'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isFormDisabled) {
      return
    }

    setError(null)
    setStatus('submitting')

    const nextEmail = email.trim()
    setStoredNewsletterEmail(nextEmail)

    captureAnalyticsEvent(ANALYTICS_EVENTS.newsletterSignupSubmitted, {
      form_id: inputId,
      page_category: getPageCategoryFromSource(source),
      signup_source: source,
    })

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAnalyticsHeaders(),
        },
        body: JSON.stringify({
          email: nextEmail,
          company,
          source,
        }),
      })
      const payload = (await response.json().catch(() => null)) as SubscribeResponse | null

      if (!response.ok) {
        setError(payload?.error ?? 'Unable to subscribe right now. Please try again.')
        setStatus('idle')
        return
      }

      setCompany('')
      if (payload?.subscriberAnalyticsId) {
        identifyAnalyticsUser(payload.subscriberAnalyticsId, {
          newsletter_status: 'pending_confirmation',
          signup_source: source,
        })
      }
      onSuccess?.(nextEmail)
    } catch {
      captureAnalyticsEvent(ANALYTICS_EVENTS.newsletterSignupFailed, {
        error_message: 'network_error',
        form_id: inputId,
        page_category: getPageCategoryFromSource(source),
        signup_source: source,
      })
      setError('Unable to subscribe right now. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <form aria-busy={isSubmitting} className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[12rem] flex-1 basis-56">
          <label className="sr-only" htmlFor={inputId}>
            Email address
          </label>
          <input
            autoComplete="email"
            className={inputClassName}
            data-ph-no-capture="true"
            disabled={isFormDisabled}
            id={inputId}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <button
          className={classnames('shrink-0', buttonClassName)}
          disabled={isFormDisabled}
          type="submit"
        >
          {isSubmitting ? 'Subscribing...' : buttonLabel}
        </button>
      </div>

      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${inputId}-company`}>Company</label>
        <input
          autoComplete="off"
          data-bwignore="true"
          data-ph-no-capture="true"
          disabled={isFormDisabled}
          id={`${inputId}-company`}
          name="company"
          onChange={(event) => setCompany(event.target.value)}
          tabIndex={-1}
          type="text"
          value={company}
        />
      </div>

      {error ? (
        <p aria-live="polite" className="text-error-dark text-xs dark:text-error-light">
          {error}
        </p>
      ) : null}
    </form>
  )
}

export default NewsletterSignupForm
