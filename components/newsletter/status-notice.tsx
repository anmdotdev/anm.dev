'use client'

import { useSearchParams } from 'next/navigation'

const STATUS_COPY: Record<string, string> = {
  confirmed: 'Subscription confirmed. Future posts will now land in your inbox.',
  'already-confirmed': 'This subscription is already active.',
  'invalid-token': 'That confirmation link is invalid or has expired.',
  'confirm-error': 'Unable to confirm that subscription right now. Please try again.',
}

const NewsletterStatusNotice = () => {
  const searchParams = useSearchParams()
  const status = searchParams.get('newsletter')

  if (!status) {
    return null
  }

  const message = STATUS_COPY[status]
  if (!message) {
    return null
  }

  return (
    <div className="rounded-xl border border-gray-lighter bg-white px-4 py-3 text-black text-sm dark:border-dark-border dark:bg-dark-surface dark:text-dark-text">
      {message}
    </div>
  )
}

export default NewsletterStatusNotice
