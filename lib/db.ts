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
    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL, parent_id INTEGER, author_name TEXT NOT NULL, author_email TEXT, content TEXT NOT NULL, fingerprint TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (parent_id) REFERENCES comments(id))",
    'CREATE INDEX IF NOT EXISTS idx_comments_slug ON comments(slug)',
    'CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id)',
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

export const getReactionCounts = async (
  slug: string,
): Promise<{ likes: number; dislikes: number }> => {
  const db = await ensureDb()
  const likes = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM reactions WHERE slug = ? AND type = ?',
    args: [slug, 'like'],
  })
  const dislikes = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM reactions WHERE slug = ? AND type = ?',
    args: [slug, 'dislike'],
  })
  return {
    likes: (likes.rows[0]?.count as number) ?? 0,
    dislikes: (dislikes.rows[0]?.count as number) ?? 0,
  }
}

export const addLike = async (
  slug: string,
  fingerprint: string,
): Promise<{ likes: number; dislikes: number }> => {
  const db = await ensureDb()
  await db.execute({
    sql: 'INSERT INTO reactions (slug, type, fingerprint) VALUES (?, ?, ?)',
    args: [slug, 'like', fingerprint],
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
): Promise<{ likes: number; dislikes: number; userDisliked: boolean }> => {
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
