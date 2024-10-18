import { css } from '@pigment-css/react'

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

const Footer = () => (
  <footer
    className={css(({ theme }) => ({
      width: '100%',
      background: theme.colors.white,
      borderTop: `1px solid ${theme.colors.gray.lighter}`,
      position: 'absolute',
      bottom: 0,

      '@media (max-width: 768px)': {
        textAlign: 'center',
      },
    }))}
  >
    <div
      className={css({
        maxWidth: 512,
        marginLeft: 'auto',
        marginRight: 'auto',

        display: 'flex',
        gap: 24,

        paddingTop: 32,
        paddingBottom: 32,

        '@media (max-width: 540px)': {
          flexDirection: 'column',
          paddingLeft: 24,
          paddingRight: 24,
        },
      })}
    >
      <div
        className={css({
          flex: 1,
        })}
      >
        <h2
          className={css({
            fontSize: '18px',
            lineHeight: '28px',
            fontWeight: 600,
            marginBottom: 16,
          })}
        >
          About
        </h2>
        <p className={css({ lineHeight: 1.5 })}>
          {`Welcome to my personal website! I'm Anmol Mahatpurkar, a Staff Frontend Engineer from India 🇮🇳 and I love JavaScript and React.`}
        </p>
      </div>
      <div
        className={css({
          flex: 1,
        })}
      >
        <h2
          className={css({
            fontSize: '18px',
            lineHeight: '28px',
            fontWeight: 600,
            marginBottom: 16,
          })}
        >
          Social
        </h2>
        {links.map(({ icon: Icon, link, text, download }) => (
          <Link
            key={link}
            href={link}
            className={css(({ theme }) => ({
              gap: 12,
              color: theme.colors.black,
              marginBottom: 4,
              lineHeight: 1.5,
            }))}
            external
            download={download}
          >
            <Icon
              className={css(({ theme }) => ({
                color: theme.colors.black,
                width: 16,
              }))}
            />
            <span>{text}</span>
          </Link>
        ))}
      </div>
    </div>
  </footer>
)

export default Footer
