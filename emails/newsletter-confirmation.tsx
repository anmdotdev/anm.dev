import { Link, Section, Text } from '@react-email/components'

import NewsletterShell, { newsletterEmailStyles } from './components/newsletter-shell'

interface NewsletterConfirmationEmailProps {
  confirmUrl: string
}

const NewsletterConfirmationEmail = ({ confirmUrl }: NewsletterConfirmationEmailProps) => (
  <NewsletterShell
    ctaHref={confirmUrl}
    ctaLabel="Confirm subscription"
    footerNote="If you did not request this, you can safely ignore this email."
    preview="Confirm your subscription to new-post notifications from anmdotdev."
    title="Confirm your subscription"
  >
    <Text style={newsletterEmailStyles.text}>
      One more step and you&apos;re in. Confirm your email address to receive a note whenever a new
      blog post goes live.
    </Text>
    <Section style={newsletterEmailStyles.panel}>
      <Text style={newsletterEmailStyles.strongText}>What you&apos;ll get:</Text>
      <Text style={newsletterEmailStyles.text}>
        New blog post alerts, short preview copy, and a direct link to the full article. No digest
        spam. No unrelated announcements.
      </Text>
    </Section>
    <Text style={{ ...newsletterEmailStyles.meta, marginTop: '20px' }}>
      If the button does not work, copy and paste this URL into your browser:
    </Text>
    <Text style={newsletterEmailStyles.footer}>
      <Link href={confirmUrl} style={newsletterEmailStyles.link}>
        {confirmUrl}
      </Link>
    </Text>
  </NewsletterShell>
)

export default NewsletterConfirmationEmail
