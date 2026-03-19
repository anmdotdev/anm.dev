import NewsletterSignupCard from 'components/newsletter/signup-card'
import { isNewsletterConfigured } from 'lib/newsletter'
import Reactions from './reactions'
import ShareButton from './share-button'

interface PostFooterActionsProps {
  slug: string
  title: string
}

const PostFooterActions = ({ slug, title }: PostFooterActionsProps) => {
  const newsletterEnabled = isNewsletterConfigured()

  return (
    <div className="mt-12 border-gray-lighter border-t pt-8 dark:border-dark-border">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-dark text-xs dark:text-dark-text-muted">
            Was this helpful?
          </span>
          <Reactions />
        </div>

        <ShareButton label="Share this post" slug={slug} title={title} visibleLabel="always" />
      </div>
      <NewsletterSignupCard
        className="mt-6"
        description="If this piece was useful, subscribe to get the next one in your inbox."
        enabled={newsletterEnabled}
        source={`post-footer-${slug}`}
        title="Get future posts by email"
      />
    </div>
  )
}

export default PostFooterActions
