import Link from 'components/ui/link'
import Image from 'next/image'
import emailIcon from 'public/icons/email.svg'
import githubIcon from 'public/icons/github.svg'
import linkedinIcon from 'public/icons/linkedin.svg'
import resumeIcon from 'public/icons/resume.svg'
import xIcon from 'public/icons/x.svg'

const links = [
  {
    icon: githubIcon,
    link: 'https://github.com/anmdotdev',
    text: 'Github',
  },
  {
    icon: xIcon,
    link: 'https://x.com/anmdotdev',
    text: 'X (Twitter)',
  },
  {
    icon: linkedinIcon,
    link: 'https://linkedin.com/in/anmolmahatpurkar',
    text: 'LinkedIn',
  },
  {
    icon: resumeIcon,
    link: '/resume-anmol-mahatpurkar.pdf',
    text: 'Resume',
  },
  {
    icon: emailIcon,
    link: 'mailto:hey@anm.dev',
    text: 'hey@anm.dev',
  },
  {
    icon: emailIcon,
    link: '/blog#newsletter',
    text: 'Blog Newsletter',
  },
]

const MAX_LINKS_PER_ROW = 2
const socialLinkRows = links.reduce<(typeof links)[]>((rows, link, index) => {
  const rowIndex = Math.floor(index / MAX_LINKS_PER_ROW)

  if (!rows[rowIndex]) {
    rows[rowIndex] = []
  }

  rows[rowIndex].push(link)
  return rows
}, [])

const Footer = () => (
  <footer className="w-full border-gray-lighter border-t bg-white max-md:text-center dark:border-dark-border dark:bg-dark-surface">
    <div className="mx-auto flex max-w-3xl space-x-8 pt-12 pb-16 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-6 max-sm:px-6 md:px-6">
      <div className="flex-1">
        <h2 className="mb-4 font-semibold text-lg dark:text-dark-text">About</h2>
        <p className="text-gray-dark text-sm dark:text-dark-text-secondary">
          {`Welcome to my personal website! I'm Anmol Mahatpurkar, a staff software engineer from India 🇮🇳 currently building AI products at a stealth startup, and I love JavaScript and React.`}
        </p>
      </div>
      <div className="flex-1">
        <h2 className="mb-4 font-semibold text-lg dark:text-dark-text">Social</h2>
        <nav aria-label="Social links">
          <div className="space-y-2">
            {socialLinkRows.map((row) => (
              <ul
                className="flex flex-wrap gap-x-4 gap-y-2 p-0 max-md:justify-center"
                key={row.map(({ link }) => link).join('|')}
              >
                {row.map(({ icon, link, text }) => (
                  <li key={link}>
                    <Link
                      className="whitespace-nowrap text-gray-dark text-sm dark:text-dark-text-secondary"
                      external={link.startsWith('http') || link.startsWith('mailto:')}
                      href={link}
                      showIcon="never"
                    >
                      <Image
                        alt=""
                        className="mr-2.5 inline-block w-4 text-black dark:invert"
                        height={16}
                        src={icon}
                        width={16}
                      />
                      <span>{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>
      </div>
    </div>
  </footer>
)

export default Footer
