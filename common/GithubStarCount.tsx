'use client'

import { useEffect, useState } from 'react'
import IconGithub from './Icons/IconGithub'
import Link from './Link'

import { css } from '@pigment-css/react'

const githubUrl = 'https://github.com'
const githubApi = 'https://api.github.com/repos'

interface IGithubStarCountProps {
  orgName: string
  repoName: string
}

const GithubStarCount = ({ orgName, repoName }: IGithubStarCountProps) => {
  const [stars, setStars] = useState(0)

  useEffect(() => {
    fetch(`${githubApi}/${orgName}/${repoName}`)
      .then((response) => response.json())
      .then((data) => {
        setStars(data.stargazers_count)
      })
  }, [orgName, repoName])

  return (
    <Link
      href={`${githubUrl}/${orgName}/${repoName}`}
      external
      className={css(({ theme }) => ({
        border: `1px solid ${theme.colors.gray.lighter}`,
        background: theme.colors.white,
        fontSize: 12,
        lineHeight: 1.1,
        borderRadius: 4,
      }))}
      showIcon="never"
    >
      <span
        className={css(({ theme }) => ({
          display: 'flex',
          alignItems: 'center',
          padding: 4,
          paddingLeft: 8,
          paddingRight: 8,
          gap: 8,
          background: theme.colors.gray.lightest,

          '&:hover': {
            background: theme.colors.white,
          },
        }))}
      >
        <IconGithub width={18} />
        <span>Star on Github</span>
      </span>
      {stars > 0 && (
        <span
          className={css(({ theme }) => ({
            display: 'flex',
            alignItems: 'center',
            padding: 4,
            paddingLeft: 8,
            paddingRight: 8,
            border: `1px solid ${theme.colors.gray.lighter}`,
            background: theme.colors.white,
          }))}
        >
          {stars}
        </span>
      )}
    </Link>
  )
}

export default GithubStarCount
