import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const AppleIcon = async () => {
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6tjPQ.ttf',
  ).then((res) => res.arrayBuffer())

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
          fontSize: 96,
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
        }}
      >
        am
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
