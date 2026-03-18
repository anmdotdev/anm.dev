'use client'

import { getStoredNewsletterEmail, setStoredNewsletterEmail } from 'lib/newsletter-email-storage'
import { useState } from 'react'

interface NewsletterSignupFormProps {
  buttonLabel?: string
  disabled?: boolean
  inputId: string
  source: string
}

interface SubscribeResponse {
  error?: string
  message?: string
}

type SubmissionStatus = 'idle' | 'submitting' | 'success'

const NewsletterSignupForm = ({
  buttonLabel = 'Subscribe',
  disabled = false,
  inputId,
  source,
}: NewsletterSignupFormProps) => {
  const [email, setEmail] = useState(() => getStoredNewsletterEmail())
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isSubmitting = status === 'submitting'
  const isSuccessful = status === 'success'
  const isFormDisabled = disabled || isSubmitting || isSuccessful

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isFormDisabled) {
      return
    }

    setMessage(null)
    setError(null)
    setStatus('submitting')

    const nextEmail = email.trim()
    setStoredNewsletterEmail(nextEmail)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      setSubmittedEmail(nextEmail)
      setCompany('')
      setMessage(
        payload?.message ?? 'If this email can receive updates, a confirmation link is on its way.',
      )
      setStatus('success')
    } catch {
      setError('Unable to subscribe right now. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <form aria-busy={isSubmitting} className="space-y-3" onSubmit={handleSubmit}>
      {isSuccessful ? (
        <div
          aria-live="polite"
          className="rounded-xl border border-success bg-success/10 px-4 py-3"
          role="status"
        >
          <p className="font-medium text-sm text-success-darker dark:text-success-light">
            Request received
          </p>
          {submittedEmail ? (
            <p className="mt-1 text-success-darker text-xs dark:text-success-light">
              We processed your signup request for{' '}
              <span className="font-medium">{submittedEmail}</span>.
            </p>
          ) : null}
          <p className="mt-2 text-success-darker text-xs dark:text-success-light">
            If this email is not subscribed yet, a confirmation link is on its way. You will only
            get new post notifications after you verify that email.
          </p>
          <p className="mt-2 text-success-darker text-xs dark:text-success-light">
            If this address is already subscribed, you will not receive another confirmation email.
          </p>
          <p className="mt-2 text-success-darker text-xs dark:text-success-light">{message}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor={inputId}>
              Email address
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-gray-lighter bg-white px-3 py-2 text-black text-sm placeholder:text-gray focus:border-gray-light focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:focus:border-dark-border-highlight dark:placeholder:text-dark-text-muted"
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
            className="rounded-lg bg-purple px-4 py-2 font-semibold text-sm text-white transition-colors hover:bg-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFormDisabled}
            type="submit"
          >
            {isSubmitting ? 'Subscribing...' : buttonLabel}
          </button>
        </div>
      )}

      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${inputId}-company`}>Company</label>
        <input
          autoComplete="off"
          disabled={isFormDisabled}
          id={`${inputId}-company`}
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
