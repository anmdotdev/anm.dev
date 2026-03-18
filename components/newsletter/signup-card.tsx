'use client'

import { classnames } from 'lib/helpers'
import { useState } from 'react'

import NewsletterSignupForm from './signup-form'

interface NewsletterSignupCardProps {
  buttonLabel?: string
  className?: string
  compact?: boolean
  description: string
  enabled: boolean
  id?: string
  source: string
  title: string
}

const SuccessIcon = () => (
  <span
    aria-hidden="true"
    className="inline-flex size-10 items-center justify-center rounded-full border border-success/30 bg-white text-success-darker"
  >
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 16 16">
      <path
        d="M4 8.2 6.5 10.7 12 5.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  </span>
)

const NewsletterSignupCard = ({
  buttonLabel,
  className,
  compact = false,
  description,
  enabled,
  id,
  source,
  title,
}: NewsletterSignupCardProps) => {
  const inputId = `newsletter-email-${source.replace(/[^a-z0-9]+/gi, '-')}`
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  if (submittedEmail) {
    return (
      <section
        className={classnames(
          'rounded-2xl border border-success/40 bg-success/10 text-success-darker shadow-sm',
          compact ? 'p-5' : 'p-6 sm:p-8',
          className,
        )}
        id={id}
      >
        <div className="flex items-start gap-4">
          <SuccessIcon />
          <div className="min-w-0">
            <p
              className={classnames(
                'font-semibold text-success-darker',
                compact ? 'text-xl' : 'text-2xl',
              )}
            >
              Thanks for subscribing
            </p>
            <p className="mt-2 text-sm text-success-darker sm:text-base">
              Check your inbox for a confirmation email at{' '}
              <span className="font-medium">{submittedEmail}</span>.
            </p>
            <p className="mt-2 text-sm text-success-darker sm:text-base">
              You&apos;ll start getting new post updates after you confirm it.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className={classnames(
        'rounded-2xl border border-gray-lighter bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface',
        compact ? 'p-5' : 'p-6 sm:p-8',
        className,
      )}
      id={id}
    >
      <p className="mb-2 font-semibold text-[11px] text-purple uppercase tracking-[0.16em] dark:text-purple-light">
        Newsletter
      </p>
      <h2
        className={classnames(
          'font-semibold text-black dark:text-dark-text',
          compact ? 'text-lg' : 'text-2xl',
        )}
      >
        {title}
      </h2>
      <p
        className={classnames(
          'mt-2 text-gray-dark dark:text-dark-text-secondary',
          compact ? 'text-sm' : 'text-base',
        )}
      >
        {description}
      </p>
      <div className="mt-5">
        <NewsletterSignupForm
          buttonLabel={buttonLabel}
          disabled={!enabled}
          inputId={inputId}
          onSuccess={setSubmittedEmail}
          source={source}
        />
      </div>
      <p className="mt-3 text-gray text-xs dark:text-dark-text-muted">
        No spam, ever. Double opt-in. One email per new post. Unsubscribe any time.
      </p>
    </section>
  )
}

export default NewsletterSignupCard
