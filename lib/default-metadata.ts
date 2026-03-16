import type { Metadata } from 'next'

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://anm.dev'),
  title: {
    default: 'Anmol Mahatpurkar - Staff Frontend Engineer - @anmdotdev',
    template: '%s | anmdotdev',
  },
  description:
    'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript. Currently at Airbase (Paylocity).',
  authors: [{ name: 'Anmol Mahatpurkar', url: 'https://anm.dev' }],
  creator: 'Anmol Mahatpurkar',
  publisher: 'Anmol Mahatpurkar',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
    types: {
      'application/rss+xml': '/feed.xml',
      'application/feed+json': '/feed.json',
    },
  },
  openGraph: {
    url: 'https://anm.dev',
    title: 'Anmol Mahatpurkar - Staff Frontend Engineer - @anmdotdev',
    description:
      'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript.',
    siteName: 'anmdotdev',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://anm.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'anmdotdev - Anmol Mahatpurkar',
      },
    ],
  },
  applicationName: 'anmdotdev',
  twitter: {
    title: 'Anmol Mahatpurkar - @anmdotdev',
    description: 'Staff Frontend Engineer building for the web with React & TypeScript.',
    site: '@anmdotdev',
    card: 'summary_large_image',
    creator: '@anmdotdev',
    images: [
      {
        url: 'https://anm.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'anmdotdev - Anmol Mahatpurkar',
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
  // Uncomment and add your verification codes after setting up Search Console / Bing Webmaster:
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
}

export default defaultMetadata
