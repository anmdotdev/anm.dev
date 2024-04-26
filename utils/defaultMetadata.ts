import { Metadata } from 'next'

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://anm.dev'),
  title: 'Anmol Mahatpurkar - A Frontend Engineer from India 🇮🇳 - @anmdotdev',
  description:
    'I often publish Blogs and Open Source work related to JavaScript, React, and the Modern Web. Say hi 👋 at hey@anm.dev. Follow this space and become a part of my developer journey.',
  authors: [{ name: 'Anmol Mahatpurkar', url: 'https://anm.dev' }],
  creator: 'Anmol Mahatpurkar',
  publisher: 'Anmol Mahatpurkar',
  manifest: 'https://anm.dev/manifest.json',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/logos/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/logos/safari-pinned-tab.svg',
        color: '#222222',
      },
    ],
  },
  openGraph: {
    url: 'https://anm.dev',
    title: 'Anmol Mahatpurkar - A Frontend Engineer from India 🇮🇳 - @anmdotdev',
    description:
      'I often publish Blogs and Open Source work related to JavaScript, React, and the Modern Web. Say hi 👋 at hey@anm.dev. Follow this space and become a part of my developer journey.',
    images: [{ url: 'https://avatars.githubusercontent.com/u/36692003?v=4' }],
  },
  applicationName: 'anmdotdev',
  twitter: {
    title: 'Anmol Mahatpurkar - @anmdotdev',
    description: 'A Frontend Engineer from India 🇮🇳 ',
    site: '@anmdotdev',
    card: 'summary_large_image',
    creator: '@anmdotdev',
    images: [{ url: 'https://avatars.githubusercontent.com/u/36692003?v=4' }],
  },
}

export default defaultMetadata
