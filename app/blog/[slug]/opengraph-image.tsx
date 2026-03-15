import { getBlogPost } from 'lib/blog'
import { ImageResponse } from 'next/og'

export const alt = 'Blog post cover'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface OgImageProps {
  params: Promise<{ slug: string }>
}

const OgImage = async ({ params }: OgImageProps) => {
  const { slug } = await params
  const post = getBlogPost(slug)

  const title = post?.title ?? 'Blog'
  const tags = post?.tags ?? []

  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: '#6a35ff',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 22,
              fontWeight: 700,
              marginRight: 12,
            }}
          >
            A
          </div>
          <span style={{ color: '#a0a0a0', fontSize: 20, fontWeight: 600 }}>anmdotdev</span>
        </div>
        <h1
          style={{
            color: '#ffffff',
            fontSize: title.length > 60 ? 40 : 48,
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {title}
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            style={{
              color: '#a0a0a0',
              fontSize: 16,
              border: '1px solid #333',
              padding: '6px 14px',
              borderRadius: 20,
            }}
          >
            {tag}
          </span>
        ))}
        <span style={{ color: '#707070', fontSize: 16, marginLeft: 'auto' }}>anm.dev/blog</span>
      </div>
    </div>,
    { ...size },
  )
}

export default OgImage
