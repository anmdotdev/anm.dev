'use client'

import { captureAnalyticsException } from 'lib/analytics/client'
import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    captureAnalyticsException(error, {
      error_boundary: 'app',
      error_digest: error.digest,
    })
  }, [error])

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <h1 className="mb-2 font-bold text-3xl text-black dark:text-dark-text">
        Something went wrong
      </h1>
      <p className="mb-6 text-gray-dark dark:text-dark-text-secondary">
        The page hit an unexpected error. Try loading it again.
      </p>
      <button
        className="rounded-md border border-gray-lighter bg-white px-4 py-2 font-medium text-black text-sm transition-colors hover:bg-gray-lightest dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </section>
  )
}

export default ErrorPage
