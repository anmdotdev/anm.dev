import { Metadata } from 'next'

const defaultMetadata: Metadata = {
  metadataBase: new URL('https://anm.dev'),
  title: 'Anmol Mahatpurkar - A Frontend Engineer from India 🇮🇳 - @anmdotdev',
  description:
    'I am a remote Staff Frontend Engineer, and I love JavaScript and React. I currently work at at Airbase Inc., recently acquired by Paylocity, and have a total of about 10 years of experience as an engineer. Say hi 👋 at hey@anm.dev. ',
  authors: [{ name: 'Anmol Mahatpurkar', url: 'https://anm.dev' }],
  creator: 'Anmol Mahatpurkar',
  publisher: 'Anmol Mahatpurkar',
  alternates: { canonical: '/' },
  openGraph: {
    url: 'https://anm.dev',
    title: 'Anmol Mahatpurkar - A Frontend Engineer from India 🇮🇳 - @anmdotdev',
    description:
      'I am a remote Staff Frontend Engineer, and I love JavaScript and React. I currently work at at Airbase Inc., recently acquired by Paylocity, and have a total of about 10 years of experience as an engineer. Say hi 👋 at hey@anm.dev. ',
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
