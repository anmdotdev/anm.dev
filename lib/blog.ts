import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const MDX_EXTENSION = /\.mdx$/
const IS_DEV = process.env.NODE_ENV === 'development'

// Strip MDX/JSX components, code blocks, and frontmatter artifacts so
// reading-time only counts prose words the reader actually reads.
const stripMdxSyntax = (content: string): string =>
  content
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/<\w+[\s\S]*?\/>/g, '') // self-closing JSX tags
    .replace(/<\w+[\s\S]*?>[\s\S]*?<\/\w+>/g, '') // JSX block components
    .replace(/^>\s.*$/gm, '') // blockquotes
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text only
    .replace(/^---$/gm, '') // horizontal rules
    .replace(/[*_~`#]+/g, '') // inline markdown syntax

/** Returns true if the post's date is today or in the past */
const isPublished = (dateStr: string): boolean => {
  const postDate = new Date(dateStr)
  const today = new Date()
  // Compare dates only (ignore time)
  today.setHours(23, 59, 59, 999)
  return postDate.getTime() <= today.getTime()
}

export interface BlogPost {
  content: string
  date: string
  draft: boolean
  lastModified?: string
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

export const getBlogPosts = (): BlogPost[] => {
  if (!fs.existsSync(BLOG_DIR)) {
    return []
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'))

  const posts = files
    .map((file) => {
      const slug = file.replace(MDX_EXTENSION, '')
      const filePath = path.join(BLOG_DIR, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)

      const isDraft = Boolean(data.draft)
      const published = data.date ? isPublished(data.date) : false
      const scheduled = !(isDraft || published)

      // In production: skip drafts and future-dated (scheduled) posts
      // In development: skip drafts, but show scheduled posts
      if (isDraft && !IS_DEV) {
        return null
      }
      if (scheduled && !IS_DEV) {
        return null
      }

      const strippedContent = stripMdxSyntax(content)
      const stats = readingTime(strippedContent)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        lastModified: data.lastModified || undefined,
        tags: data.tags || [],
        summary: data.summary || '',
        draft: isDraft,
        scheduled,
        series: typeof data.series === 'string' ? data.series : undefined,
        seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : undefined,
        seriesTitle: typeof data.seriesTitle === 'string' ? data.seriesTitle : undefined,
        readingTime: stats.text,
        content,
      }
    })
    .filter(Boolean) as BlogPost[]

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const getBlogPost = (slug: string): BlogPost | null => {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const isDraft = Boolean(data.draft)
  const published = data.date ? isPublished(data.date) : false
  const scheduled = !(isDraft || published)

  // In production: block access to drafts and scheduled posts
  if (!IS_DEV && (isDraft || scheduled)) {
    return null
  }

  const strippedContent = stripMdxSyntax(content)
  const stats = readingTime(strippedContent)

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    lastModified: data.lastModified || undefined,
    tags: data.tags || [],
    summary: data.summary || '',
    draft: isDraft,
    scheduled,
    series: typeof data.series === 'string' ? data.series : undefined,
    seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : undefined,
    seriesTitle: typeof data.seriesTitle === 'string' ? data.seriesTitle : undefined,
    readingTime: stats.text,
    content,
  }
}

export const getSeriesPosts = (series: string): BlogPost[] => {
  return getBlogPosts()
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
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

export const getRelatedPosts = (
  currentSlug: string,
  currentTags: string[],
  limit = 3,
): BlogPost[] => {
  const posts = getBlogPosts().filter((post) => post.slug !== currentSlug)

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

export const getAllTags = (): string[] => {
  const posts = getBlogPosts()
  const tagSet = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
