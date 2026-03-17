'use client'

import { useEffect, useRef, useState } from 'react'

interface Heading {
  id: string
  level: number
  text: string
}

interface TableOfContentsProps {
  headings: Heading[]
  variant?: 'desktop' | 'mobile'
}

const TOC_SCROLL_OFFSET = 32

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

const TableOfContents = ({ headings, variant = 'mobile' }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarLeft, setSidebarLeft] = useState<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const navigate = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = window.scrollY + el.getBoundingClientRect().top - TOC_SCROLL_OFFSET
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth',
      })
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

  useEffect(() => {
    if (variant !== 'desktop') {
      return
    }

    const updatePosition = () => {
      const article = document.querySelector('article')
      if (!article) {
        setSidebarLeft(null)
        return
      }

      const rect = article.getBoundingClientRect()
      const available = window.innerWidth - rect.right

      if (available >= 248) {
        setSidebarLeft(rect.right + 32)
        return
      }

      setSidebarLeft(null)
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [variant])

  if (variant === 'desktop') {
    if (sidebarLeft === null) {
      return null
    }

    return (
      <nav
        aria-label="Table of contents"
        className="fixed top-24 hidden w-52 xl:block"
        style={{ left: sidebarLeft }}
      >
        <h2 className="mb-3 font-semibold text-[11px] text-gray-dark uppercase tracking-wider dark:text-dark-text-muted">
          On this page
        </h2>
        <TocLinks activeId={activeId} headings={headings} onNavigate={navigate} />
      </nav>
    )
  }

  return (
    <div className="mb-8 rounded-lg border border-gray-lighter xl:hidden dark:border-dark-border">
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
  )
}

export default TableOfContents
