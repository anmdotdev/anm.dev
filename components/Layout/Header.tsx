import React from 'react'

import Link from 'common/Link'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', text: 'OSS' },
  { link: 'https://twitter.com/anmdotdev', text: 'Follow me on Twitter', external: true },
]

const Header = () => {
  return (
    <header className="w-full mx-auto max-w-lg py-5 flex justify-between items-center sm:px-6">
      <Link href="/">
        <a className="text-lg text-black font-semibold">{siteName}</a>
      </Link>
      <nav className="space-x-4 flex items-center">
        {navLinks.map(({ link, text, external }) => (
          <Link
            key={link}
            href={link}
            external={external}
            className="text-gray-dark hover:underline"
            showIcon="never"
          >
            {text}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default Header
