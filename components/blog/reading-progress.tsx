'use client'

import { useEffect, useRef } from 'react'

const ReadingProgress = () => {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector('article')
      if (!(article && barRef.current)) {
        return
      }

      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = article.offsetHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      const start = articleTop
      const end = articleTop + articleHeight - windowHeight
      const current = Math.min(Math.max((scrollY - start) / (end - start), 0), 1)

      barRef.current.style.transform = `scaleX(${current})`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-50 h-0.5 w-full origin-left bg-black dark:bg-dark-text"
      ref={barRef}
      style={{ transform: 'scaleX(0)' }}
    />
  )
}

export default ReadingProgress
