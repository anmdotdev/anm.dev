import Timeline from 'components/journey/timeline'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Journey',
  description:
    'My professional journey — 10+ years of frontend engineering, from game development to staff engineer at Airbase (Paylocity).',
  alternates: { canonical: '/journey' },
  openGraph: {
    title: 'Journey - Anmol Mahatpurkar',
    description:
      'My professional journey — 10+ years of frontend engineering, from game development to staff engineer at Airbase (Paylocity).',
    url: 'https://anm.dev/journey',
    type: 'website',
    siteName: 'anmdotdev',
    locale: 'en_US',
    images: [
      {
        url: 'https://anm.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Professional journey of Anmol Mahatpurkar',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Journey - Anmol Mahatpurkar',
    description:
      'My professional journey — 10+ years of frontend engineering, from game development to staff engineer at Airbase (Paylocity).',
    creator: '@anmdotdev',
    site: '@anmdotdev',
    images: ['https://anm.dev/opengraph-image'],
  },
}

const journeyJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': 'https://anm.dev/journey#profile',
  name: 'Professional Journey - Anmol Mahatpurkar',
  description:
    'My professional journey — 10+ years of frontend engineering, from game development to staff engineer at Airbase (Paylocity).',
  url: 'https://anm.dev/journey',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://anm.dev/#website',
  },
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://anm.dev/#person',
    name: 'Anmol Mahatpurkar',
    jobTitle: 'Staff Frontend Engineer',
    url: 'https://anm.dev',
    worksFor: {
      '@type': 'Organization',
      name: 'Airbase (Paylocity)',
    },
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://anm.dev',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Journey',
      item: 'https://anm.dev/journey',
    },
  ],
}

const JourneyPage = () => (
  <>
    <Timeline />
    <script
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(journeyJsonLd) }}
      type="application/ld+json"
    />
    <script
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      type="application/ld+json"
    />
  </>
)

export default JourneyPage
