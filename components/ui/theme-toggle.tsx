'use client'

import { useCallback, useEffect, useState } from 'react'

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (isDark: boolean) => {
  const html = document.documentElement
  html.classList.add('theme-transition')
  if (isDark) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  setTimeout(() => html.classList.remove('theme-transition'), 200)
}

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const initial = stored ? stored === 'dark' : getSystemTheme() === 'dark'
    setIsDark(initial)
    applyTheme(initial)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (!localStorage.getItem('theme')) {
        const systemDark = mediaQuery.matches
        setIsDark(systemDark)
        applyTheme(systemDark)
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const toggle = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    applyTheme(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setAnnouncement(next ? 'Dark mode enabled' : 'Light mode enabled')
  }, [isDark])

  return (
    <>
      <button
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="flex h-8 w-8 items-center justify-center rounded-md text-black transition-colors hover:bg-gray-lighter dark:text-dark-text dark:hover:bg-dark-border"
        onClick={toggle}
        type="button"
      >
        {isDark ? (
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      {announcement && (
        <span className="sr-only" role="status">
          {announcement}
        </span>
      )}
    </>
  )
}

export default ThemeToggle
