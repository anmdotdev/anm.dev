import { ReactNode } from 'react'

import Chips from 'common/Chips'
import GithubStarCount from 'common/GithubStarCount'

import { classnames } from 'utils/helpers'
import Image from 'next/image'

import { css } from '@pigment-css/react'

interface IOpenSourceProjectProps {
  image: string
  name: string
  description: string
  tags: { label: ReactNode; color?: string }[]
  className?: string
  githubOrgName?: string
  githubRepoName?: string
}

const OpenSourceProject = ({
  image,
  name,
  description,
  tags,
  className,
  githubOrgName,
  githubRepoName,
}: IOpenSourceProjectProps) => (
  <div
    className={classnames(
      css(({ theme }) => ({
        width: '100%',
        display: 'flex',
        gap: 20,

        '@media (max-width: 768px)': {
          flexDirection: 'column',
          alignItems: 'center',

          paddingLeft: 24,
          paddingRight: 24,

          textAlign: 'center',
        },
      })),
      className,
    )}
  >
    <div className={css(({ theme }) => ({ flex: 1 }))}>
      <Image src={image} alt={name} width={400} height={250} priority />
    </div>
    <div
      className={css(({ theme }) => ({
        flex: 1,
        paddingTop: 16,
        paddingBottom: 16,
      }))}
    >
      <h3
        className={css(({ theme }) => ({
          fontSize: 18,
          lineHeight: 1.1,
          fontWeight: 600,
          marginBottom: 12,
        }))}
      >
        {name}
      </h3>
      <p
        className={css(({ theme }) => ({
          color: theme.colors.black,
          fontSize: 14,
          lineHeight: 1.5,
          marginBottom: 16,
        }))}
      >
        {description}
      </p>
      <Chips
        className={css(({ theme }) => ({
          fontSize: 18,
          lineHeight: 1.1,
          marginBottom: 16,
        }))}
        chips={tags}
      />
      {githubOrgName && githubRepoName && (
        <div
          className={css(({ theme }) => ({
            marginTop: 8,
          }))}
        >
          <GithubStarCount orgName={githubOrgName} repoName={githubRepoName} />
        </div>
      )}
    </div>
  </div>
)

export default OpenSourceProject
