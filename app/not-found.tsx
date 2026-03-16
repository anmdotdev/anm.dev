import Link from 'components/ui/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you are looking for does not exist. Browse the blog, open source projects, or professional journey instead.',
  robots: { index: false, follow: false },
}

const NotFound = () => (
  <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
    <h1 className="mb-2 font-bold text-6xl text-black dark:text-dark-text">404</h1>
    <p className="mb-6 text-gray-dark dark:text-dark-text-secondary">
      This page could not be found.
    </p>
    <nav aria-label="Helpful links" className="mb-8 flex flex-col gap-2">
      <Link
        className="font-medium text-link text-sm dark:text-dark-link"
        href="/blog"
        showIcon="never"
      >
        Read the blog
      </Link>
      <Link
        className="font-medium text-link text-sm dark:text-dark-link"
        href="/open-source"
        showIcon="never"
      >
        View open source projects
      </Link>
      <Link
        className="font-medium text-link text-sm dark:text-dark-link"
        href="/journey"
        showIcon="never"
      >
        See the professional journey
      </Link>
    </nav>
    <Link className="text-gray text-xs dark:text-dark-text-muted" href="/" showIcon="never">
      Go back home
    </Link>
  </section>
)

export default NotFound
