import { classnames } from 'lib/helpers'

import NewsletterSignupForm from './signup-form'

interface NewsletterSignupCardProps {
  buttonLabel?: string
  className?: string
  compact?: boolean
  description: string
  enabled: boolean
  id?: string
  source: string
  title: string
}

const NewsletterSignupCard = ({
  buttonLabel,
  className,
  compact = false,
  description,
  enabled,
  id,
  source,
  title,
}: NewsletterSignupCardProps) => {
  const inputId = `newsletter-email-${source.replace(/[^a-z0-9]+/gi, '-')}`

  return (
    <section
      className={classnames(
        'rounded-2xl border border-gray-lighter bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface',
        compact ? 'p-5' : 'p-6 sm:p-8',
        className,
      )}
      id={id}
    >
      <p className="mb-2 font-semibold text-[11px] text-purple uppercase tracking-[0.16em] dark:text-purple-light">
        Newsletter
      </p>
      <h2
        className={classnames(
          'font-semibold text-black dark:text-dark-text',
          compact ? 'text-lg' : 'text-2xl',
        )}
      >
        {title}
      </h2>
      <p
        className={classnames(
          'mt-2 text-gray-dark dark:text-dark-text-secondary',
          compact ? 'text-sm' : 'text-base',
        )}
      >
        {description}
      </p>
      <div className="mt-5">
        <NewsletterSignupForm
          buttonLabel={buttonLabel}
          disabled={!enabled}
          inputId={inputId}
          source={source}
        />
      </div>
      <p className="mt-3 text-gray text-xs dark:text-dark-text-muted">
        No spam, ever. Double opt-in. One email per new post. Unsubscribe any time.
      </p>
    </section>
  )
}

export default NewsletterSignupCard
