'use client'

import { useSearchParams } from 'next/navigation'

import NewsletterSignupCard from './signup-card'

interface NewsletterBlogSectionProps {
  enabled: boolean
}

const STATUS_COPY = {
  confirmed: {
    title: 'Subscription confirmed',
    message: 'Future posts will now land in your inbox.',
  },
  'already-confirmed': {
    title: 'Subscription already active',
    message: 'You are already subscribed and will keep receiving new post updates.',
  },
  'invalid-token': {
    title: 'Unable to confirm subscription',
    message: 'That confirmation link is invalid or has expired. Try subscribing again below.',
  },
  'confirm-error': {
    title: 'Unable to confirm subscription',
    message: 'Please try that confirmation link again, or subscribe again below.',
  },
} as const

const SUCCESS_STATES = new Set(['confirmed', 'already-confirmed'])

const SuccessIcon = () => (
  <span
    aria-hidden="true"
    className="inline-flex size-8 items-center justify-center rounded-full border border-success/30 bg-white text-success-darker"
  >
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
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

const NewsletterBlogSection = ({ enabled }: NewsletterBlogSectionProps) => {
  const searchParams = useSearchParams()
  const status = searchParams.get('newsletter')
  const statusCopy = status ? STATUS_COPY[status as keyof typeof STATUS_COPY] : null

  if (status && statusCopy && SUCCESS_STATES.has(status)) {
    return (
      <section
        className="rounded-2xl border border-success/40 bg-success/10 p-5 shadow-sm sm:p-8"
        id="newsletter"
      >
        <div className="mb-3 flex items-center gap-3 font-semibold text-[11px] text-success-darker uppercase tracking-[0.16em] dark:text-success-light">
          <SuccessIcon />
          <span>Subscription Confirmed</span>
        </div>
        <h2 className="font-semibold text-2xl text-black dark:text-dark-text">
          {statusCopy.title}
        </h2>
        <p className="mt-2 text-base text-gray-dark dark:text-dark-text-secondary">
          {statusCopy.message}
        </p>
      </section>
    )
  }

  return (
    <div className="space-y-4" id="newsletter">
      {statusCopy ? (
        <div className="rounded-xl border border-gray-lighter bg-white px-4 py-3 text-black text-sm dark:border-dark-border dark:bg-dark-surface dark:text-dark-text">
          {statusCopy.message}
        </div>
      ) : null}
      <NewsletterSignupCard
        description="One short email when a new post goes live."
        enabled={enabled}
        source="blog-index"
        title="Get new posts by email"
      />
    </div>
  )
}

export default NewsletterBlogSection
