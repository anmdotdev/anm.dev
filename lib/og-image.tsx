import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'
import { cache } from 'react'

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const
export const DEFAULT_OG_ALT = 'Anmol Mahatpurkar Open Graph image'
export const BLOG_OG_ALT = 'Anmol Mahatpurkar blog post Open Graph image'

const AUTHOR_NAME = 'Anmol Mahatpurkar'
const SITE_LABEL = 'anm.dev'
const MAX_TITLE_LINES = 5
const TITLE_FONT_SIZES = [46, 44, 42, 40, 38, 36, 34] as const
const WHITESPACE_REGEX = /\s+/

const readPublicAsset = cache(
  async (relativePath: string): Promise<Buffer> =>
    readFile(join(process.cwd(), 'public', relativePath)),
)

const toArrayBuffer = (buffer: Buffer): ArrayBuffer =>
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer

const toDataUrl = (mimeType: string, buffer: Buffer): string =>
  `data:${mimeType};base64,${buffer.toString('base64')}`

export const getOgImageAssets = cache(async () => {
  const [background, avatar, font] = await Promise.all([
    readPublicAsset('images/og-blank.png'),
    readPublicAsset('images/profile.jpeg'),
    readPublicAsset('fonts/JetBrainsMono-Bold.ttf'),
  ])

  return {
    avatarSrc: toDataUrl('image/jpeg', avatar),
    backgroundSrc: toDataUrl('image/png', background),
    fonts: [
      {
        name: 'JetBrains Mono',
        data: toArrayBuffer(font),
        style: 'normal' as const,
        weight: 700 as const,
      },
    ],
  }
})

const getApproxCharsPerLine = (fontSize: number): number => {
  if (fontSize <= 34) {
    return 20
  }

  if (fontSize <= 36) {
    return 19
  }

  if (fontSize <= 38) {
    return 18
  }

  if (fontSize <= 40) {
    return 17
  }

  if (fontSize <= 42) {
    return 16
  }

  if (fontSize <= 44) {
    return 15
  }

  return 14
}

const truncateWithEllipsis = (value: string, limit: number): string => {
  if (value.length <= limit) {
    return value
  }

  return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}...`
}

const wrapTitleLines = (title: string, maxCharsPerLine: number): string[] => {
  const words = title.trim().split(WHITESPACE_REGEX).filter(Boolean)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if (!currentLine) {
      currentLine = word
      continue
    }

    const nextLine = `${currentLine} ${word}`
    if (nextLine.length <= maxCharsPerLine) {
      currentLine = nextLine
      continue
    }

    lines.push(currentLine)
    currentLine = word
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

const formatTitleForCard = (
  title: string,
): {
  fontSize: number
  text: string
} => {
  const normalizedTitle = title.trim().replace(WHITESPACE_REGEX, ' ')

  for (const fontSize of TITLE_FONT_SIZES) {
    const lines = wrapTitleLines(normalizedTitle, getApproxCharsPerLine(fontSize))

    if (lines.length <= MAX_TITLE_LINES) {
      return {
        fontSize,
        text: lines.join('\n'),
      }
    }
  }

  const fontSize = TITLE_FONT_SIZES.at(-1) ?? 38
  const maxCharsPerLine = getApproxCharsPerLine(fontSize)
  const lines = wrapTitleLines(normalizedTitle, maxCharsPerLine)
  const visibleLines = lines.slice(0, MAX_TITLE_LINES)
  const remainingLines = lines.slice(MAX_TITLE_LINES)

  if (remainingLines.length > 0) {
    const lastLine = visibleLines.at(-1) ?? ''
    const overflowText = `${lastLine} ${remainingLines.join(' ')}`.trim()
    visibleLines[visibleLines.length - 1] = truncateWithEllipsis(overflowText, maxCharsPerLine)
  }

  return {
    fontSize,
    text: visibleLines.join('\n'),
  }
}

const formatPublishDate = (value: string): string => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1))

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

const buildMetaLabel = (date?: string, tags: string[] = []): string | undefined => {
  const parts = [date ? formatPublishDate(date) : undefined, ...tags.slice(0, 3)].filter(Boolean)

  return parts.length > 0 ? parts.join(' | ') : undefined
}

interface IOgCardProps {
  avatarSrc: string
  backgroundSrc: string
  date?: string
  showAuthor?: boolean
  tags?: string[]
  title?: string
}

export const OgCard = ({
  avatarSrc,
  backgroundSrc,
  date,
  showAuthor = false,
  tags,
  title,
}: IOgCardProps) => {
  const formattedTitle = title ? formatTitleForCard(title) : undefined
  const metaLabel = buildMetaLabel(date, tags)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        color: '#050505',
        fontFamily: 'JetBrains Mono',
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: next/og ImageResponse renders standard img elements */}
      <img
        alt=""
        height={OG_IMAGE_SIZE.height}
        src={backgroundSrc}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
        width={OG_IMAGE_SIZE.width}
      />
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: '92px 76px 88px 726px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '422px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: 24,
              lineHeight: 1,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                display: 'flex',
                position: 'relative',
                width: 28,
                height: 28,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 2,
                  width: 14,
                  height: 14,
                  border: '2px solid #050505',
                  borderRadius: '9999px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 2,
                  bottom: 4,
                  width: 14,
                  height: 14,
                  border: '2px solid #050505',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <span>{SITE_LABEL}</span>
          </div>

          {formattedTitle ? (
            <div
              style={{
                display: 'block',
                marginTop: '32px',
                fontSize: formattedTitle.fontSize,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {formattedTitle.text}
            </div>
          ) : null}

          {formattedTitle && metaLabel ? (
            <div
              style={{
                display: 'block',
                marginTop: '18px',
                color: '#5B6270',
                fontSize: 18,
                lineHeight: 1.35,
              }}
            >
              {metaLabel}
            </div>
          ) : null}

          {showAuthor ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: metaLabel ? '22px' : '30px',
                fontSize: 22,
                lineHeight: 1.2,
              }}
            >
              {/* biome-ignore lint/performance/noImgElement: next/og ImageResponse renders standard img elements */}
              <img
                alt=""
                height={40}
                src={avatarSrc}
                style={{
                  borderRadius: '9999px',
                }}
                width={40}
              />
              <span>{AUTHOR_NAME}</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

interface OgImageResponseOptions {
  date?: string
  showAuthor?: boolean
  tags?: string[]
  title?: string
}

export const createOgImageResponse = async ({
  date,
  showAuthor = false,
  tags,
  title,
}: OgImageResponseOptions): Promise<ImageResponse> => {
  const { avatarSrc, backgroundSrc, fonts } = await getOgImageAssets()

  return new ImageResponse(
    <OgCard
      avatarSrc={avatarSrc}
      backgroundSrc={backgroundSrc}
      date={date}
      showAuthor={showAuthor}
      tags={tags}
      title={title}
    />,
    {
      ...OG_IMAGE_SIZE,
      fonts,
    },
  )
}
