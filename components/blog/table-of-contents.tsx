'use client'

import { useEffect, useRef, useState } from 'react'

interface Heading {
  id: string
  level: number
  text: string
}

interface TableOfContentsProps {
  headings: Heading[]
}

const TocLinks = ({
  headings,
  activeId,
  onNavigate,
}: {
  headings: Heading[]
  activeId: string
  onNavigate: (id: string) => void
}) => (
  <ul className="space-y-0.5 border-gray-lighter border-l dark:border-dark-border">
    {headings.map((heading) => {
      const isActive = activeId === heading.id
      return (
        <li key={heading.id}>
          <a
            className={`-ml-px block border-l-2 py-1 text-[12px] leading-snug transition-colors ${
              heading.level === 3 ? 'pl-5' : 'pl-3'
            } ${
              isActive
                ? 'border-black font-medium text-black dark:border-dark-text dark:text-dark-text'
                : 'border-transparent text-gray hover:text-black dark:text-dark-text-muted dark:hover:text-dark-text'
            }`}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault()
              onNavigate(heading.id)
            }}
          >
            {heading.text}
          </a>
        </li>
      )
    })}
  </ul>
)

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarLeft, setSidebarLeft] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const navigate = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      setIsOpen(false)
    }
  }

  // Observe headings for scroll-based highlighting
  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) {
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-64px 0px -75% 0px',
        threshold: 0,
      },
    )

    for (const el of elements) {
      observerRef.current.observe(el)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [headings])

  // Position sidebar right next to the article container's right edge
  useEffect(() => {
    const updatePosition = () => {
      const article = document.querySelector('article')
      if (!article) {
        return
      }
      const rect = article.getBoundingClientRect()
      const right = rect.right
      // Only show sidebar if there's enough space (200px for TOC + 32px gap + some padding)
      const available = window.innerWidth - right
      if (available >= 248) {
        setSidebarLeft(right + 32)
      } else {
        setSidebarLeft(null)
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, { passive: true })
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [])

  const showSidebar = sidebarLeft !== null

  return (
    <>
      {/* Inline accordion — visible when sidebar doesn't fit */}
      {!showSidebar && (
        <div className="mb-8 rounded-lg border border-gray-lighter dark:border-dark-border">
          <button
            aria-expanded={isOpen}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
            onClick={() => setIsOpen(!isOpen)}
            type="button"
          >
            <span className="font-semibold text-[11px] text-gray-dark uppercase tracking-wider dark:text-dark-text-muted">
              On this page
            </span>
            <svg
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-gray transition-transform dark:text-dark-text-muted ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isOpen && (
            <div className="px-4 pb-3">
              <TocLinks activeId={activeId} headings={headings} onNavigate={navigate} />
            </div>
          )}
        </div>
      )}

      {/* Fixed sidebar — visible when there's enough space */}
      {showSidebar && (
        <nav
          aria-label="Table of contents"
          className="fixed top-24 w-52"
          style={{ left: sidebarLeft }}
        >
          <h2 className="mb-3 font-semibold text-[11px] text-gray-dark uppercase tracking-wider dark:text-dark-text-muted">
            On this page
          </h2>
          <TocLinks activeId={activeId} headings={headings} onNavigate={navigate} />
        </nav>
      )}
    </>
  )
}

export default TableOfContents
