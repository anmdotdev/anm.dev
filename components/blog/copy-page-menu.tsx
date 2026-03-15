'use client'

import { useEffect, useRef, useState } from 'react'

interface CopyPageMenuProps {
  slug: string
  title: string
}

const CopyPageMenu = ({ slug }: CopyPageMenuProps) => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const blogUrl = `https://anm.dev/blog/${slug}`

  const copyPageText = async () => {
    const articleEl = document.querySelector('article')
    if (articleEl) {
      await navigator.clipboard.writeText(articleEl.innerText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    setOpen(false)
  }

  const copyAsMarkdown = async () => {
    const res = await fetch(`/api/blog/${slug}/raw`)
    const markdown = await res.text()
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center">
        <button
          className="flex items-center gap-1.5 rounded-l-md border border-gray-lighter bg-white px-3 py-1.5 font-medium text-black text-xs transition-colors hover:bg-gray-lightest dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover"
          onClick={copyPageText}
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
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          {copied ? 'Copied!' : 'Copy page'}
        </button>
        <button
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="More copy options"
          className="rounded-r-md border border-gray-lighter border-l-0 bg-white px-1.5 py-1.5 text-gray-dark transition-colors hover:bg-gray-lightest dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-muted dark:hover:bg-dark-surface-hover"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-1 w-64 rounded-lg border border-gray-lighter bg-white shadow-lg dark:border-dark-border dark:bg-dark-surface">
          <div className="py-1">
            <button
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-lightest dark:hover:bg-dark-surface-hover"
              onClick={() => {
                window.open(`/api/blog/${slug}/raw`, '_blank')
                setOpen(false)
              }}
              type="button"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-lightest dark:bg-dark-border">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-dark dark:text-dark-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              </span>
              <span>
                <span className="block font-medium text-black dark:text-dark-text">
                  View as Markdown
                </span>
                <span className="text-gray dark:text-dark-text-muted">
                  Open this page in Markdown
                </span>
              </span>
            </button>

            <button
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-lightest dark:hover:bg-dark-surface-hover"
              onClick={copyAsMarkdown}
              type="button"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-lightest dark:bg-dark-border">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-dark dark:text-dark-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
              </span>
              <span>
                <span className="block font-medium text-black dark:text-dark-text">
                  Copy as Markdown
                </span>
                <span className="text-gray dark:text-dark-text-muted">
                  Copy page content as Markdown
                </span>
              </span>
            </button>

            <div className="mx-3 my-1 border-gray-lighter border-t dark:border-dark-border" />

            <a
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-lightest dark:hover:bg-dark-surface-hover"
              href={`https://claude.ai/new?q=${encodeURIComponent(`Read and summarize this article: ${blogUrl}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-lightest dark:bg-dark-border">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M4.709 15.955l4.397-2.006a.407.407 0 01.2-.031.353.353 0 01.163.063.335.335 0 01.108.132c.024.053.034.112.028.17l-.527 6.48a.264.264 0 01-.05.131.22.22 0 01-.107.08.19.19 0 01-.13.005.208.208 0 01-.112-.071L4.635 16.2a.245.245 0 01-.046-.133.258.258 0 01.03-.138.238.238 0 01.09-.094"
                    fill="#D97757"
                  />
                  <path
                    d="M14.588 3.162L6.065 20.16a.4.4 0 01-.084.11.32.32 0 01-.226.088.313.313 0 01-.123-.025.348.348 0 01-.105-.073L.18 14.744a.327.327 0 01-.072-.122.366.366 0 01.01-.288.337.337 0 01.084-.11L14.186 3.002a.264.264 0 01.132-.05.22.22 0 01.13.033.208.208 0 01.084.103.245.245 0 01.01.14"
                    fill="#D97757"
                  />
                  <path
                    d="M23.88 9.291L18.506 20.03a.359.359 0 01-.098.12.341.341 0 01-.262.063.363.363 0 01-.12-.054L9.66 14.906a.39.39 0 01-.1-.098.357.357 0 01.04-.408.374.374 0 01.107-.09l13.84-5.149a.264.264 0 01.14-.016.22.22 0 01.122.057.208.208 0 01.068.111.245.245 0 01-.003.14"
                    fill="#D97757"
                  />
                </svg>
              </span>
              <span>
                <span className="block font-medium text-black dark:text-dark-text">
                  Open in Claude
                </span>
                <span className="text-gray dark:text-dark-text-muted">
                  Ask questions about this page
                </span>
              </span>
            </a>

            <a
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-lightest dark:hover:bg-dark-surface-hover"
              href={`https://chatgpt.com/?q=${encodeURIComponent(`Read and summarize this article: ${blogUrl}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-lightest dark:bg-dark-border">
                <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
                </svg>
              </span>
              <span>
                <span className="block font-medium text-black dark:text-dark-text">
                  Open in ChatGPT
                </span>
                <span className="text-gray dark:text-dark-text-muted">
                  Ask questions about this page
                </span>
              </span>
            </a>

            <a
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-lightest dark:hover:bg-dark-surface-hover"
              href={`https://www.perplexity.ai/?q=${encodeURIComponent(`Summarize this article: ${blogUrl}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-lightest dark:bg-dark-border">
                <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L17.09 4.545V8.18L20.727 4.545V12H17.09v6.545L12 24l-5.09-5.455V12H3.272V4.545L6.909 8.18V4.545L12 0zm-.545 13.09H7.91v4.365l3.545 3.8V13.09zm1.09 8.165l3.546-3.8V13.09h-3.545v8.165zM7.91 11.454h3.545V6.545L7.909 2.89v8.564zm4.636-4.909v4.91h3.545V2.89l-3.545 3.655zM4.363 5.818v5.636h2.545V7.09L4.363 5.818zm12.727-1.091v5.727h2.546V5.818l-2.546 1.636z" />
                </svg>
              </span>
              <span>
                <span className="block font-medium text-black dark:text-dark-text">
                  Open in Perplexity
                </span>
                <span className="text-gray dark:text-dark-text-muted">Research this article</span>
              </span>
            </a>

            <a
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors hover:bg-gray-lightest dark:hover:bg-dark-surface-hover"
              href={`https://gemini.google.com/app?q=${encodeURIComponent(`Read and summarize this article: ${blogUrl}`)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-lightest dark:bg-dark-border">
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M12 24C12 22.4 11.6 20.9 10.9 19.5C10.1 18.1 9.1 16.9 7.8 15.9C6.6 14.9 5.2 14.2 3.6 13.7C2.1 13.2 0.5 13 0 13C0.5 13 2.1 12.7 3.6 12.2C5.2 11.7 6.6 11 7.8 10C9.1 9.1 10.1 7.9 10.9 6.5C11.6 5.1 12 3.6 12 2C12 3.6 12.3 5.1 12.9 6.5C13.6 7.9 14.6 9.1 15.8 10C17.1 11 18.5 11.7 20.1 12.2C21.6 12.7 23.2 13 24 13C23.2 13 21.6 13.2 20.1 13.7C18.5 14.2 17.1 14.9 15.8 15.9C14.6 16.9 13.6 18.1 12.9 19.5C12.3 20.9 12 22.4 12 24Z"
                    fill="url(#gemini-gradient)"
                  />
                  <defs>
                    <linearGradient id="gemini-gradient" x1="0" x2="24" y1="0" y2="24">
                      <stop offset="0%" stopColor="#4285F4" />
                      <stop offset="50%" stopColor="#9B72CB" />
                      <stop offset="100%" stopColor="#D96570" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span>
                <span className="block font-medium text-black dark:text-dark-text">
                  Open in Gemini
                </span>
                <span className="text-gray dark:text-dark-text-muted">
                  Ask questions about this page
                </span>
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default CopyPageMenu
