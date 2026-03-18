import { Link, Section, Text } from '@react-email/components'

import type { BlogEmailTextBlock } from 'lib/blog-distribution'

import NewsletterShell, { newsletterEmailStyles } from './components/newsletter-shell'

interface NewsletterPostPublishedEmailProps {
  body: BlogEmailTextBlock[]
  postDateLabel: string
  postUrl: string
  preview: string
  readingTime: string
  summary: string
  tags: string[]
  title: string
  unsubscribeUrl?: string
}

const renderTextBlock = (block: BlogEmailTextBlock, index: number): React.ReactNode => {
  if (block.type === 'heading') {
    return (
      <Text key={index} style={newsletterEmailStyles.sectionHeading}>
        {block.content}
      </Text>
    )
  }

  if (block.type === 'quote') {
    return (
      <Section key={index} style={{ ...newsletterEmailStyles.panel, margin: '0 0 18px' }}>
        <Text style={{ ...newsletterEmailStyles.strongText, margin: '0' }}>{block.content}</Text>
      </Section>
    )
  }

  if (block.type === 'list') {
    return (
      <Section key={index} style={{ margin: '0 0 18px' }}>
        {block.items.map((item, itemIndex) => (
          <Text
            key={`${index}-${item}`}
            style={{
              ...newsletterEmailStyles.text,
              margin: itemIndex === block.items.length - 1 ? '0' : '0 0 10px',
            }}
          >
            {block.ordered ? `${itemIndex + 1}. ${item}` : `- ${item}`}
          </Text>
        ))}
      </Section>
    )
  }

  return (
    <Text key={index} style={newsletterEmailStyles.text}>
      {block.content}
    </Text>
  )
}

const NewsletterPostPublishedEmail = ({
  body,
  postDateLabel,
  postUrl,
  preview,
  readingTime,
  summary,
  tags,
  title,
  unsubscribeUrl = '{{{RESEND_UNSUBSCRIBE_URL}}}',
}: NewsletterPostPublishedEmailProps) => (
  <NewsletterShell
    ctaHref={postUrl}
    ctaLabel="Read the full post"
    footerNote={`Want fewer emails? Unsubscribe instantly using this link: ${unsubscribeUrl}`}
    preview={preview}
    title={title}
  >
    <Text style={newsletterEmailStyles.eyebrow}>
      New post published · {postDateLabel} · {readingTime}
    </Text>
    <Text style={newsletterEmailStyles.text}>{summary}</Text>
    {body.map((block, index) => renderTextBlock(block, index))}
    {tags.length > 0 ? (
      <Text style={{ ...newsletterEmailStyles.meta, marginTop: '18px' }}>
        Topics: {tags.join(' · ')}
      </Text>
    ) : null}
    <Text style={{ ...newsletterEmailStyles.footer, marginTop: '18px' }}>
      Prefer reading in your browser?{' '}
      <Link href={postUrl} style={newsletterEmailStyles.link}>
        Open this post on anm.dev
      </Link>
      .
    </Text>
    <Text style={newsletterEmailStyles.footer}>
      <Link href={unsubscribeUrl} style={newsletterEmailStyles.link}>
        Unsubscribe
      </Link>
    </Text>
  </NewsletterShell>
)

export default NewsletterPostPublishedEmail
