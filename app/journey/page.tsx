import Timeline from 'components/journey/timeline'
import type { Metadata } from 'next'

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
  },
}

const JourneyPage = () => <Timeline />

export default JourneyPage
