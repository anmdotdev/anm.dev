'use client'

import { useState } from 'react'
import Reactions from './reactions'

interface PostFooterActionsProps {
  slug: string
}

const PostFooterActions = ({ slug }: PostFooterActionsProps) => {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    await navigator.clipboard.writeText(`https://anm.dev/blog/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-12 border-gray-lighter border-t pt-8 dark:border-dark-border">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-dark text-xs dark:text-dark-text-muted">
            Was this helpful?
          </span>
          <Reactions />
        </div>

        <button
          aria-label={
            copied
              ? 'Share this post (link copied)'
              : 'Share this post (copy post URL to clipboard)'
          }
          className="flex items-center gap-1.5 rounded-md border border-gray-lighter bg-white px-3 py-1.5 font-medium text-black text-xs transition-colors hover:bg-gray-lightest dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover"
          onClick={copyUrl}
          type="button"
        >
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
          <span aria-live="polite">{copied ? 'Copied!' : 'Share this post'}</span>
        </button>
      </div>
    </div>
  )
}

export default PostFooterActions
