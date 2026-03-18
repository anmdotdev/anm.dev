import { createOgImageResponse, OG_IMAGE_SIZE } from 'lib/og-image'

export const alt = 'Blog list Open Graph image'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const revalidate = 3600

const OgImage = async () =>
  createOgImageResponse({
    title: 'Blog List',
  })

export default OgImage
