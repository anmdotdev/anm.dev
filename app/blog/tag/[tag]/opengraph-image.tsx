import { resolveTag } from 'lib/blog'
import { createOgImageResponse, OG_IMAGE_SIZE } from 'lib/og-image'
import { notFound } from 'next/navigation'

export const alt = 'Tag page Open Graph image'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const revalidate = 3600

interface TagOgImageProps {
  params: Promise<{ tag: string }>
}

const OgImage = async ({ params }: TagOgImageProps) => {
  const { tag } = await params
  const resolvedTag = resolveTag(decodeURIComponent(tag))

  if (!resolvedTag) {
    notFound()
  }

  return createOgImageResponse({
    title: `Articles tagged "${resolvedTag}"`,
  })
}

export default OgImage
