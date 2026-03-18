import Intro from 'components/home/intro'
import OpenSourceProjects from 'components/home/open-source-projects'
import RecentPosts from 'components/home/recent-posts'
import { getBlogPosts } from 'lib/blog'
import { EXPERIENCE_YEARS_LABEL } from 'lib/profile'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Anmol Mahatpurkar - Staff Software Engineer - @anmdotdev',
  description: `Staff Software Engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript. Currently building AI products at a stealth startup.`,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Anmol Mahatpurkar - Staff Software Engineer - @anmdotdev',
    description: `Staff Software Engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript.`,
    url: 'https://anm.dev',
    type: 'website',
    siteName: 'anmdotdev',
    locale: 'en_US',
    images: [
      {
        url: 'https://anm.dev/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Anmol Mahatpurkar - Staff Software Engineer',
        type: 'image/png',
      },
    ],
  },
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
        alt: 'Anmol Mahatpurkar - Staff Software Engineer',
        type: 'image/png',
      },
    ],
  },
}

const homePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://anm.dev/#webpage',
  name: 'Anmol Mahatpurkar - Staff Software Engineer',
  description: `Staff Software Engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript. Currently building AI products at a stealth startup.`,
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
  const hasRecentPosts = recentPosts.length > 0

  return (
    <>
      <Intro />
      <OpenSourceProjects compactBottomSpacing={hasRecentPosts} />
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
