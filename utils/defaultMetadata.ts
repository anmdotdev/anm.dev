import { Metadata } from 'next'

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://anm.dev'),
  title: 'Anmol Mahatpurkar - A Frontend Engineer from India 🇮🇳 - @anmdotdev',
  description:
    'I often publish Blogs and Open Source work related to JavaScript, React, and the Modern Web. Say hi 👋 at hey@anm.dev. Follow this space and become a part of my developer journey.',
  authors: [{ name: 'Anmol Mahatpurkar', url: 'https://anm.dev' }],
  creator: 'Anmol Mahatpurkar',
  publisher: 'Anmol Mahatpurkar',
  alternates: { canonical: '/' },
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
