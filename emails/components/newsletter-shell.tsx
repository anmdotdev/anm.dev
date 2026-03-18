import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import { AUTHOR_EMAIL, AUTHOR_NAME, getAbsoluteUrl, SITE_NAME } from 'lib/site'

const styles = {
  body: {
    backgroundColor: '#f6f7f8',
    color: '#222222',
    fontFamily:
      '"JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    margin: '0',
    padding: '32px 16px',
  },
  container: {
    backgroundColor: '#ffffff',
    border: '1px solid #dddddd',
    borderRadius: '18px',
    margin: '0 auto',
    maxWidth: '620px',
    overflow: 'hidden',
  },
  accent: {
    background: 'linear-gradient(90deg, #4317c0 0%, #6a35ff 55%, #9672ff 100%)',
    height: '8px',
    width: '100%',
  },
  header: {
    padding: '28px 32px 8px',
  },
  brand: {
    color: '#6a35ff',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.12em',
    margin: '0 0 12px',
    textTransform: 'uppercase' as const,
  },
  title: {
    color: '#222222',
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '1.25',
    margin: '0',
  },
  content: {
    padding: '0 32px 32px',
  },
  eyebrow: {
    color: '#6f6f6f',
    fontSize: '12px',
    lineHeight: '1.6',
    margin: '0 0 18px',
    textTransform: 'uppercase' as const,
  },
  text: {
    color: '#444444',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: '0 0 18px',
  },
  strongText: {
    color: '#222222',
    fontSize: '14px',
    lineHeight: '1.8',
    margin: '0 0 18px',
  },
  sectionHeading: {
    color: '#222222',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '1.6',
    margin: '0 0 12px',
  },
  panel: {
    backgroundColor: '#f6f7f8',
    border: '1px solid #dddddd',
    borderRadius: '14px',
    padding: '18px 20px',
  },
  button: {
    backgroundColor: '#6a35ff',
    borderRadius: '10px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '14px',
    fontWeight: '700',
    padding: '12px 18px',
    textDecoration: 'none',
  },
  divider: {
    borderColor: '#dddddd',
    margin: '28px 0',
  },
  footer: {
    color: '#6f6f6f',
    fontSize: '12px',
    lineHeight: '1.7',
    margin: '0 0 10px',
  },
  link: {
    color: '#3867d6',
    textDecoration: 'underline',
  },
  meta: {
    color: '#6f6f6f',
    fontSize: '12px',
    lineHeight: '1.7',
    margin: '0 0 6px',
  },
}

interface NewsletterShellProps {
  children: React.ReactNode
  ctaHref?: string
  ctaLabel?: string
  footerNote?: string
  preview: string
  title: string
}

const NewsletterShell = ({
  children,
  ctaHref,
  ctaLabel,
  footerNote,
  preview,
  title,
}: NewsletterShellProps) => (
  <Html lang="en">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section style={styles.accent} />
        <Section style={styles.header}>
          <Text style={styles.brand}>{SITE_NAME}</Text>
          <Heading style={styles.title}>{title}</Heading>
        </Section>
        <Section style={styles.content}>
          {children}
          {ctaHref && ctaLabel ? (
            <Section style={{ margin: '26px 0 0' }}>
              <Button href={ctaHref} style={styles.button}>
                {ctaLabel}
              </Button>
            </Section>
          ) : null}
          <Hr style={styles.divider} />
          <Text style={styles.footer}>
            You are receiving this because you subscribed to {AUTHOR_NAME}&apos;s blog updates on{' '}
            <Link href={getAbsoluteUrl('/blog#newsletter')} style={styles.link}>
              {SITE_NAME}
            </Link>
            .
          </Text>
          {footerNote ? <Text style={styles.footer}>{footerNote}</Text> : null}
          <Text style={styles.footer}>
            Questions? Reply directly or email{' '}
            <Link href={`mailto:${AUTHOR_EMAIL}`} style={styles.link}>
              {AUTHOR_EMAIL}
            </Link>
            .
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const newsletterEmailStyles = styles

export default NewsletterShell
