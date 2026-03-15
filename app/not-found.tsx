import Link from 'components/ui/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

const NotFound = () => (
  <section className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
    <h1 className="mb-2 font-bold text-6xl text-black dark:text-dark-text">404</h1>
    <p className="mb-8 text-gray-dark dark:text-dark-text-secondary">
      This page could not be found.
    </p>
    <Link className="font-medium text-link text-sm dark:text-dark-link" href="/" showIcon="never">
      Go back home
    </Link>
  </section>
)

export default NotFound
