'use client'

import { useState } from 'react'

interface ShareButtonProps {
  slug: string
}

const ShareButton = ({ slug }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    await navigator.clipboard.writeText(`https://anm.dev/blog/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      aria-label="Copy post URL to clipboard"
      className="flex items-center gap-1.5 rounded-md border border-gray-lighter bg-white px-2 py-1.5 font-medium text-black text-xs transition-colors hover:bg-gray-lightest sm:px-3 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover"
      onClick={copyUrl}
      type="button"
    >
      {copied ? (
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
      <span aria-live="polite" className="hidden sm:inline">
        {copied ? 'Copied!' : 'Share'}
      </span>
    </button>
  )
}

export default ShareButton
