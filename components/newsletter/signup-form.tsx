'use client'

import { getStoredNewsletterEmail, setStoredNewsletterEmail } from 'lib/newsletter-email-storage'
import { useState, useTransition } from 'react'

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

const NewsletterSignupForm = ({
  buttonLabel = 'Subscribe',
  disabled = false,
  inputId,
  source,
}: NewsletterSignupFormProps) => {
  const [email, setEmail] = useState(() => getStoredNewsletterEmail())
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError(null)

    startTransition(() => {
      setStoredNewsletterEmail(email)

      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          company,
          source,
        }),
      })
        .then(async (response) => {
          const payload = (await response.json().catch(() => null)) as SubscribeResponse | null

          if (!response.ok) {
            setError(payload?.error ?? 'Unable to subscribe right now. Please try again.')
            return
          }

          setEmail('')
          setCompany('')
          setMessage(
            payload?.message ??
              'If this email can receive updates, a confirmation link is on its way.',
          )
        })
        .catch(() => {
          setError('Unable to subscribe right now. Please try again.')
        })
    })
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor={inputId}>
            Email address
          </label>
          <input
            autoComplete="email"
            className="w-full rounded-lg border border-gray-lighter bg-white px-3 py-2 text-black text-sm placeholder:text-gray focus:border-gray-light focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:focus:border-dark-border-highlight dark:placeholder:text-dark-text-muted"
            disabled={disabled || isPending}
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
          disabled={disabled || isPending}
          type="submit"
        >
          {isPending ? 'Submitting...' : buttonLabel}
        </button>
      </div>

      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${inputId}-company`}>Company</label>
        <input
          autoComplete="off"
          id={`${inputId}-company`}
          onChange={(event) => setCompany(event.target.value)}
          tabIndex={-1}
          type="text"
          value={company}
        />
      </div>

      {message ? (
        <p className="text-success-darker text-xs dark:text-success-light">{message}</p>
      ) : null}
      {error ? <p className="text-error-dark text-xs dark:text-error-light">{error}</p> : null}
    </form>
  )
}

export default NewsletterSignupForm
