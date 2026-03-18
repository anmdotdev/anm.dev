import fs from 'node:fs'
import path from 'node:path'
import type { Client } from '@libsql/client'
import { createClient } from '@libsql/client'

let client: Client | null = null

const getClient = (): Client => {
  if (client) {
    return client
  }

  const url = process.env.TURSO_DATABASE_URL ?? 'file:data/blog.db'

  if (url.startsWith('file:')) {
    const filePath = url.replace('file:', '')
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return client
}

const initDb = async () => {
  const db = getClient()
  await db.batch([
    "CREATE TABLE IF NOT EXISTS reactions (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL, type TEXT NOT NULL CHECK (type IN ('like', 'dislike')), fingerprint TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    'CREATE INDEX IF NOT EXISTS idx_reactions_slug ON reactions(slug)',
    "CREATE TABLE IF NOT EXISTS blog_views (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    'CREATE INDEX IF NOT EXISTS idx_blog_views_slug ON blog_views(slug)',
    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL, parent_id INTEGER, author_name TEXT NOT NULL, author_email TEXT, content TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (parent_id) REFERENCES comments(id))",
    'CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug)',
    'CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id)',
    "CREATE TABLE IF NOT EXISTS newsletter_subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, email_normalized TEXT NOT NULL UNIQUE, source TEXT NOT NULL DEFAULT 'website', status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced', 'complained')), resend_contact_id TEXT, confirmed_at TEXT, unsubscribed_at TEXT, suppression_reason TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))",
    'CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status)',
    "CREATE TABLE IF NOT EXISTS newsletter_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriber_id INTEGER NOT NULL, type TEXT NOT NULL CHECK (type IN ('confirm', 'unsubscribe', 'manage')), token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, used_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id))",
    'CREATE INDEX IF NOT EXISTS idx_newsletter_tokens_lookup ON newsletter_tokens(type, token_hash)',
    "CREATE TABLE IF NOT EXISTS newsletter_campaigns (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL CHECK (kind IN ('post_published')), post_slug TEXT NOT NULL, post_title TEXT NOT NULL, post_date TEXT NOT NULL, subject TEXT NOT NULL, preview_text TEXT NOT NULL, status TEXT NOT NULL CHECK (status IN ('pending', 'sending', 'sent', 'failed')), resend_broadcast_id TEXT, sent_at TEXT, failure_reason TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE (kind, post_slug))",
    'CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status, post_date)',
    "CREATE TABLE IF NOT EXISTS newsletter_events (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriber_id INTEGER, campaign_id INTEGER, provider TEXT NOT NULL, provider_event_id TEXT, provider_message_id TEXT, event_type TEXT NOT NULL, payload_json TEXT NOT NULL, occurred_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE (provider, provider_event_id), FOREIGN KEY (subscriber_id) REFERENCES newsletter_subscribers(id), FOREIGN KEY (campaign_id) REFERENCES newsletter_campaigns(id))",
    'CREATE INDEX IF NOT EXISTS idx_newsletter_events_subscriber ON newsletter_events(subscriber_id)',
    "CREATE TABLE IF NOT EXISTS newsletter_signup_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT, key_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))",
    'CREATE INDEX IF NOT EXISTS idx_newsletter_signup_attempts_key_hash ON newsletter_signup_attempts(key_hash, created_at)',
  ])
}

let initialized = false

const ensureDb = async (): Promise<Client> => {
  if (!initialized) {
    await initDb()
    initialized = true
  }
  return getClient()
}

export { ensureDb }

export interface ReactionCounts {
  dislikes: number
  likes: number
  views: number
}

export const getReactionCounts = async (slug: string): Promise<ReactionCounts> => {
  const db = await ensureDb()
  const [likes, dislikes, views] = await Promise.all([
    db.execute({
      sql: 'SELECT COUNT(*) as count FROM reactions WHERE slug = ? AND type = ?',
      args: [slug, 'like'],
    }),
    db.execute({
      sql: 'SELECT COUNT(*) as count FROM reactions WHERE slug = ? AND type = ?',
      args: [slug, 'dislike'],
    }),
    db.execute({
      sql: 'SELECT COUNT(*) as count FROM blog_views WHERE slug = ?',
      args: [slug],
    }),
  ])

  return {
    likes: (likes.rows[0]?.count as number) ?? 0,
    dislikes: (dislikes.rows[0]?.count as number) ?? 0,
    views: (views.rows[0]?.count as number) ?? 0,
  }
}

export const addLike = async (slug: string, fingerprint: string): Promise<ReactionCounts> => {
  const db = await ensureDb()
  await db.execute({
    sql: 'INSERT INTO reactions (slug, type, fingerprint) VALUES (?, ?, ?)',
    args: [slug, 'like', fingerprint],
  })
  return getReactionCounts(slug)
}

export const addView = async (slug: string): Promise<ReactionCounts> => {
  const db = await ensureDb()
  await db.execute({
    sql: 'INSERT INTO blog_views (slug) VALUES (?)',
    args: [slug],
  })
  return getReactionCounts(slug)
}

export const hasDisliked = async (slug: string, fingerprint: string): Promise<boolean> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: 'SELECT id FROM reactions WHERE slug = ? AND type = ? AND fingerprint = ?',
    args: [slug, 'dislike', fingerprint],
  })
  return result.rows.length > 0
}

export const toggleDislike = async (
  slug: string,
  fingerprint: string,
): Promise<ReactionCounts & { userDisliked: boolean }> => {
  const db = await ensureDb()
  const existing = await hasDisliked(slug, fingerprint)

  if (existing) {
    await db.execute({
      sql: 'DELETE FROM reactions WHERE slug = ? AND type = ? AND fingerprint = ?',
      args: [slug, 'dislike', fingerprint],
    })
    return { ...(await getReactionCounts(slug)), userDisliked: false }
  }

  await db.execute({
    sql: 'INSERT INTO reactions (slug, type, fingerprint) VALUES (?, ?, ?)',
    args: [slug, 'dislike', fingerprint],
  })
  return { ...(await getReactionCounts(slug)), userDisliked: true }
}

export interface CommentRow {
  author_email: string | null
  author_name: string
  content: string
  created_at: string
  fingerprint: string
  id: number
  parent_id: number | null
  slug: string
}

const rowToComment = (row: Record<string, unknown>): CommentRow => ({
  id: row.id as number,
  slug: row.slug as string,
  parent_id: (row.parent_id as number | null) ?? null,
  author_name: row.author_name as string,
  author_email: (row.author_email as string | null) ?? null,
  content: row.content as string,
  fingerprint: row.fingerprint as string,
  created_at: row.created_at as string,
})

export const getComments = async (slug: string): Promise<CommentRow[]> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: 'SELECT * FROM comments WHERE slug = ? ORDER BY created_at ASC',
    args: [slug],
  })
  return result.rows.map((row) => rowToComment(row as unknown as Record<string, unknown>))
}

export const createComment = async (data: {
  slug: string
  parentId?: number | null
  authorName: string
  authorEmail?: string
  content: string
  fingerprint: string
}): Promise<CommentRow> => {
  const db = await ensureDb()
  let parentId = data.parentId ?? null

  if (parentId) {
    const parentResult = await db.execute({
      sql: 'SELECT id, parent_id FROM comments WHERE id = ? AND slug = ?',
      args: [parentId, data.slug],
    })
    const parent = parentResult.rows[0] as unknown as
      | { id: number; parent_id: number | null }
      | undefined
    if (!parent) {
      parentId = null
    } else if (parent.parent_id !== null) {
      parentId = parent.parent_id
    }
  }

  const result = await db.execute({
    sql: 'INSERT INTO comments (slug, parent_id, author_name, author_email, content, fingerprint) VALUES (?, ?, ?, ?, ?, ?)',
    args: [
      data.slug,
      parentId,
      data.authorName,
      data.authorEmail || null,
      data.content,
      data.fingerprint,
    ],
  })

  const row = await db.execute({
    sql: 'SELECT * FROM comments WHERE id = ?',
    args: [Number(result.lastInsertRowid)],
  })
  return rowToComment(row.rows[0] as unknown as Record<string, unknown>)
}

export const deleteComment = async (id: number, fingerprint: string): Promise<boolean> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: 'SELECT id, fingerprint FROM comments WHERE id = ?',
    args: [id],
  })
  const comment = result.rows[0] as unknown as { id: number; fingerprint: string } | undefined

  if (!comment || comment.fingerprint !== fingerprint) {
    return false
  }

  await db.execute({ sql: 'DELETE FROM comments WHERE parent_id = ?', args: [id] })
  await db.execute({ sql: 'DELETE FROM comments WHERE id = ?', args: [id] })
  return true
}
