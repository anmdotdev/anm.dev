'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type ReactionType = 'like' | 'dislike'

interface ReactionsContextValue {
  dislikes: number
  likes: number
  react: (type: ReactionType) => void
  userDisliked: boolean
}

const ReactionsContext = createContext<ReactionsContextValue | null>(null)

const getFingerprint = (): string => {
  const stored = localStorage.getItem('anm-blog-user')
  if (stored) {
    return JSON.parse(stored).id as string
  }
  return ''
}

interface ReactionsProviderProps {
  children: ReactNode
  slug: string
}

export const ReactionsProvider = ({ slug, children }: ReactionsProviderProps) => {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userDisliked, setUserDisliked] = useState(false)
  const likeDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingLikes = useRef(0)

  const fetchCounts = useCallback(async () => {
    const fingerprint = getFingerprint()
    const params = fingerprint ? `?fingerprint=${fingerprint}` : ''
    const res = await fetch(`/api/blog/${slug}/reactions${params}`)
    if (res.ok) {
      const data = (await res.json()) as { likes: number; dislikes: number; userDisliked: boolean }
      setLikes(data.likes)
      setDislikes(data.dislikes)
      setUserDisliked(data.userDisliked)
    }
  }, [slug])

  useEffect(() => {
    fetchCounts()
  }, [fetchCounts])

  const flushLikes = useCallback(() => {
    const count = pendingLikes.current
    if (count === 0) {
      return
    }
    pendingLikes.current = 0

    const fingerprint = getFingerprint()
    if (!fingerprint) {
      return
    }

    for (let i = 0; i < count; i++) {
      fetch(`/api/blog/${slug}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'like', fingerprint }),
      })
    }
  }, [slug])

  const react = useCallback(
    (type: ReactionType) => {
      if (type === 'like') {
        setLikes((l) => l + 1)
        pendingLikes.current++

        if (likeDebounce.current) {
          clearTimeout(likeDebounce.current)
        }
        likeDebounce.current = setTimeout(flushLikes, 500)
        return
      }

      const fingerprint = getFingerprint()
      if (!fingerprint) {
        return
      }

      if (userDisliked) {
        setDislikes((d) => d - 1)
        setUserDisliked(false)
      } else {
        setDislikes((d) => d + 1)
        setUserDisliked(true)
      }

      fetch(`/api/blog/${slug}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'dislike', fingerprint }),
      })
    },
    [slug, userDisliked, flushLikes],
  )

  return (
    <ReactionsContext value={{ likes, dislikes, userDisliked, react }}>{children}</ReactionsContext>
  )
}

const useReactions = (): ReactionsContextValue => {
  const ctx = useContext(ReactionsContext)
  if (!ctx) {
    throw new Error('Reactions must be used within ReactionsProvider')
  }
  return ctx
}

interface FloatingParticle {
  id: number
  type: ReactionType
}

const ThumbsUpIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 9v12H1V9zm4 12a2 2 0 0 1-2-2V9c0-.55.22-1.05.59-1.41L14.17 1l1.06 1.06c.27.27.44.64.44 1.05l-.03.32L14.69 8H21a2 2 0 0 1 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05C19.54 20.5 18.83 21 18 21zm0-2h9.03L21 12v-2h-8.79l1.13-5.32L9 9.03z" />
  </svg>
)

const ThumbsDownIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 15V3h4v12zM15 3a2 2 0 0 1 2 2v10c0 .55-.22 1.05-.59 1.41L9.83 23l-1.06-1.06c-.27-.27-.44-.64-.44-1.06l.03-.31l.95-4.57H3a2 2 0 0 1-2-2v-2c0-.26.05-.5.14-.73l3.02-7.05C4.46 3.5 5.17 3 6 3zm0 2H5.97L3 12v2h8.78l-1.13 5.32L15 14.97z" />
  </svg>
)

const Reactions = () => {
  const { likes, dislikes, userDisliked, react } = useReactions()
  const [particles, setParticles] = useState<FloatingParticle[]>([])
  const particleId = useRef(0)

  const spawnParticle = (type: ReactionType) => {
    const id = particleId.current++
    setParticles((prev) => [...prev, { id, type }])
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id))
    }, 700)
  }

  const handleClick = (type: ReactionType) => {
    react(type)
    if (type === 'like') {
      spawnParticle(type)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <button
          aria-label={`Like this post (${likes})`}
          className="flex items-center gap-1.5 rounded-md border border-gray-lighter bg-white px-2 py-1.5 text-xs transition-colors hover:bg-gray-lightest active:scale-95 dark:border-dark-border dark:bg-dark-surface dark:hover:bg-dark-surface-hover"
          onClick={() => handleClick('like')}
          type="button"
        >
          <ThumbsUpIcon className="h-3.5 w-3.5 text-black dark:text-dark-text" />
          <span aria-live="polite" className="text-success-dark dark:text-success-light">
            {likes}
          </span>
        </button>
        {particles
          .filter((p) => p.type === 'like')
          .map((p) => (
            <span
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 animate-[float-up_0.7s_ease-out_forwards] font-medium text-success-dark text-xs dark:text-success-light"
              key={p.id}
              style={{ bottom: '100%' }}
            >
              +1
            </span>
          ))}
      </div>

      <button
        aria-label={
          userDisliked ? `Remove dislike (${dislikes})` : `Dislike this post (${dislikes})`
        }
        aria-pressed={userDisliked}
        className={`flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs transition-colors active:scale-95 ${
          userDisliked
            ? 'border-error-lighter bg-error-lightest dark:border-[rgba(241,74,89,0.2)] dark:bg-[rgba(241,74,89,0.08)]'
            : 'border-gray-lighter bg-white hover:bg-gray-lightest dark:border-dark-border dark:bg-dark-surface dark:hover:bg-dark-surface-hover'
        }`}
        onClick={() => handleClick('dislike')}
        type="button"
      >
        <ThumbsDownIcon
          className={`h-3.5 w-3.5 ${userDisliked ? 'text-error-dark dark:text-error-light' : 'text-black dark:text-dark-text'}`}
        />
        <span aria-live="polite" className="text-error-light dark:text-error-lighter">
          {dislikes}
        </span>
      </button>
    </div>
  )
}

export default Reactions
