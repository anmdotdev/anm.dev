import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'

import './globals.css'

import Shell from 'components/layout/shell'

import defaultMetadata from 'lib/default-metadata'

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

export const metadata: Metadata = defaultMetadata

interface IRootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html className={`${raleway.variable}`} lang="en">
    <body>
      <Shell>{children}</Shell>
    </body>
  </html>
)

export default RootLayout
