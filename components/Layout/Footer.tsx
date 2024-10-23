import Link from 'common/Link'
import Image from 'next/image'

const links = [
  {
    icon: '/icons/github.svg',
    link: 'https://github.com/anmdotdev',
    text: 'See my work on Github',
  },
  {
    icon: '/icons/twitter.svg',
    link: 'https://twitter.com/anmdotdev',
    text: 'Follow me on Twitter',
  },
  {
    icon: '/icons/linkedin.svg',
    link: 'https://linkedin.com/in/anmolmahatpurkar',
    text: 'View Linkedin Profile',
  },
  {
    icon: '/icons/resume.svg',
    link: '/resume-anmol-mahatpurkar.pdf',
    text: 'Download my Resume',
    download: 'Resume - Anmol Mahatpurkar',
  },
  {
    icon: '/icons/email.svg',
    link: 'mailto:hey@anm.dev',
    text: 'Email at hey@anm.dev',
  },
]

const Footer = () => (
  <footer className="w-full bg-white border-t border-gray-lighter absolute bottom-0 md:text-center">
    <div className="max-w-lg mx-auto flex py-8 space-x-6 sm:flex-col sm:space-x-0 sm:space-y-6 sm:px-6">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">About</h2>
        <p>
          {`Welcome to my personal website! I'm Anmol Mahatpurkar, a Staff Frontend Engineer from India 🇮🇳 and I love JavaScript and React.`}
        </p>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-4">Social</h2>
        {links.map(({ icon, link, text, download }) => (
          <Link
            key={link}
            href={link}
            className="space-x-3 mb-1 text-black"
            external
            download={download}
          >
            <Image src={icon} alt="" width={16} height={16} className="text-black w-4" />
            <span>{text}</span>
          </Link>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
