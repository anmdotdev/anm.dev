import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'

import './globals.css'

import Shell from 'components/layout/shell'

import defaultMetadata from 'lib/default-metadata'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = defaultMetadata

interface IRootLayoutProps {
  children: React.ReactNode
}

// Inline script to prevent flash of wrong theme on page load
const themeScript = `
(function() {
  var theme = localStorage.getItem('theme');
  var isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) document.documentElement.classList.add('dark');
})();
`

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://anm.dev/#person',
  name: 'Anmol Mahatpurkar',
  url: 'https://anm.dev',
  image: 'https://anm.dev/images/profile.jpeg',
  jobTitle: 'Staff Frontend Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Airbase (Paylocity)',
  },
  sameAs: [
    'https://github.com/anmdotdev',
    'https://x.com/anmdotdev',
    'https://linkedin.com/in/anmolmahatpurkar',
  ],
  knowsAbout: [
    'React',
    'TypeScript',
    'JavaScript',
    'Design Systems',
    'Frontend Architecture',
    'Web Development',
    'AI-Assisted Development',
    'Prompt Engineering',
  ],
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://anm.dev/#website',
  name: 'anmdotdev',
  url: 'https://anm.dev',
  description:
    'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript.',
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    '@id': 'https://anm.dev/#person',
  },
  publisher: {
    '@type': 'Person',
    '@id': 'https://anm.dev/#person',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://anm.dev/api/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html className={jetbrainsMono.variable} lang="en" suppressHydrationWarning>
    <head>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static script to prevent theme flash */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <meta content="#6a35ff" name="theme-color" />
      <link href="https://api.github.com" rel="preconnect" />
      <link href="https://api.github.com" rel="dns-prefetch" />
      <link href="https://github.com" rel="dns-prefetch" />
      <link href="https://anm.dev" hrefLang="en" rel="alternate" />
      <link href="https://anm.dev" hrefLang="x-default" rel="alternate" />
      <link
        href="/feed.xml"
        rel="alternate"
        title="Anmol Mahatpurkar - Blog"
        type="application/rss+xml"
      />
      <link
        href="/feed.json"
        rel="alternate"
        title="Anmol Mahatpurkar - Blog"
        type="application/feed+json"
      />
      <link href="https://github.com/anmdotdev" rel="me" />
      <link href="https://x.com/anmdotdev" rel="me" />
      <link href="https://linkedin.com/in/anmolmahatpurkar" rel="me" />
      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        type="application/ld+json"
      />
      <script
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        type="application/ld+json"
      />
    </head>
    <body>
      <Shell>{children}</Shell>
    </body>
  </html>
)

export default RootLayout
