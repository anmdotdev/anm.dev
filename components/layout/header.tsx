import Link from 'components/ui/link'
import Tooltip from 'components/ui/tooltip'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', text: 'Open Source' },
  { link: '/blogs', text: 'Blogs', wip: true },
  { link: '/journey', text: 'Journey', wip: true },
]

const Header = () => (
  <header className="mx-auto flex w-full max-w-lg items-center justify-between py-5 max-sm:px-6">
    <Link className="font-semibold text-black text-lg" href="/">
      {siteName}
    </Link>
    <nav className="flex items-center space-x-4">
      {navLinks.map(({ link, text, wip }) =>
        wip ? (
          <Tooltip content="Work in Progress" key={link}>
            <span className="cursor-pointer text-black hover:underline">{text}</span>
          </Tooltip>
        ) : (
          <Link className="text-black hover:underline" href={link} key={link} showIcon="never">
            {text}
          </Link>
        ),
      )}
    </nav>
  </header>
)

export default Header
