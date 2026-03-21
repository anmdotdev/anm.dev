import { getPostHogBrowserApiHost } from 'lib/analytics/constants'
import posthog from 'lib/analytics/posthog-browser'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const posthogUiHost = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? 'https://us.posthog.com'

let analyticsInitialized = false

const canInitializeAnalytics = (): boolean =>
  Boolean(posthogKey && posthogHost && typeof window !== 'undefined')

const initializeAnalytics = (): boolean => {
  if (!canInitializeAnalytics()) {
    return false
  }

  const analyticsKey = posthogKey
  if (!analyticsKey) {
    return false
  }

  if (analyticsInitialized) {
    posthog.opt_in_capturing()
    posthog.startSessionRecording()
    return true
  }

  posthog.init(analyticsKey, {
    api_host: getPostHogBrowserApiHost(),
    autocapture: {
      capture_copied_text: false,
      dom_event_allowlist: ['click', 'change', 'submit'],
      element_allowlist: ['a', 'button', 'form', 'input', 'label', 'select', 'textarea'],
      element_attribute_ignorelist: ['aria-label', 'id', 'name', 'placeholder', 'title', 'value'],
    },
    capture_dead_clicks: true,
    capture_pageleave: true,
    capture_pageview: 'history_change',
    defaults: '2026-01-30',
    disable_session_recording: false,
    enable_recording_console_log: true,
    person_profiles: 'identified_only',
    session_recording: {
      blockSelector: '[data-ph-no-capture]',
      maskAllInputs: true,
      maskTextSelector: '[data-ph-mask-text]',
    },
    ui_host: posthogUiHost,
    loaded: (client) => {
      if (process.env.NODE_ENV === 'development') {
        client.debug()
      }

      client.startExceptionAutocapture({
        capture_console_errors: true,
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
      })
    },
  })

  analyticsInitialized = true
  return true
}

export const ensureAnalyticsInitialized = (): boolean => initializeAnalytics()
