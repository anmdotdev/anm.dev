'use client'

import { getStoredNewsletterEmail } from 'lib/newsletter-email-storage'
import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIXES = [
  'async',
  'blazing',
  'cached',
  'compiled',
  'deployed',
  'edge',
  'headless',
  'hydrated',
  'lazy',
  'merged',
  'minified',
  'mono',
  'patched',
  'reactive',
  'rebased',
  'serverless',
  'shipped',
  'stateless',
  'turbo',
  'zero-config',
]

const SUFFIXES = [
  'bot',
  'cli',
  'commit',
  'container',
  'cron',
  'daemon',
  'debugger',
  'dev',
  'lambda',
  'linter',
  'node',
  'pixel',
  'pod',
  'proxy',
  'repl',
  'runtime',
  'schema',
  'shader',
  'socket',
  'stack',
]

const generateName = (): string => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)]
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]
  return `${prefix}-${suffix}`
}

interface UserIdentity {
  email: string
  id: string
  name: string
}

const getUserIdentity = (): UserIdentity => {
  const stored = localStorage.getItem('anm-blog-user')
  const newsletterEmail = getStoredNewsletterEmail()

  if (stored) {
    const user = JSON.parse(stored) as UserIdentity
    if (newsletterEmail && user.email !== newsletterEmail) {
      const updatedUser = { ...user, email: newsletterEmail }
      localStorage.setItem('anm-blog-user', JSON.stringify(updatedUser))
      return updatedUser
    }

    return user
  }

  const user: UserIdentity = {
    id: crypto.randomUUID(),
    name: generateName(),
    email: newsletterEmail,
  }
  localStorage.setItem('anm-blog-user', JSON.stringify(user))
  return user
}

const updateUserIdentity = (updates: Partial<UserIdentity>): UserIdentity => {
  const current = getUserIdentity()
  const updated = { ...current, ...updates }
  localStorage.setItem('anm-blog-user', JSON.stringify(updated))
  return updated
}

interface Comment {
  author_name: string
  content: string
  created_at: string
  fingerprint: string
  id: number
  parent_id: number | null
  slug: string
}

interface CommentNode extends Comment {
  replies: CommentNode[]
}

const buildTree = (comments: Comment[]): CommentNode[] => {
  const map = new Map<number, CommentNode>()
  const roots: CommentNode[] = []

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] })
  }

  for (const comment of comments) {
    const node = map.get(comment.id)
    if (!node) {
      continue
    }
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)?.replies.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

const getSubmitLabel = (parentId?: number): string => (parentId ? 'Reply' : 'Post comment')

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr.endsWith('Z') ? dateStr : `${dateStr}Z`)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) {
    return 'just now'
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`
  }
  if (diffHour < 24) {
    return `${diffHour}h ago`
  }
  if (diffDay < 30) {
    return `${diffDay}d ago`
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface CommentsProps {
  slug: string
}

interface CommentFormProps {
  autoFocus?: boolean
  onCancel?: () => void
  onSubmit: () => void
  parentId?: number
  slug: string
}

const CommentForm = ({ slug, parentId, onSubmit, onCancel, autoFocus }: CommentFormProps) => {
  const [content, setContent] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showEmail, setShowEmail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const user = getUserIdentity()
    setName(user.name)
    setEmail(user.email)
    if (user.email) {
      setShowEmail(true)
    }
  }, [])

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = async () => {
    if (!content.trim() || submitting) {
      return
    }
    setSubmitting(true)

    const user = getUserIdentity()
    const currentName = name.trim() || user.name
    updateUserIdentity({ name: currentName, email: email.trim() })

    const res = await fetch(`/api/blog/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authorName: currentName,
        authorEmail: email.trim() || undefined,
        content: content.trim(),
        parentId: parentId ?? undefined,
        fingerprint: user.id,
      }),
    })

    if (res.ok) {
      setContent('')
      onSubmit()
    }
    setSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label
          className="flex items-center gap-1.5 text-gray text-xs dark:text-dark-text-muted"
          htmlFor={`comment-name-${parentId ?? 'root'}`}
        >
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
          Posting as
        </label>
        <input
          className="w-full rounded-md border border-gray-lighter bg-white px-3 py-1.5 text-black text-xs placeholder:text-gray sm:w-48 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:placeholder:text-dark-text-muted"
          id={`comment-name-${parentId ?? 'root'}`}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name"
          type="text"
          value={name}
        />
        {showEmail && (
          <>
            <label className="sr-only" htmlFor={`comment-email-${parentId ?? 'root'}`}>
              Email (optional)
            </label>
            <input
              className="w-full rounded-md border border-gray-lighter bg-white px-3 py-1.5 text-black text-xs placeholder:text-gray sm:w-56 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:placeholder:text-dark-text-muted"
              id={`comment-email-${parentId ?? 'root'}`}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional, not displayed)"
              type="email"
              value={email}
            />
          </>
        )}
        {!showEmail && (
          <button
            aria-label="Add email address (optional)"
            className="shrink-0 text-gray text-xs hover:text-black dark:hover:text-dark-text"
            onClick={() => setShowEmail(true)}
            type="button"
          >
            + email
          </button>
        )}
      </div>

      <div>
        <label className="sr-only" htmlFor={`comment-content-${parentId ?? 'root'}`}>
          Comment
        </label>
        <textarea
          className="w-full resize-none rounded-lg border border-gray-lighter bg-white px-3 py-2 text-black text-sm placeholder:text-gray focus:border-gray-light focus:outline-none dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:focus:border-dark-border-highlight dark:placeholder:text-dark-text-muted"
          id={`comment-content-${parentId ?? 'root'}`}
          maxLength={2000}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={parentId ? 'Write a reply...' : 'Join the discussion...'}
          ref={textareaRef}
          rows={parentId ? 2 : 3}
          value={content}
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-gray text-xs dark:text-dark-text-muted">{content.length}/2000</span>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                className="rounded-md px-3 py-1.5 text-gray-dark text-xs transition-colors hover:text-black dark:text-dark-text-muted dark:hover:text-dark-text"
                onClick={onCancel}
                type="button"
              >
                Cancel
              </button>
            )}
            <button
              className="rounded-md border border-gray-lighter bg-white px-3 py-1.5 font-medium text-black text-xs transition-colors hover:bg-gray-lightest disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover"
              disabled={!content.trim() || submitting}
              onClick={handleSubmit}
              type="button"
            >
              {submitting ? 'Posting...' : getSubmitLabel(parentId)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: CommentNode
  currentUserId: string
  depth: number
  onDelete: (id: number) => void
  onReplySubmit: () => void
  slug: string
}

const CommentItem = ({
  comment,
  slug,
  depth,
  currentUserId,
  onReplySubmit,
  onDelete,
}: CommentItemProps) => {
  const [showReply, setShowReply] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isOwner = comment.fingerprint === currentUserId

  const handleReplySubmit = () => {
    setShowReply(false)
    onReplySubmit()
  }

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(comment.id)
    setConfirmDelete(false)
  }

  return (
    <div
      className={
        depth > 0 ? 'ml-6 border-gray-lighter border-l-2 pl-4 sm:ml-8 dark:border-dark-border' : ''
      }
    >
      <div className="py-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-medium text-black text-xs dark:text-dark-text">
            {comment.author_name}
          </span>
          <time
            className="text-gray text-xs dark:text-dark-text-muted"
            dateTime={comment.created_at}
          >
            {formatRelativeTime(comment.created_at)}
          </time>
        </div>
        <p className="whitespace-pre-wrap text-gray-darker text-sm leading-relaxed dark:text-dark-text-secondary">
          {comment.content}
        </p>
        <div className="mt-1 flex items-center gap-3">
          {depth === 0 && (
            <button
              aria-controls={`reply-form-${comment.id}`}
              aria-expanded={showReply}
              className="text-gray text-xs transition-colors hover:text-black dark:text-dark-text-muted dark:hover:text-dark-text"
              onClick={() => setShowReply(!showReply)}
              type="button"
            >
              {showReply ? 'Cancel' : 'Reply'}
            </button>
          )}
          {isOwner && (
            <button
              className="text-gray text-xs transition-colors hover:text-error-dark dark:text-dark-text-muted dark:hover:text-error-light"
              onClick={handleDelete}
              type="button"
            >
              {confirmDelete ? 'Confirm delete' : 'Delete'}
            </button>
          )}
          {confirmDelete && (
            <button
              className="text-gray text-xs transition-colors hover:text-black dark:text-dark-text-muted dark:hover:text-dark-text"
              onClick={() => setConfirmDelete(false)}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
        {showReply && (
          <div className="mt-3" id={`reply-form-${comment.id}`}>
            <CommentForm
              autoFocus
              onCancel={() => setShowReply(false)}
              onSubmit={handleReplySubmit}
              parentId={comment.id}
              slug={slug}
            />
          </div>
        )}
      </div>
      {comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem
              comment={reply}
              currentUserId={currentUserId}
              depth={depth + 1}
              key={reply.id}
              onDelete={onDelete}
              onReplySubmit={onReplySubmit}
              slug={slug}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Comments = ({ slug }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [count, setCount] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => {
    const user = getUserIdentity()
    setCurrentUserId(user.id)
  }, [])

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/blog/${slug}/comments`)
    if (res.ok) {
      const data = (await res.json()) as { comments: Comment[]; count: number }
      setComments(data.comments)
      setCount(data.count)
    }
    setLoaded(true)
  }, [slug])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/blog/${slug}/comments`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, fingerprint: currentUserId }),
    })
    if (res.ok) {
      fetchComments()
    }
  }

  const tree = buildTree(comments)

  return (
    <div className="mt-10 border-gray-lighter border-t pt-8 dark:border-dark-border">
      <h2 className="mb-6 font-semibold text-black text-sm dark:text-dark-text">
        Discussion{' '}
        {count > 0 && (
          <span className="font-normal text-gray dark:text-dark-text-muted">({count})</span>
        )}
      </h2>

      <CommentForm onSubmit={fetchComments} slug={slug} />

      {loaded && tree.length === 0 && (
        <p className="mt-6 text-center text-gray text-xs dark:text-dark-text-muted">
          No comments yet. Be the first to join the discussion.
        </p>
      )}

      {tree.length > 0 && (
        <div className="mt-6 divide-y divide-gray-lighter dark:divide-dark-border">
          {tree.map((comment) => (
            <CommentItem
              comment={comment}
              currentUserId={currentUserId}
              depth={0}
              key={comment.id}
              onDelete={handleDelete}
              onReplySubmit={fetchComments}
              slug={slug}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comments
