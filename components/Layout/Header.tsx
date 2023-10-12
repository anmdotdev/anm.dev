'use client'

import React from 'react'

import Link from 'common/Link'
import Tippy from '@tippyjs/react'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', text: 'Open Source' },
  { link: '/blogs', text: 'Blogs', wip: true },
  { link: '/journey', text: 'Journey', wip: true },
]

const Header = () => {
  return (
    <header className="w-full mx-auto max-w-lg py-5 flex justify-between items-center sm:px-6">
      <Link href="/" className="text-lg text-black font-semibold">
        {siteName}
      </Link>
      <nav className="space-x-4 flex items-center">
        {navLinks.map(({ link, text, wip }) =>
          wip ? (
            <Tippy key={link} content="Work in Progress">
              <span className="text-gray-dark cursor-pointer hover:underline">{text}</span>
            </Tippy>
          ) : (
            <Link
              key={link}
              href={link}
              className="text-gray-dark hover:underline"
              showIcon="never"
            >
              {text}
            </Link>
          ),
        )}
      </nav>
    </header>
  )
}

export default Header
