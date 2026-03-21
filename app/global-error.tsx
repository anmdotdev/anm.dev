'use client'

import { captureAnalyticsException } from 'lib/analytics/client'
import NextError from 'next/error'
import { useEffect } from 'react'

interface GlobalErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalErrorPage = ({ error }: GlobalErrorPageProps) => {
  useEffect(() => {
    captureAnalyticsException(error, {
      error_boundary: 'global',
      error_digest: error.digest,
    })
  }, [error])

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}

export default GlobalErrorPage
