import { Section, Text } from '@react-email/components'

import NewsletterShell, { newsletterEmailStyles } from './components/newsletter-shell'

interface NewsletterWelcomeEmailProps {
  blogUrl: string
}

const NewsletterWelcomeEmail = ({ blogUrl }: NewsletterWelcomeEmailProps) => (
  <NewsletterShell
    ctaHref={blogUrl}
    ctaLabel="Browse the latest posts"
    footerNote="You are all set. Future blog posts will now arrive automatically after they go live."
    preview="Your newsletter subscription is confirmed. You will now receive new post updates from anmdotdev."
    title="You are subscribed"
  >
    <Text style={newsletterEmailStyles.text}>
      Your subscription is confirmed. From here on out, you&apos;ll get one email whenever a new
      blog post is published.
    </Text>
    <Section style={newsletterEmailStyles.panel}>
      <Text style={newsletterEmailStyles.strongText}>What happens next:</Text>
      <Text style={newsletterEmailStyles.text}>
        When a new article goes live, you&apos;ll get a short preview and a direct link to read the
        full post on anmdotdev.
      </Text>
    </Section>
    <Text style={newsletterEmailStyles.meta}>
      No weekly digest. No unrelated announcements. Just new posts.
    </Text>
  </NewsletterShell>
)

export default NewsletterWelcomeEmail
