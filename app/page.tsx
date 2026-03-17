import Intro from 'components/home/intro'
import OpenSourceProjects from 'components/home/open-source-projects'
import RecentPosts from 'components/home/recent-posts'
import { getBlogPosts } from 'lib/blog'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anmol Mahatpurkar - Staff Frontend Engineer - @anmdotdev',
  description:
    'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript. Currently at Airbase (Paylocity).',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Anmol Mahatpurkar - Staff Frontend Engineer - @anmdotdev',
    description:
      'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript.',
    url: 'https://anm.dev',
  },
}

const homePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://anm.dev/#webpage',
  name: 'Anmol Mahatpurkar - Staff Frontend Engineer',
  description:
    'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript. Currently at Airbase (Paylocity).',
  url: 'https://anm.dev',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://anm.dev/#website',
  },
  about: {
    '@type': 'Person',
    '@id': 'https://anm.dev/#person',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://anm.dev',
      },
    ],
  },
}

const HomePage = () => {
  const recentPosts = getBlogPosts().slice(0, 3)

  return (
    <>
      <Intro />
      <OpenSourceProjects />
      <RecentPosts posts={recentPosts} />
      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
        type="application/ld+json"
      />
    </>
  )
}

export default HomePage
