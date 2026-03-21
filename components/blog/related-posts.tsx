import Link from 'components/ui/link'
import type { BlogPost } from 'lib/blog'
import { formatDate } from 'lib/blog'

interface RelatedPostsProps {
  posts: BlogPost[]
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => (
  <aside
    aria-label="Related posts"
    className="mt-12 border-gray-lighter border-t pt-8 text-left dark:border-dark-border"
  >
    <h2 className="mb-4 font-semibold text-black text-sm dark:text-dark-text">Related Posts</h2>
    <ul className="space-y-3 text-left">
      {posts.map((post) => (
        <li className="text-left" key={post.slug}>
          <Link
            analyticsProperties={{
              destination_path: `/blog/${post.slug}`,
              link_location: 'blog_post',
              link_section: 'related_posts',
              link_type: 'blog_post',
              post_slug: post.slug,
              post_tags: post.tags.join(','),
            }}
            className="!flex !w-full flex-col items-start gap-0.5 text-left text-sm no-underline hover:no-underline"
            href={`/blog/${post.slug}`}
            showIcon="never"
            style={{ alignItems: 'flex-start', textAlign: 'left', width: '100%' }}
          >
            <span className="block w-full font-medium text-black dark:text-dark-text">
              {post.title}
            </span>
            <span className="block w-full text-gray text-xs dark:text-dark-text-muted">
              {formatDate(post.date)} · {post.readingTime}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </aside>
)

export default RelatedPosts
