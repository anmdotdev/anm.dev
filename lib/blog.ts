import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const MDX_EXTENSION = /\.mdx$/
const DATE_ONLY_REGEX = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/
const CODE_FENCE_PREFIX = '```'
const HORIZONTAL_RULE = '---'
const BLOCKQUOTE_PREFIX_REGEX = /^>\s?/
const HEADING_PREFIX_REGEX = /^#{1,6}\s+/
const ORDERED_LIST_PREFIX_REGEX = /^\d+\.\s+/
const UNORDERED_LIST_PREFIX_REGEX = /^-\s+/
const HEADING_LINE_REGEX = /^(#{2,3})\s+(.+)$/
const UNORDERED_LIST_LINE_REGEX = /^-\s+(.+)$/
const ORDERED_LIST_LINE_REGEX = /^\d+\.\s+(.+)$/

const IS_DEV = process.env.NODE_ENV === 'development'
const SITE_TIME_ZONE = 'Asia/Kolkata'
const SITE_TIME_OFFSET = '+05:30'
export const MIN_INDEXABLE_TAG_POSTS = 2

export const SCHEDULED_CONTENT_PREVIEW_ENABLED =
  process.env.ENABLE_SCHEDULED_CONTENT_PREVIEW === 'true'

const SCHEDULED_CONTENT_VISIBLE = IS_DEV || SCHEDULED_CONTENT_PREVIEW_ENABLED

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const getDateParts = (
  date: Date,
  timeZone = SITE_TIME_ZONE,
): {
  day: string
  month: string
  year: string
} => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  if (!(year && month && day)) {
    throw new Error('Unable to normalize blog date.')
  }

  return { year, month, day }
}

const getDateKey = (date: Date, timeZone = SITE_TIME_ZONE): string => {
  const { year, month, day } = getDateParts(date, timeZone)
  return `${year}-${month}-${day}`
}

const normalizeFrontmatterDate = (value: unknown): string => {
  if (value instanceof Date) {
    const year = value.getUTCFullYear()
    const month = `${value.getUTCMonth() + 1}`.padStart(2, '0')
    const day = `${value.getUTCDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    const dateOnlyMatch = trimmed.match(DATE_ONLY_REGEX)

    if (dateOnlyMatch?.groups) {
      return `${dateOnlyMatch.groups.year}-${dateOnlyMatch.groups.month}-${dateOnlyMatch.groups.day}`
    }

    const parsed = new Date(trimmed)
    if (!Number.isNaN(parsed.getTime())) {
      return getDateKey(parsed)
    }
  }

  throw new Error('Blog frontmatter date must be a valid date string.')
}

const toDateTime = (dateKey: string): string => `${dateKey}T00:00:00${SITE_TIME_OFFSET}`

const currentDateKey = (): string => getDateKey(new Date())

const isPublished = (dateKey: string): boolean => dateKey <= currentDateKey()

const stripJsxTags = (content: string): string =>
  content
    .replace(/<([A-Za-z][\w-]*)(\s[^>]*)?\/>/g, '')
    .replace(/<\/?([A-Za-z][\w-]*)(\s[^>]*)?>/g, '')

const normalizeInlineMarkdown = (value: string): string =>
  value
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_~`>#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const stripPlainTextPrefixes = (value: string): string =>
  value
    .replace(BLOCKQUOTE_PREFIX_REGEX, '')
    .replace(HEADING_PREFIX_REGEX, '')
    .replace(ORDERED_LIST_PREFIX_REGEX, '')
    .replace(UNORDERED_LIST_PREFIX_REGEX, '')

const mdxToPlainText = (content: string): string => {
  const lines = stripJsxTags(content).split('\n')
  const plainLines: string[] = []
  let inCodeBlock = false

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()

    if (line.startsWith(CODE_FENCE_PREFIX)) {
      inCodeBlock = !inCodeBlock
      continue
    }

    if (inCodeBlock) {
      plainLines.push(line)
      continue
    }

    plainLines.push(normalizeInlineMarkdown(stripPlainTextPrefixes(line)))
  }

  return plainLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const renderInlineMarkdown = (value: string): string =>
  escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, altText: string) =>
      altText ? `<span>${escapeHtml(altText)}</span>` : '',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, label: string, url: string) =>
        `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`,
    )
    .replace(/`([^`]+)`/g, (_match, code: string) => `<code>${escapeHtml(code)}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')

interface FeedRenderState {
  blockquoteLines: string[]
  codeLines: string[]
  html: string[]
  inBlockquote: boolean
  inCodeBlock: boolean
  listType: 'ol' | 'ul' | null
  paragraphLines: string[]
}

const createFeedRenderState = (): FeedRenderState => ({
  html: [],
  inCodeBlock: false,
  codeLines: [],
  listType: null,
  paragraphLines: [],
  inBlockquote: false,
  blockquoteLines: [],
})

const flushParagraph = (state: FeedRenderState) => {
  if (state.paragraphLines.length === 0) {
    return
  }

  state.html.push(`<p>${renderInlineMarkdown(state.paragraphLines.join(' '))}</p>`)
  state.paragraphLines = []
}

const flushList = (state: FeedRenderState) => {
  if (!state.listType) {
    return
  }

  state.html.push(`</${state.listType}>`)
  state.listType = null
}

const flushBlockquote = (state: FeedRenderState) => {
  if (!state.inBlockquote) {
    return
  }

  const contentHtml = state.blockquoteLines
    .filter(Boolean)
    .map((line) => `<p>${renderInlineMarkdown(line)}</p>`)
    .join('')

  state.html.push(`<blockquote>${contentHtml}</blockquote>`)
  state.blockquoteLines = []
  state.inBlockquote = false
}

const flushCodeBlock = (state: FeedRenderState) => {
  if (state.codeLines.length === 0) {
    return
  }

  state.html.push(`<pre><code>${escapeHtml(state.codeLines.join('\n'))}</code></pre>`)
  state.codeLines = []
}

const flushTextBlocks = (state: FeedRenderState) => {
  flushParagraph(state)
  flushList(state)
  flushBlockquote(state)
}

const appendListItem = (state: FeedRenderState, type: 'ol' | 'ul', value: string) => {
  flushParagraph(state)
  flushBlockquote(state)

  if (state.listType !== type) {
    flushList(state)
    state.html.push(`<${type}>`)
    state.listType = type
  }

  state.html.push(`<li>${renderInlineMarkdown(value.trim())}</li>`)
}

const handleFeedFence = (state: FeedRenderState, trimmed: string): boolean => {
  if (!trimmed.startsWith(CODE_FENCE_PREFIX)) {
    return false
  }

  flushTextBlocks(state)
  if (state.inCodeBlock) {
    flushCodeBlock(state)
  }
  state.inCodeBlock = !state.inCodeBlock
  return true
}

const handleFeedStructuralLine = (state: FeedRenderState, trimmed: string): boolean => {
  if (!trimmed) {
    flushTextBlocks(state)
    return true
  }

  if (trimmed === HORIZONTAL_RULE) {
    flushTextBlocks(state)
    state.html.push('<hr />')
    return true
  }

  const headingMatch = trimmed.match(HEADING_LINE_REGEX)
  if (headingMatch) {
    flushTextBlocks(state)
    const level = headingMatch[1].length
    state.html.push(`<h${level}>${renderInlineMarkdown(headingMatch[2].trim())}</h${level}>`)
    return true
  }

  const unorderedListMatch = trimmed.match(UNORDERED_LIST_LINE_REGEX)
  if (unorderedListMatch) {
    appendListItem(state, 'ul', unorderedListMatch[1])
    return true
  }

  const orderedListMatch = trimmed.match(ORDERED_LIST_LINE_REGEX)
  if (orderedListMatch) {
    appendListItem(state, 'ol', orderedListMatch[1])
    return true
  }

  if (trimmed.startsWith('>')) {
    flushParagraph(state)
    flushList(state)
    state.inBlockquote = true
    state.blockquoteLines.push(trimmed.replace(BLOCKQUOTE_PREFIX_REGEX, ''))
    return true
  }

  return false
}

const mdxToFeedHtml = (content: string): string => {
  const state = createFeedRenderState()
  const lines = stripJsxTags(content).split('\n')

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (handleFeedFence(state, trimmed)) {
      continue
    }

    if (state.inCodeBlock) {
      state.codeLines.push(rawLine)
      continue
    }

    if (handleFeedStructuralLine(state, trimmed)) {
      continue
    }

    flushList(state)
    flushBlockquote(state)
    state.paragraphLines.push(trimmed)
  }

  flushTextBlocks(state)
  if (state.inCodeBlock) {
    flushCodeBlock(state)
  }

  return state.html.join('\n')
}

const getBlogFiles = (): string[] => {
  if (!fs.existsSync(BLOG_DIR)) {
    return []
  }

  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'))
}

const toTagSlug = (tag: string): string =>
  tag
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

interface ParsedBlogFile {
  content: string
  date: string
  dateTime: string
  draft: boolean
  feedHtml: string
  lastModified?: string
  lastModifiedTime?: string
  newsletterDisabled: boolean
  newsletterExcerpt?: string
  newsletterPreview?: string
  newsletterSubject?: string
  plainText: string
  readingTime: string
  scheduled: boolean
  series?: string
  seriesOrder?: number
  seriesTitle?: string
  slug: string
  summary: string
  tags: string[]
  title: string
}

interface BlogPostQueryOptions {
  includeDrafts?: boolean
  includeScheduled?: boolean
}

const parseBlogFile = (slug: string): ParsedBlogFile | null => {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const date = normalizeFrontmatterDate(data.date)
  const lastModified = data.lastModified ? normalizeFrontmatterDate(data.lastModified) : undefined
  const draft = Boolean(data.draft)
  const scheduled = !(draft || isPublished(date))
  const plainText = mdxToPlainText(content)

  return {
    slug,
    title: typeof data.title === 'string' ? data.title : slug,
    date,
    dateTime: toDateTime(date),
    lastModified,
    lastModifiedTime: lastModified ? toDateTime(lastModified) : undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    summary: typeof data.summary === 'string' ? data.summary : '',
    draft,
    scheduled,
    newsletterDisabled: Boolean(data.newsletterDisabled),
    newsletterExcerpt:
      typeof data.newsletterExcerpt === 'string' ? data.newsletterExcerpt : undefined,
    newsletterPreview:
      typeof data.newsletterPreview === 'string' ? data.newsletterPreview : undefined,
    newsletterSubject:
      typeof data.newsletterSubject === 'string' ? data.newsletterSubject : undefined,
    series: typeof data.series === 'string' ? data.series : undefined,
    seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : undefined,
    seriesTitle: typeof data.seriesTitle === 'string' ? data.seriesTitle : undefined,
    readingTime: readingTime(plainText).text,
    content,
    plainText,
    feedHtml: mdxToFeedHtml(content),
  }
}

export interface BlogPost {
  content: string
  date: string
  dateTime: string
  draft: boolean
  feedHtml: string
  lastModified?: string
  lastModifiedTime?: string
  newsletterDisabled: boolean
  newsletterExcerpt?: string
  newsletterPreview?: string
  newsletterSubject?: string
  plainText: string
  readingTime: string
  scheduled: boolean
  series?: string
  seriesOrder?: number
  seriesTitle?: string
  slug: string
  summary: string
  tags: string[]
  title: string
}

const shouldIncludePost = (
  post: Pick<BlogPost, 'draft' | 'scheduled'>,
  { includeDrafts = IS_DEV, includeScheduled = IS_DEV }: BlogPostQueryOptions = {},
): boolean => {
  if (post.draft) {
    return includeDrafts
  }

  if (post.scheduled) {
    return includeScheduled
  }

  return true
}

const sortPostsByDate = (posts: BlogPost[]): BlogPost[] =>
  posts.sort((a, b) => b.date.localeCompare(a.date))

export const getBlogPosts = (options?: BlogPostQueryOptions): BlogPost[] => {
  const posts = getBlogFiles()
    .map((file) => file.replace(MDX_EXTENSION, ''))
    .map((slug) => parseBlogFile(slug))
    .filter((post): post is BlogPost => Boolean(post))
    .filter((post) => shouldIncludePost(post, options))

  return sortPostsByDate(posts)
}

export const getBlogPost = (slug: string, options?: BlogPostQueryOptions): BlogPost | null => {
  const post = parseBlogFile(slug)
  if (!post) {
    return null
  }

  if (
    !shouldIncludePost(post, {
      includeDrafts: IS_DEV,
      includeScheduled: SCHEDULED_CONTENT_VISIBLE,
      ...options,
    })
  ) {
    return null
  }

  return post
}

export const getSeriesPosts = (series: string, options?: BlogPostQueryOptions): BlogPost[] =>
  getBlogPosts(options)
    .filter((post) => post.series === series)
    .sort((a, b) => {
      if (a.seriesOrder != null && b.seriesOrder != null) {
        return a.seriesOrder - b.seriesOrder
      }
      if (a.seriesOrder != null) {
        return -1
      }
      if (b.seriesOrder != null) {
        return 1
      }
      return a.date.localeCompare(b.date)
    })

export const getRelatedPosts = (
  currentSlug: string,
  currentTags: string[],
  limit = 3,
  options?: BlogPostQueryOptions,
): BlogPost[] => {
  const posts = getBlogPosts(options).filter((post) => post.slug !== currentSlug)

  const scored = posts.map((post) => {
    const sharedTags = post.tags.filter((tag) => currentTags.includes(tag)).length
    return { post, score: sharedTags }
  })

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}

export const getTagCounts = (): Record<string, number> => {
  const tagCounts: Record<string, number> = {}

  for (const post of getBlogPosts()) {
    for (const tag of post.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
    }
  }

  return tagCounts
}

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>()

  for (const tag of Object.keys(getTagCounts())) {
    tagSet.add(tag)
  }

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
}

export const getIndexableTags = (): string[] =>
  getAllTags().filter((tag) => (getTagCounts()[tag] ?? 0) >= MIN_INDEXABLE_TAG_POSTS)

export const getTagSlug = (tag: string): string => toTagSlug(tag)

export const resolveTag = (tagOrSlug: string): string | null => {
  const normalized = tagOrSlug.trim().toLowerCase()

  for (const tag of getAllTags()) {
    if (tag.toLowerCase() === normalized || toTagSlug(tag) === normalized) {
      return tag
    }
  }

  return null
}

export const getTagPath = (tag: string): string => `/blog/tag/${toTagSlug(tag)}`

export const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export const getArticleDateTime = (post: Pick<BlogPost, 'dateTime'>): string => post.dateTime

export const getArticleModifiedTime = (
  post: Pick<BlogPost, 'dateTime' | 'lastModifiedTime'>,
): string => post.lastModifiedTime || post.dateTime
