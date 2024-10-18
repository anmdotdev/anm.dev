import React from 'react'

import Link from 'common/Link'

import { css } from '@pigment-css/react'

const Intro = () => (
  <section
    className={css(({ theme }) => ({
      width: '100%',
      maxWidth: 512,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: 40,
      paddingBottom: 32,

      '@media (max-width: 540px)': {
        paddingLeft: 24,
        paddingRight: 24,
      },
    }))}
  >
    <h1
      className={css(({ theme }) => ({
        textAlign: 'center',
        fontWeight: 700,
        fontSize: 36,
        lineHeight: 1.1,
        marginBottom: 32,
      }))}
    >
      Hey, I'm Anmol 👋
    </h1>
    <p
      className={css(({ theme }) => ({
        marginBottom: 24,
      }))}
    >
      I am a Frontend Engineer from India, and I love JavaScript and React. I currently work as a{' '}
      <strong
        className={css(({ theme }) => ({
          fontWeight: 500,
          paddingBottom: 24,
        }))}
      >
        Staff Software Engineer
      </strong>{' '}
      at{' '}
      <Link
        href="https://airbase.com"
        className={css(({ theme }) => ({
          color: theme.colors.link,
          fontWeight: 600,
        }))}
        external
        showIcon="never"
      >
        Airbase Inc.
      </Link>
      , recently acquired by{' '}
      <Link
        href="https://www.paylocity.com/resources/resource-library/press-release/paylocity-announces-completion-of-acquisition-of-airbase-inc/"
        className={css(({ theme }) => ({
          color: theme.colors.link,
          fontWeight: 600,
        }))}
        external
        showIcon="never"
      >
        Paylocity
      </Link>
      , and have a total of{' '}
      <strong className={css(({ theme }) => ({ fontWeight: 500 }))}>
        about 10 years of experience
      </strong>{' '}
      as an engineer.
    </p>
    <p className={css(({ theme }) => ({ marginBottom: 24 }))}>
      Over the span of 10 years, I have worked with a{' '}
      <strong className={css(({ theme }) => ({ fontWeight: 500 }))}>
        range of Frontend initiatives
      </strong>
      , including multiple{' '}
      <strong className={css(({ theme }) => ({ fontWeight: 500 }))}>
        Design Systems, Web & Mobile Apps, & mentored
      </strong>{' '}
      multiple teams on building{' '}
      <strong className={css(({ theme }) => ({ fontWeight: 500 }))}>
        frontend across multiple different product areas.
      </strong>
    </p>
    <p>
      When I am not working, you would find me playing Age of Empires 2 on my PC. I also like to
      play chess, and think about the mysteries of the human mind, sometimes.
    </p>
  </section>
)

export default Intro
