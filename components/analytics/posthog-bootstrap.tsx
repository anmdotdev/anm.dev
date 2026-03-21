'use client'

import { ensureAnalyticsInitialized } from 'lib/analytics/browser-init'
import { useEffect } from 'react'

const PostHogBootstrap = () => {
  useEffect(() => {
    ensureAnalyticsInitialized()
  }, [])

  return null
}

export default PostHogBootstrap
