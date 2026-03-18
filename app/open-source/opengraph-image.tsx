import { createOgImageResponse, OG_IMAGE_SIZE } from 'lib/og-image'

export const alt = 'Open source projects Open Graph image'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const revalidate = 3600

const OgImage = async () =>
  createOgImageResponse({
    showAuthor: true,
    title: 'Open Source Projects',
  })

export default OgImage
