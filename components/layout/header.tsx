import Link from 'components/ui/link'
import ThemeToggle from 'components/ui/theme-toggle'
import Tooltip from 'components/ui/tooltip'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', text: 'Open Source' },
  { link: '/journey', text: 'Journey' },
  { link: '/blogs', text: 'Blogs', wip: true },
]

const Header = () => (
  <header className="mx-auto flex w-full max-w-lg items-center justify-between py-5 max-sm:px-6">
    <Link className="font-semibold text-black text-lg dark:text-dark-text" href="/">
      {siteName}
    </Link>
    <nav className="flex items-center space-x-3">
      {navLinks.map(({ link, text, wip }, index) => (
        <span className="flex items-center space-x-3" key={link}>
          {index > 0 && (
            <span aria-hidden="true" className="text-gray-light dark:text-dark-text-muted">
              ·
            </span>
          )}
          {wip ? (
            <Tooltip content="Work in Progress">
              <span className="cursor-pointer text-black text-sm hover:underline dark:text-dark-text">
                {text}
              </span>
            </Tooltip>
          ) : (
            <Link
              className="text-black text-sm hover:underline dark:text-dark-text"
              href={link}
              showIcon="never"
            >
              {text}
            </Link>
          )}
        </span>
      ))}
      <span aria-hidden="true" className="text-gray-light dark:text-dark-text-muted">
        ·
      </span>
      <ThemeToggle />
    </nav>
  </header>
)

export default Header
