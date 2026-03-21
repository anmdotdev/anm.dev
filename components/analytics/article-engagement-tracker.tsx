'use client'

import {
  captureAnalyticsEvent,
  getArticleAnalyticsContext,
  getReferrerAnalyticsContext,
} from 'lib/analytics/client'
import { ANALYTICS_EVENTS } from 'lib/analytics/events'
import { useEffect, useRef } from 'react'

const ENGAGED_TIME_MILESTONES_SECONDS = [30, 60, 120] as const
const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 90] as const
const COMPLETION_MIN_ENGAGED_SECONDS = 30
const COMPLETION_MIN_SCROLL_DEPTH = 90
const TICK_INTERVAL_MS = 1000

const ArticleEngagementTracker = () => {
  const engagedSecondsRef = useRef(0)
  const hasCapturedViewRef = useRef(false)
  const lastTickStartedAtRef = useRef<number | null>(null)
  const sentEngagedMilestonesRef = useRef(new Set<number>())
  const sentScrollMilestonesRef = useRef(new Set<number>())
  const sentCompletionRef = useRef(false)

  useEffect(() => {
    const article = document.querySelector('article')
    if (article instanceof HTMLElement && !hasCapturedViewRef.current) {
      hasCapturedViewRef.current = true
      captureAnalyticsEvent(ANALYTICS_EVENTS.blogArticleViewed, {
        ...getArticleAnalyticsContext(article),
        ...getReferrerAnalyticsContext(),
      })
    }

    const updateCompletion = () => {
      if (sentCompletionRef.current) {
        return
      }

      const article = document.querySelector('article')
      if (!(article instanceof HTMLElement)) {
        return
      }

      const progressValue = Number.parseInt(
        document.querySelector('[aria-label="Reading progress"]')?.getAttribute('aria-valuenow') ??
          '0',
        10,
      )

      if (
        progressValue < COMPLETION_MIN_SCROLL_DEPTH ||
        engagedSecondsRef.current < COMPLETION_MIN_ENGAGED_SECONDS
      ) {
        return
      }

      sentCompletionRef.current = true
      captureAnalyticsEvent(ANALYTICS_EVENTS.blogArticleCompleted, {
        ...getArticleAnalyticsContext(article),
        engaged_seconds: engagedSecondsRef.current,
        scroll_depth_percent: progressValue,
      })
    }

    const trackEngagedTime = () => {
      if (document.visibilityState !== 'visible') {
        lastTickStartedAtRef.current = null
        return
      }

      if (lastTickStartedAtRef.current === null) {
        lastTickStartedAtRef.current = Date.now()
        return
      }

      const now = Date.now()
      const elapsedSeconds = Math.floor((now - lastTickStartedAtRef.current) / 1000)
      if (elapsedSeconds < 1) {
        return
      }

      engagedSecondsRef.current += elapsedSeconds
      lastTickStartedAtRef.current = now

      const article = document.querySelector('article')
      if (!(article instanceof HTMLElement)) {
        return
      }

      for (const milestone of ENGAGED_TIME_MILESTONES_SECONDS) {
        if (
          engagedSecondsRef.current >= milestone &&
          !sentEngagedMilestonesRef.current.has(milestone)
        ) {
          sentEngagedMilestonesRef.current.add(milestone)
          captureAnalyticsEvent(ANALYTICS_EVENTS.blogEngagedTimeReached, {
            ...getArticleAnalyticsContext(article),
            engaged_seconds: milestone,
          })
        }
      }

      updateCompletion()
    }

    const trackScrollDepth = () => {
      const article = document.querySelector('article')
      if (!(article instanceof HTMLElement)) {
        return
      }

      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = article.offsetHeight
      const viewportHeight = window.innerHeight
      const denominator = Math.max(articleHeight - viewportHeight, 1)
      const currentScroll = Math.min(
        Math.max(((window.scrollY - articleTop) / denominator) * 100, 0),
        100,
      )

      for (const milestone of SCROLL_DEPTH_MILESTONES) {
        if (currentScroll >= milestone && !sentScrollMilestonesRef.current.has(milestone)) {
          sentScrollMilestonesRef.current.add(milestone)
          captureAnalyticsEvent(ANALYTICS_EVENTS.blogScrollDepthReached, {
            ...getArticleAnalyticsContext(article),
            scroll_depth_percent: milestone,
          })
        }
      }

      updateCompletion()
    }

    const intervalId = window.setInterval(trackEngagedTime, TICK_INTERVAL_MS)
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    document.addEventListener('visibilitychange', trackEngagedTime)

    trackScrollDepth()
    trackEngagedTime()

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('scroll', trackScrollDepth)
      document.removeEventListener('visibilitychange', trackEngagedTime)
    }
  }, [])

  return null
}

export default ArticleEngagementTracker
