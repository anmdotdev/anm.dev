import { ImageResponse } from 'next/og'

export const alt = 'anmdotdev - Anmol Mahatpurkar'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const OgImage = () =>
  new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: '#6a35ff',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
            marginRight: 16,
          }}
        >
          A
        </div>
        <span style={{ color: '#e5e5e5', fontSize: 28, fontWeight: 600 }}>anmdotdev</span>
      </div>
      <h1
        style={{
          color: '#ffffff',
          fontSize: 48,
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.2,
          marginBottom: '16px',
        }}
      >
        Anmol Mahatpurkar
      </h1>
      <p
        style={{
          color: '#a0a0a0',
          fontSize: 24,
          textAlign: 'center',
          maxWidth: 700,
        }}
      >
        Staff Frontend Engineer | React & TypeScript | Design Systems
      </p>
    </div>,
    { ...size },
  )

export default OgImage
