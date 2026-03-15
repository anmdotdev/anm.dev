import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const MDX_EXTENSION = /\.mdx$/

export interface BlogPost {
  content: string
  date: string
  draft: boolean
  readingTime: string
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

      if (data.draft) {
        return null
      }

      const stats = readingTime(content)

      return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        tags: data.tags || [],
        summary: data.summary || '',
        draft: data.draft,
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
  const stats = readingTime(content)

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    tags: data.tags || [],
    summary: data.summary || '',
    draft: data.draft,
    readingTime: stats.text,
    content,
  }
}

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
