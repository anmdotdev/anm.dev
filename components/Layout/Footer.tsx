import React from 'react'

import Link from 'common/Link'

import IconGithub from 'common/Icons/IconGithub'
import IconTwitter from 'common/Icons/IconTwitter'
import IconLinkedIn from 'common/Icons/IconLinkedIn'
import IconResume from 'common/Icons/IconResume'
import IconEmail from 'common/Icons/IconEmail'

const links = [
  {
    icon: IconGithub,
    link: 'https://github.com/anmdotdev',
    text: 'See my work on Github',
  },
  {
    icon: IconTwitter,
    link: 'https://twitter.com/anmdotdev',
    text: 'Follow me on Twitter',
  },
  {
    icon: IconLinkedIn,
    link: 'https://linkedin.com/in/anmolmahatpurkar',
    text: 'View Linkedin Profile',
  },
  {
    icon: IconResume,
    link: '/resume-anmol-mahatpurkar.pdf',
    text: 'Download my Resume',
    download: 'Resume - Anmol Mahatpurkar',
  },
  {
    icon: IconEmail,
    link: 'mailto:hey@anm.dev',
    text: 'Email at hey@anm.dev',
  },
]

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-lighter absolute bottom-0 md:text-center">
      <div className="max-w-lg mx-auto flex py-8 space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 sm:px-6">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <p>
            Welcome to my personal website! I'm Anmol Mahatpurkar, a Frontend Engineer from India 🇮🇳
            and I love JavaScript and React.
          </p>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Social</h2>
          {links.map(({ icon: Icon, link, text, download }) => (
            <div>
              <Link
                key={link}
                href={link}
                className="space-x-3 mb-1 text-gray-dark"
                external
                download={download}
              >
                <Icon className="text-black w-4" />
                <span>{text}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
