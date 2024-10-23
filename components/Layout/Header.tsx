import Link from 'common/Link'
import Tooltip from 'common/Tooltip'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', text: 'Open Source' },
  { link: '/blogs', text: 'Blogs', wip: true },
  { link: '/journey', text: 'Journey', wip: true },
]

const Header = () => (
  <header className="w-full mx-auto max-w-lg py-5 flex justify-between items-center sm:px-6">
    <Link href="/" className="text-lg text-black font-semibold">
      {siteName}
    </Link>
    <nav className="space-x-4 flex items-center">
      {navLinks.map(({ link, text, wip }) =>
        wip ? (
          <Tooltip key={link} content="Work in Progress">
            <span className="text-black cursor-pointer hover:underline">{text}</span>
          </Tooltip>
        ) : (
          <Link key={link} href={link} className="text-black hover:underline" showIcon="never">
            {text}
          </Link>
        ),
      )}
    </nav>
  </header>
)

export default Header
