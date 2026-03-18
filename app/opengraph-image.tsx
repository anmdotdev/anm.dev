import { createOgImageResponse, DEFAULT_OG_ALT, OG_IMAGE_SIZE } from 'lib/og-image'

export const alt = DEFAULT_OG_ALT
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const revalidate = 3600

const OgImage = () => createOgImageResponse({})

export default OgImage
