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
]

const Footer = () => (
  <footer className="absolute bottom-0 w-full border-gray-lighter border-t bg-white max-md:text-center dark:border-dark-border dark:bg-dark-surface">
    <div className="mx-auto flex max-w-3xl space-x-8 pt-8 pb-12 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-6 max-sm:px-6 md:px-6">
      <div className="flex-1">
        <h2 className="mb-4 font-semibold text-lg dark:text-dark-text">About</h2>
        <p className="text-sm dark:text-dark-text-secondary">
          {`Welcome to my personal website! I'm Anmol Mahatpurkar, a Staff Frontend Engineer from India 🇮🇳 and I love JavaScript and React.`}
        </p>
      </div>
      <div className="flex-1">
        <h2 className="mb-4 font-semibold text-lg dark:text-dark-text">Social</h2>
        {links.map(({ icon, link, text }) => (
          <Link
            className="mb-1.5 whitespace-nowrap text-black text-sm dark:text-dark-text-secondary"
            external
            href={link}
            key={link}
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
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
