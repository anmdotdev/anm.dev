import Link from 'components/ui/link'
import type { BlogPost } from 'lib/blog'

interface SeriesNavigationProps {
  currentSlug: string
  posts: BlogPost[]
}

const SeriesNavigation = ({ currentSlug, posts }: SeriesNavigationProps) => {
  const currentIndex = posts.findIndex((post) => post.slug === currentSlug)
  if (currentIndex === -1) {
    return null
  }

  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  if (!nextPost) {
    return null
  }

  return (
    <aside
      aria-label="Next in this series"
      className="mt-12 border-gray-lighter border-t pt-8 dark:border-dark-border"
    >
      <p className="text-[0.9375rem] text-black leading-[1.75] dark:text-dark-text">
        <span>Next in this series:</span>{' '}
        <Link
          className="font-medium text-link dark:text-dark-link"
          href={`/blog/${nextPost.slug}`}
          showIcon="never"
        >
          {nextPost.title}
        </Link>{' '}
        {nextPost.summary ? `— ${nextPost.summary}` : null}
      </p>
    </aside>
  )
}

export default SeriesNavigation
