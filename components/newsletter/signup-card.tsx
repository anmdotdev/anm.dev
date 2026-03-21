'use client'

import { captureAnalyticsEvent, getPageCategoryFromSource } from 'lib/analytics/client'
import { ANALYTICS_EVENTS } from 'lib/analytics/events'
import { classnames } from 'lib/helpers'
import { useEffect, useRef, useState } from 'react'

import NewsletterSignupForm from './signup-form'

interface NewsletterSignupCardProps {
  buttonLabel?: string
  className?: string
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

interface SignupSuccessStateProps {
  className?: string
  id?: string
  submittedEmail: string
}

const SignupSuccessState = ({ className, id, submittedEmail }: SignupSuccessStateProps) => (
  <section
    className={classnames(
      'rounded-xl border border-success/40 bg-success/10 p-4 text-success-darker shadow-sm sm:p-5',
      className,
    )}
    id={id}
  >
    <div className="flex items-start gap-3">
      <SuccessIcon />
      <div className="min-w-0">
        <p className="font-semibold text-base text-success-darker">Thanks for subscribing</p>
        <p className="mt-2 text-sm text-success-darker">
          Check your inbox for a confirmation email at{' '}
          <span className="font-medium" data-ph-mask-text="true">
            {submittedEmail}
          </span>
          .
        </p>
        <p className="mt-2 text-sm text-success-darker">
          You&apos;ll start getting new post updates after you confirm it.
        </p>
      </div>
    </div>
  </section>
)

interface SignupIdleStateProps {
  buttonLabel?: string
  className?: string
  description: string
  enabled: boolean
  id?: string
  inputId: string
  onSuccess: (email: string) => void
  source: string
  title: string
}

const SignupIdleState = ({
  buttonLabel,
  className,
  description,
  enabled,
  id,
  inputId,
  onSuccess,
  source,
  title,
}: SignupIdleStateProps) => (
  <section
    className={classnames(
      'rounded-xl border border-gray-lighter bg-white p-4 shadow-sm sm:p-5 dark:border-dark-border dark:bg-dark-surface',
      className,
    )}
    id={id}
  >
    <div className="flex flex-wrap items-start gap-4 sm:gap-6">
      <div className="min-w-0 flex-1 basis-72">
        <p className="mb-1.5 font-semibold text-[11px] text-purple uppercase tracking-[0.16em] dark:text-purple-light">
          Newsletter
        </p>
        <h2 className="font-semibold text-black text-sm dark:text-dark-text">{title}</h2>
        <p className="mt-1 text-gray-dark text-xs dark:text-dark-text-secondary">{description}</p>
      </div>
      <div className="min-w-[16rem] flex-1 basis-80">
        <NewsletterSignupForm
          buttonLabel={buttonLabel}
          disabled={!enabled}
          inputId={inputId}
          onSuccess={onSuccess}
          source={source}
        />
        <p className="mt-2 text-[11px] text-gray dark:text-dark-text-muted">
          No spam. Double opt-in. One email per post.
        </p>
      </div>
    </div>
  </section>
)

const NewsletterSignupCard = ({
  buttonLabel,
  className,
  description,
  enabled,
  id,
  source,
  title,
}: NewsletterSignupCardProps) => {
  const inputId = `newsletter-email-${source.replace(/[^a-z0-9]+/gi, '-')}`
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const hasCapturedViewRef = useRef(false)

  useEffect(() => {
    const cardElement = cardRef.current
    if (!(cardElement && !hasCapturedViewRef.current)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!(entry?.isIntersecting && !hasCapturedViewRef.current)) {
          return
        }

        hasCapturedViewRef.current = true
        captureAnalyticsEvent(ANALYTICS_EVENTS.newsletterCtaViewed, {
          cta_source: source,
          cta_title: title,
          is_enabled: enabled,
          page_category: getPageCategoryFromSource(source),
        })
        observer.disconnect()
      },
      { threshold: 0.4 },
    )

    observer.observe(cardElement)

    return () => observer.disconnect()
  }, [enabled, source, title])

  if (submittedEmail) {
    return (
      <div ref={cardRef}>
        <SignupSuccessState className={className} id={id} submittedEmail={submittedEmail} />
      </div>
    )
  }

  return (
    <div ref={cardRef}>
      <SignupIdleState
        buttonLabel={buttonLabel}
        className={className}
        description={description}
        enabled={enabled}
        id={id}
        inputId={inputId}
        onSuccess={setSubmittedEmail}
        source={source}
        title={title}
      />
    </div>
  )
}

export default NewsletterSignupCard
