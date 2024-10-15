import Link from 'common/Link'
import Tippy from '@tippyjs/react'
import { css } from '@pigment-css/react'

const siteName = 'anmdotdev'

const navLinks = [
  { link: '/open-source', text: 'Open Source' },
  { link: '/blogs', text: 'Blogs', wip: true },
  { link: '/journey', text: 'Journey', wip: true },
]

const Header = () => (
  <header
    className={css({
      width: '100%',

      marginLeft: 'auto',
      marginRight: 'auto',

      maxWidth: 512,
      paddingTop: 20,
      paddingBottom: 20,

      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',

      '@media (max-width: 768px)': {
        paddingLeft: 24,
        paddingRight: 24,
      },
    })}
  >
    <Link
      href="/"
      className={css(({ theme }) => ({
        fontSize: 20,
        fontWeight: 600,
        color: theme.colors.black,
      }))}
    >
      {siteName}
    </Link>
    <nav
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      })}
    >
      {navLinks.map(({ link, text, wip }) =>
        wip ? (
          <Tippy key={link} content="Work in Progress">
            <span
              className={css(({ theme }) => ({
                color: theme.colors.black,
                cursor: 'pointer',

                '&:hover': {
                  textDecoration: 'underline',
                },
              }))}
            >
              {text}
            </span>
          </Tippy>
        ) : (
          <Link
            key={link}
            href={link}
            className={css(({ theme }) => ({
              color: theme.colors.black,

              '&:hover': {
                textDecoration: 'underline',
              },
            }))}
            showIcon="never"
          >
            {text}
          </Link>
        ),
      )}
    </nav>
  </header>
)

export default Header
