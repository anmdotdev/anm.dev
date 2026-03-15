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
  name: 'Anmol Mahatpurkar',
  url: 'https://anm.dev',
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
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'anmdotdev',
  url: 'https://anm.dev',
  description:
    'Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript.',
  author: {
    '@type': 'Person',
    name: 'Anmol Mahatpurkar',
  },
}

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html className={jetbrainsMono.variable} lang="en" suppressHydrationWarning>
    <head>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static script to prevent theme flash */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <meta content="#6a35ff" name="theme-color" />
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
