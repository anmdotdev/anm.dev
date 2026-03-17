import Link from 'components/ui/link'
import type { BlogPost } from 'lib/blog'
import { formatDate } from 'lib/blog'

interface RecentPostsProps {
  posts: BlogPost[]
}

const RecentPosts = ({ posts }: RecentPostsProps) => {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-lg pt-2 pb-16 max-sm:px-6">
      <h2 className="mb-6 font-semibold text-lg dark:text-dark-text">My Recent Blogs</h2>

      <div className="space-y-5">
        {posts.map((post) => (
          <article
            className="border-gray-lighter border-b pb-5 last:border-b-0 last:pb-0 dark:border-dark-border"
            key={post.slug}
          >
            <Link
              className="group !flex !items-start !no-underline hover:!no-underline flex-col gap-1"
              href={`/blog/${post.slug}`}
              showIcon="never"
            >
              <span className="font-semibold text-base text-black group-hover:underline dark:text-dark-text">
                {post.title}
              </span>
              {post.summary ? (
                <p className="text-gray-dark text-sm dark:text-dark-text-secondary">
                  {post.summary}
                </p>
              ) : null}
              <span className="text-gray text-xs dark:text-dark-text-muted">
                {formatDate(post.date)} · {post.readingTime}
              </span>
            </Link>
          </article>
        ))}
      </div>

      <Link
        className="mt-6 inline-block text-sm underline hover:text-black dark:text-dark-text-secondary dark:hover:text-dark-text"
        href="/blog"
      >
        Read more posts...
      </Link>
    </section>
  )
}

export default RecentPosts
