import React from 'react'

import { Metadata } from 'next'

import Layout from 'components/Layout/Layout'

import defaultMetadata from 'utils/defaultMetadata'

import 'tailwindcss/tailwind.css'
import 'tippy.js/dist/tippy.css'

import { Raleway } from 'next/font/google'

import '@pigment-css/react/styles.css'

declare global {
  interface Window {
    firebase: any
  }
}

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
  <html lang="en" className={`${raleway.variable}`}>
    <body>
      <Layout>{children}</Layout>
    </body>
  </html>
)

export default RootLayout
