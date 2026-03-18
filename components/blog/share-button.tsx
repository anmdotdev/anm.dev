'use client'

import { useEffect, useRef, useState } from 'react'

interface ShareButtonProps {
  label?: string
  slug: string
  title?: string
  visibleLabel?: 'always' | 'desktop'
}

type ShareFeedbackState = 'copied' | 'idle' | 'shared'

const FEEDBACK_RESET_DELAY_MS = 2000
const SITE_ORIGIN = 'https://anm.dev'

const ShareButton = ({
  label = 'Share',
  slug,
  title,
  visibleLabel = 'desktop',
}: ShareButtonProps) => {
  const [feedback, setFeedback] = useState<ShareFeedbackState>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const postUrl = `${SITE_ORIGIN}/blog/${slug}`

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const setTransientFeedback = (nextFeedback: Exclude<ShareFeedbackState, 'idle'>) => {
    setFeedback(nextFeedback)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setFeedback('idle')
      timeoutRef.current = null
    }, FEEDBACK_RESET_DELAY_MS)
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(postUrl)
    setTransientFeedback('copied')
  }

  const sharePost = async () => {
    if (typeof navigator.share !== 'function') {
      await copyUrl()
      return
    }

    try {
      await navigator.share({
        title,
        url: postUrl,
      })
      setTransientFeedback('shared')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      await copyUrl()
    }
  }

  let ariaLabel = `${label} (open share sheet or copy post URL)`
  if (feedback === 'copied') {
    ariaLabel = `${label} (link copied)`
  } else if (feedback === 'shared') {
    ariaLabel = `${label} (share sheet opened)`
  }

  let buttonText = label
  if (feedback === 'copied') {
    buttonText = 'Copied!'
  } else if (feedback === 'shared') {
    buttonText = 'Shared!'
  }

  const labelClassName = visibleLabel === 'always' ? '' : 'hidden sm:inline'

  return (
    <button
      aria-label={ariaLabel}
      className="flex items-center gap-1.5 rounded-md border border-gray-lighter bg-white px-2 py-1.5 font-medium text-black text-xs transition-colors hover:bg-gray-lightest sm:px-3 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover"
      onClick={sharePost}
      type="button"
    >
      {feedback === 'copied' || feedback === 'shared' ? (
        <svg
          aria-hidden="true"
          className="h-3.5 w-3.5 text-success-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      )}
      <span aria-live="polite" className={labelClassName}>
        {buttonText}
      </span>
    </button>
  )
}

export default ShareButton
