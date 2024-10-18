import React from 'react'

import { Metadata } from 'next'

import Layout from 'components/Layout/Layout'

import defaultMetadata from 'utils/defaultMetadata'

import 'tippy.js/dist/tippy.css'
import './globals.css'

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
})

export const metadata: Metadata = defaultMetadata

interface IRootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html lang="en" className={raleway.className}>
    <body>
      <Layout>{children}</Layout>
    </body>
  </html>
)

export default RootLayout
