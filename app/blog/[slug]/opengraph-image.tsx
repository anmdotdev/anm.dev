import { getBlogPost } from 'lib/blog'
import { BLOG_OG_ALT, createOgImageResponse, OG_IMAGE_SIZE } from 'lib/og-image'
import { notFound } from 'next/navigation'

export const alt = BLOG_OG_ALT
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const revalidate = 3600

interface BlogOgImageProps {
  params: Promise<{ slug: string }>
}

const OgImage = async ({ params }: BlogOgImageProps) => {
  const { slug } = await params
  const post = getBlogPost(slug, { includeScheduled: true })

  if (!post) {
    notFound()
  }

  return createOgImageResponse({
    title: post.title,
    date: post.date,
    tags: post.tags,
    showAuthor: true,
  })
}

export default OgImage
