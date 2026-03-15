import Link from 'components/ui/link'
import ThemeToggle from 'components/ui/theme-toggle'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', shortText: 'OSS', text: 'Open Source' },
  { link: '/journey', text: 'Journey' },
  { link: '/blog', text: 'Blog' },
]

const Header = () => (
  <header className="mx-auto flex w-full max-w-lg items-center justify-between py-5 max-sm:px-4">
    <Link className="shrink-0 font-semibold text-black text-lg dark:text-dark-text" href="/">
      {siteName}
    </Link>
    <nav className="flex items-center space-x-2 sm:space-x-3">
      {navLinks.map(({ link, text, shortText }, index) => (
        <span className="flex items-center space-x-2 sm:space-x-3" key={link}>
          {index > 0 && (
            <span aria-hidden="true" className="text-gray-light dark:text-dark-text-muted">
              ·
            </span>
          )}
          <Link
            className="whitespace-nowrap text-black text-sm hover:underline dark:text-dark-text"
            href={link}
            showIcon="never"
          >
            {shortText ? (
              <>
                <span className="sm:hidden">{shortText}</span>
                <span className="hidden sm:inline">{text}</span>
              </>
            ) : (
              text
            )}
          </Link>
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
