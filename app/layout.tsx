import { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import { StagewiseToolbar } from '@stagewise/toolbar-next'

import 'tailwindcss/tailwind.css'

import Layout from 'components/Layout/Layout'

import defaultMetadata from 'utils/defaultMetadata'

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

export const metadata: Metadata = defaultMetadata

interface IRootLayoutProps {
  children: React.ReactNode
}

const stagewiseConfig = {
  plugins: []
}

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html lang="en" className={`${raleway.variable}`}>
    <body>
      <Layout>{children}</Layout>
      {process.env.NODE_ENV === 'development' && (
        <StagewiseToolbar config={stagewiseConfig} />
      )}
    </body>
  </html>
)

export default RootLayout
