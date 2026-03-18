import { EXPERIENCE_YEARS_LABEL } from 'lib/profile'
import type { Metadata } from 'next'

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://anm.dev'),
  title: {
    default: 'Anmol Mahatpurkar - Staff Software Engineer - @anmdotdev',
    template: '%s | anmdotdev',
  },
  description: `Staff Software Engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript. Currently building AI products at a stealth startup.`,
  authors: [{ name: 'Anmol Mahatpurkar', url: 'https://anm.dev' }],
  creator: 'Anmol Mahatpurkar',
  publisher: 'Anmol Mahatpurkar',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
      'application/feed+json': '/feed.json',
    },
  },
  openGraph: {
    url: 'https://anm.dev',
    title: 'Anmol Mahatpurkar - Staff Software Engineer - @anmdotdev',
    description: `Staff Software Engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript.`,
    siteName: 'anmdotdev',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://anm.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'anmdotdev - Anmol Mahatpurkar',
        type: 'image/png',
      },
    ],
  },
  applicationName: 'anmdotdev',
  twitter: {
    title: 'Anmol Mahatpurkar - @anmdotdev',
    description: 'Staff Software Engineer building AI products and modern web experiences.',
    site: '@anmdotdev',
    card: 'summary_large_image',
    creator: '@anmdotdev',
    images: [
      {
        url: 'https://anm.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'anmdotdev - Anmol Mahatpurkar',
        type: 'image/png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default defaultMetadata
