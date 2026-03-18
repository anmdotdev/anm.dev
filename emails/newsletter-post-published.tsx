import { Link, Section, Text } from '@react-email/components'

import NewsletterShell, { newsletterEmailStyles } from './components/newsletter-shell'

interface NewsletterPostPublishedEmailProps {
  excerpt: string
  postDateLabel: string
  postUrl: string
  preview: string
  readingTime: string
  summary: string
  tags: string[]
  title: string
  unsubscribeUrl?: string
}

const NewsletterPostPublishedEmail = ({
  excerpt,
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
    <Section style={newsletterEmailStyles.panel}>
      <Text style={newsletterEmailStyles.text}>{excerpt}</Text>
    </Section>
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
