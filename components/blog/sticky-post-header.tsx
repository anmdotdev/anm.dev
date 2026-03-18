'use client'

import CopyPageMenu from 'components/blog/copy-page-menu'
import Reactions from 'components/blog/reactions'
import ShareButton from 'components/blog/share-button'
import Link from 'components/ui/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface TagLink {
  href: string
  label: string
}

interface StickyPostHeaderProps {
  dateLabel: string
  dateTime: string
  draft: boolean
  readingTime: string
  scheduledPreviewLabel?: string
  slug: string
  tags: TagLink[]
  title: string
}

const FADE_DISTANCE = 72

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const getDocumentTop = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect()
  return rect.top + window.scrollY
}

const StickyOverlayBreadcrumb = ({ title }: { title: string }) => (
  <nav
    aria-label="Breadcrumb"
    className="flex items-center gap-2 text-gray text-xs dark:text-dark-text-muted"
  >
    <Link
      aria-label="Go to homepage"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-gray-lighter transition-colors hover:border-black dark:border-dark-border dark:hover:border-dark-text"
      href="/"
      showIcon="never"
    >
      <Image
        alt=""
        className="opacity-85 dark:invert"
        height={16}
        priority
        src="/icon.svg"
        width={16}
      />
    </Link>
    <Link className="hover:text-black dark:hover:text-dark-text" href="/blog" showIcon="never">
      Blogs
    </Link>
    <span aria-hidden="true" className="text-gray-light dark:text-dark-text-muted">
      /
    </span>
    <span className="truncate text-black dark:text-dark-text">{title}</span>
  </nav>
)

const StickyPostHeader = ({
  dateLabel,
  dateTime,
  draft,
  readingTime,
  scheduledPreviewLabel,
  slug,
  tags,
  title,
}: StickyPostHeaderProps) => {
  const headerRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const [headerMetrics, setHeaderMetrics] = useState({
    left: 0,
    start: 0,
    width: 0,
  })
  const [overlayProgress, setOverlayProgress] = useState(0)

  useEffect(() => {
    const header = headerRef.current
    if (!header) {
      return
    }

    const updateMetrics = () => {
      const rect = header.getBoundingClientRect()
      setHeaderMetrics({
        left: rect.left,
        start: getDocumentTop(header),
        width: rect.width,
      })
    }

    updateMetrics()

    const resizeObserver = new ResizeObserver(() => {
      updateMetrics()
    })

    resizeObserver.observe(header)
    window.addEventListener('resize', updateMetrics)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateMetrics)
    }
  }, [])

  useEffect(() => {
    const updateOverlayProgress = () => {
      const nextProgress = clamp((window.scrollY - headerMetrics.start) / FADE_DISTANCE, 0, 1)

      setOverlayProgress((current) =>
        Math.abs(current - nextProgress) < 0.01 ? current : nextProgress,
      )
    }

    const scheduleOverlayUpdate = () => {
      if (frameRef.current !== null) {
        return
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        updateOverlayProgress()
      })
    }

    updateOverlayProgress()
    window.addEventListener('scroll', scheduleOverlayUpdate, { passive: true })

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }

      window.removeEventListener('scroll', scheduleOverlayUpdate)
    }
  }, [headerMetrics.start])

  const overlayVisible = overlayProgress > 0.01 && headerMetrics.width > 0

  return (
    <>
      {overlayVisible && (
        <div
          aria-hidden={overlayProgress < 0.98}
          className="fixed top-0 z-30 border-gray-lighter border-b bg-gray-lightest py-3 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:border-dark-border dark:bg-dark-bg dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
          id="blog-post-header"
          style={{
            left: `${headerMetrics.left}px`,
            opacity: overlayProgress,
            pointerEvents: overlayProgress > 0.85 ? 'auto' : 'none',
            transform: `translateY(${(1 - overlayProgress) * -12}px)`,
            width: `${headerMetrics.width}px`,
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <StickyOverlayBreadcrumb title={title} />
            <div className="flex shrink-0 items-center gap-1.5">
              <Reactions />
              <ShareButton slug={slug} />
              <CopyPageMenu slug={slug} title={title} />
            </div>
          </div>
        </div>
      )}

      <div className="mb-10" ref={headerRef}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Breadcrumb" className="text-gray text-xs dark:text-dark-text-muted">
            <Link
              className="hover:text-black dark:hover:text-dark-text"
              href="/blog"
              showIcon="never"
            >
              Blogs
            </Link>
            <span aria-hidden="true" className="mx-1.5">
              /
            </span>
            <span className="text-black dark:text-dark-text">{title}</span>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5">
            <Reactions />
            <ShareButton slug={slug} />
            <CopyPageMenu slug={slug} title={title} />
          </div>
        </div>

        {draft && (
          <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
            This post is a draft and is only visible in development.
          </div>
        )}
        {scheduledPreviewLabel && (
          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800 text-sm dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-400">
            This post is scheduled for {scheduledPreviewLabel} and is currently visible as a
            preview.
          </div>
        )}

        <header className="border-gray-lighter border-b pb-8 dark:border-dark-border">
          <h1 className="mb-3 font-semibold text-2xl text-black leading-tight dark:text-dark-text">
            {title}
          </h1>
          <p className="text-gray-dark text-xs leading-relaxed dark:text-dark-text-muted">
            <time dateTime={dateTime}>{dateLabel}</time>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span>{readingTime}</span>
            {tags.length > 0 && (
              <>
                <span aria-hidden="true" className="mx-2">
                  ·
                </span>
                <span>
                  {tags.map((tag, index) => (
                    <span key={tag.label}>
                      <Link
                        className="hover:text-black dark:hover:text-dark-text"
                        href={tag.href}
                        showIcon="never"
                      >
                        {tag.label}
                      </Link>
                      {index < tags.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              </>
            )}
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span>Anmol Mahatpurkar</span>
          </p>
        </header>
      </div>
    </>
  )
}

export default StickyPostHeader
