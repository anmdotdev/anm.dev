import Link from 'components/ui/link'
import type { BlogPost } from 'lib/blog'
import { formatDate } from 'lib/blog'

interface RelatedPostsProps {
  posts: BlogPost[]
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => (
  <aside
    aria-label="Related posts"
    className="mt-12 border-gray-lighter border-t pt-8 dark:border-dark-border"
  >
    <h2 className="mb-4 font-semibold text-black text-sm dark:text-dark-text">Related Posts</h2>
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            className="!flex flex-col gap-0.5 text-sm no-underline hover:no-underline"
            href={`/blog/${post.slug}`}
            showIcon="never"
          >
            <span className="font-medium text-black dark:text-dark-text">{post.title}</span>
            <span className="text-gray text-xs dark:text-dark-text-muted">
              {formatDate(post.date)} · {post.readingTime}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </aside>
)

export default RelatedPosts
