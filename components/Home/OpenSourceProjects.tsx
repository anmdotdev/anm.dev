import React from 'react'

import Link from 'common/Link'
import OpenSourceProject from 'components/OpenSourceProjects/OpenSourceProject'

import { OPEN_SOURCE_PROJECTS } from 'utils/projects'

import { css } from '@pigment-css/react'

const OpenSourceProjects = () => (
  <section
    className={css(({ theme }) => ({
      width: '100%',
      maxWidth: 768,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: 16,
      paddingBottom: 16,
    }))}
  >
    <h2
      className={css(({ theme }) => ({
        width: '100%',
        maxWidth: 512,

        marginLeft: 'auto',
        marginRight: 'auto',

        fontSize: 18,
        lineHeight: 1.1,
        fontWeight: 600,

        marginBottom: 32,

        paddingLeft: 24,
        paddingRight: 24,
      }))}
    >
      My Open Source Projects
    </h2>

    <OpenSourceProject {...OPEN_SOURCE_PROJECTS[0]} />

    <div
      className={css(({ theme }) => ({
        textAlign: 'center',
      }))}
    >
      <Link
        href="/open-source"
        className={css(({ theme }) => ({
          marginTop: 16,
          marginBottom: 16,

          fontSize: 14,
          lineHeight: 1.1,

          textDecoration: 'underline',

          '&:hover': {
            color: theme.colors.black,
          },
        }))}
      >
        See all my open source projects...
      </Link>
    </div>
  </section>
)

export default OpenSourceProjects
