import React from 'react'

import { Metadata } from 'next'

import Layout from 'components/Layout/Layout'

import defaultMetadata from 'utils/defaultMetadata'

import 'tailwindcss/tailwind.css'
import 'tippy.js/dist/tippy.css'

import { Raleway } from 'next/font/google'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
