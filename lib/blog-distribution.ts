import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

import { getAbsoluteUrl } from './site'

const BLOG_DISTRIBUTION_DIR = path.join(process.cwd(), 'content', 'distribution')
const EMAIL_FILENAME = 'email.mdx'
const LINKEDIN_FILENAME = 'linkedin.md'
const TWITTER_FILENAME = 'twitter.md'
const CODE_FENCE_PREFIX = '```'
const BLOCKQUOTE_PREFIX_REGEX = /^>\s?/
const HEADING_PREFIX_REGEX = /^#{2,3}\s+/
const ORDERED_LIST_PREFIX_REGEX = /^\d+\.\s+/
const UNORDERED_LIST_PREFIX_REGEX = /^-\s+/
const HEADING_LINE_REGEX = /^#{2,3}\s+(.+)$/
const UNORDERED_LIST_LINE_REGEX = /^-\s+(.+)$/
const ORDERED_LIST_LINE_REGEX = /^\d+\.\s+(.+)$/

export type BlogEmailTextBlock =
  | {
      content: string
      type: 'heading'
    }
  | {
      content: string
      type: 'paragraph'
    }
  | {
      content: string
      type: 'quote'
    }
  | {
      items: string[]
      ordered?: boolean
      type: 'list'
    }

export interface BlogEmailDistribution {
  body: BlogEmailTextBlock[]
  preview: string
  subject: string
  summary: string
}

export interface BlogDistributionPaths {
  directory: string
  email: string
  linkedin: string
  twitter: string
}

const assertNonEmpty = (value: string, label: string): void => {
  if (!value.trim()) {
    throw new Error(`${label} must not be empty.`)
  }
}

const resolveDistributionPaths = (slug: string): BlogDistributionPaths => {
  const directory = path.join(BLOG_DISTRIBUTION_DIR, slug)

  return {
    directory,
    email: path.join(directory, EMAIL_FILENAME),
    linkedin: path.join(directory, LINKEDIN_FILENAME),
    twitter: path.join(directory, TWITTER_FILENAME),
  }
}

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

interface EmailBlockParseState {
  blockquoteLines: string[]
  blocks: BlogEmailTextBlock[]
  inBlockquote: boolean
  inCodeBlock: boolean
  listItems: string[]
  listOrdered: boolean
  paragraphLines: string[]
}

const createEmailBlockParseState = (): EmailBlockParseState => ({
  blocks: [],
  blockquoteLines: [],
  inBlockquote: false,
  inCodeBlock: false,
  listItems: [],
  listOrdered: false,
  paragraphLines: [],
})

const flushParagraph = (state: EmailBlockParseState): void => {
  if (state.paragraphLines.length === 0) {
    return
  }

  const content = normalizeInlineMarkdown(state.paragraphLines.join(' '))
  if (content) {
    state.blocks.push({
      content,
      type: 'paragraph',
    })
  }

  state.paragraphLines = []
}

const flushList = (state: EmailBlockParseState): void => {
  if (state.listItems.length === 0) {
    return
  }

  state.blocks.push({
    items: state.listItems.map((item) => normalizeInlineMarkdown(item)),
    ordered: state.listOrdered || undefined,
    type: 'list',
  })
  state.listItems = []
  state.listOrdered = false
}

const flushBlockquote = (state: EmailBlockParseState): void => {
  if (!state.inBlockquote || state.blockquoteLines.length === 0) {
    return
  }

  const content = normalizeInlineMarkdown(state.blockquoteLines.join(' '))
  if (content) {
    state.blocks.push({
      content,
      type: 'quote',
    })
  }

  state.blockquoteLines = []
  state.inBlockquote = false
}

const flushTextBlocks = (state: EmailBlockParseState): void => {
  flushParagraph(state)
  flushList(state)
  flushBlockquote(state)
}

const appendHeadingBlock = (state: EmailBlockParseState, content: string): void => {
  const normalizedContent = normalizeInlineMarkdown(content)
  if (!normalizedContent) {
    return
  }

  state.blocks.push({
    content: normalizedContent,
    type: 'heading',
  })
}

const appendListItem = (state: EmailBlockParseState, content: string, ordered: boolean): void => {
  flushParagraph(state)
  flushBlockquote(state)

  if (state.listItems.length > 0 && state.listOrdered !== ordered) {
    flushList(state)
  }

  state.listOrdered = ordered
  state.listItems.push(content)
}

const appendBlockquoteLine = (state: EmailBlockParseState, content: string): void => {
  flushParagraph(state)
  flushList(state)
  state.inBlockquote = true
  state.blockquoteLines.push(content.replace(BLOCKQUOTE_PREFIX_REGEX, ''))
}

const appendParagraphLine = (state: EmailBlockParseState, content: string): void => {
  flushList(state)
  flushBlockquote(state)
  state.paragraphLines.push(stripPlainTextPrefixes(content))
}

const handleStructuredLine = (state: EmailBlockParseState, trimmed: string): boolean => {
  const headingMatch = trimmed.match(HEADING_LINE_REGEX)
  if (headingMatch) {
    flushTextBlocks(state)
    appendHeadingBlock(state, headingMatch[1] ?? '')
    return true
  }

  const unorderedListMatch = trimmed.match(UNORDERED_LIST_LINE_REGEX)
  if (unorderedListMatch) {
    appendListItem(state, unorderedListMatch[1] ?? '', false)
    return true
  }

  const orderedListMatch = trimmed.match(ORDERED_LIST_LINE_REGEX)
  if (orderedListMatch) {
    appendListItem(state, orderedListMatch[1] ?? '', true)
    return true
  }

  if (trimmed.startsWith('>')) {
    appendBlockquoteLine(state, trimmed)
    return true
  }

  return false
}

const parseEmailBody = (content: string): BlogEmailTextBlock[] => {
  const state = createEmailBlockParseState()
  const lines = stripJsxTags(content).split('\n')

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (trimmed.startsWith(CODE_FENCE_PREFIX)) {
      flushTextBlocks(state)
      state.inCodeBlock = !state.inCodeBlock
      continue
    }

    if (state.inCodeBlock) {
      continue
    }

    if (!trimmed) {
      flushTextBlocks(state)
      continue
    }

    if (handleStructuredLine(state, trimmed)) {
      continue
    }

    appendParagraphLine(state, trimmed)
  }

  flushTextBlocks(state)
  return state.blocks
}

const readFile = (filePath: string, label: string): string => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} does not exist: ${filePath}`)
  }

  const content = fs.readFileSync(filePath, 'utf-8').trim()
  assertNonEmpty(content, label)
  return content
}

export const getBlogDistributionPaths = (slug: string): BlogDistributionPaths =>
  resolveDistributionPaths(slug)

export const getRequiredBlogEmailDistribution = (post: {
  slug: string
  title: string
}): BlogEmailDistribution => {
  const paths = resolveDistributionPaths(post.slug)
  const source = readFile(paths.email, `Email content for "${post.slug}"`)
  const { content, data } = matter(source)

  const subject = typeof data.subject === 'string' ? data.subject.trim() : ''
  const preview = typeof data.preview === 'string' ? data.preview.trim() : ''
  const summary = typeof data.summary === 'string' ? data.summary.trim() : ''
  const body = parseEmailBody(content)

  assertNonEmpty(subject, `${post.slug} email subject`)
  assertNonEmpty(preview, `${post.slug} email preview`)
  assertNonEmpty(summary, `${post.slug} email summary`)

  if (body.length === 0) {
    throw new Error(`Email body for "${post.slug}" must contain at least one block.`)
  }

  return {
    body,
    preview,
    subject,
    summary,
  }
}

export const getRequiredBlogLinkedInDraft = (slug: string): string => {
  const { linkedin } = resolveDistributionPaths(slug)
  return readFile(linkedin, `LinkedIn draft for "${slug}"`)
}

export const getRequiredBlogTwitterDraft = (slug: string): string => {
  const { twitter } = resolveDistributionPaths(slug)
  return readFile(twitter, `Twitter draft for "${slug}"`)
}

export const getBlogPostUrl = (slug: string): string => getAbsoluteUrl(`/blog/${slug}`)
