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

const RootLayout = ({ children }: IRootLayoutProps) => (
  <html className={jetbrainsMono.variable} lang="en" suppressHydrationWarning>
    <head>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static script to prevent theme flash */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </head>
    <body>
      <Shell>{children}</Shell>
    </body>
  </html>
)

export default RootLayout
