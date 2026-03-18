import fs from 'node:fs'
import path from 'node:path'

import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const AppleIcon = () => {
  const fontPath = path.join(process.cwd(), 'public', 'fonts', 'JetBrainsMono-Bold.ttf')
  const fontData = fs.readFileSync(fontPath)

  return new ImageResponse(
    <div
      style={{
        background: '#222',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 36,
      }}
    >
      <span
        style={{
          color: '#e5e5e5',
          fontSize: 72,
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
        }}
      >
        anm
      </span>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  )
}

export default AppleIcon
