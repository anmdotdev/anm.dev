import Link from 'components/ui/link'
import Image from 'next/image'
import emailIcon from 'public/icons/email.svg'
import githubIcon from 'public/icons/github.svg'
import linkedinIcon from 'public/icons/linkedin.svg'
import resumeIcon from 'public/icons/resume.svg'
import twitterIcon from 'public/icons/twitter.svg'

const links = [
  {
    icon: githubIcon,
    link: 'https://github.com/anmdotdev',
    text: 'See my work on Github',
  },
  {
    icon: twitterIcon,
    link: 'https://twitter.com/anmdotdev',
    text: 'Follow me on Twitter',
  },
  {
    icon: linkedinIcon,
    link: 'https://linkedin.com/in/anmolmahatpurkar',
    text: 'View Linkedin Profile',
  },
  {
    icon: resumeIcon,
    link: '/resume-anmol-mahatpurkar.pdf',
    text: 'See my Resume',
  },
  {
    icon: emailIcon,
    link: 'mailto:hey@anm.dev',
    text: 'Email at hey@anm.dev',
  },
]

const Footer = () => (
  <footer className="absolute bottom-0 w-full border-gray-lighter border-t bg-white max-md:text-center">
    <div className="mx-auto flex max-w-lg space-x-6 py-8 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-6 max-sm:px-6">
      <div className="flex-1">
        <h2 className="mb-4 font-semibold text-lg">About</h2>
        <p>
          {`Welcome to my personal website! I'm Anmol Mahatpurkar, a Staff Frontend Engineer from India 🇮🇳 and I love JavaScript and React.`}
        </p>
      </div>
      <div className="flex-1">
        <h2 className="mb-4 font-semibold text-lg">Social</h2>
        {links.map(({ icon, link, text }) => (
          <Link className="mb-1 space-x-3 text-black" external href={link} key={link}>
            <Image alt="" className="w-4 text-black" height={16} src={icon} width={16} />
            <span>{text}</span>
          </Link>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
