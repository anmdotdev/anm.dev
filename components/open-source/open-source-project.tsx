import Chips from 'components/ui/chips'
import GithubStarCount from 'components/ui/github-star-count'
import Link from 'components/ui/link'
import { classnames } from 'lib/helpers'
import type { IOpenSourceProject } from 'lib/projects'
import Image from 'next/image'
import globeIcon from 'public/icons/globe.svg'
import { Suspense } from 'react'

const OpenSourceProject = ({
  className,
  image,
  name,
  description,
  tags,
  githubOrgName,
  githubRepoName,
  demoUrl,
  headingLevel = 'h3',
  cardClickable = false,
  showDemoButton = false,
  priority = false,
}: IOpenSourceProject & {
  cardClickable?: boolean
  className?: string
  headingLevel?: 'h2' | 'h3'
  priority?: boolean
  showDemoButton?: boolean
}) => {
  const HeadingTag = headingLevel
  const githubUrl = `https://github.com/${githubOrgName}/${githubRepoName}`
  const cardLinkUrl = demoUrl || githubUrl
  const cardLinkLabel = demoUrl ? `Open ${name} demo` : `Open ${name} on GitHub`

  return (
    <article
      className={classnames(
        'group relative w-full rounded-lg transition-colors',
        cardClickable ? 'hover:bg-gray-lightest/60 dark:hover:bg-dark-surface' : '',
        className,
      )}
    >
      {cardClickable ? (
        <Link
          analyticsProperties={{
            click_area: cardClickable ? 'open_source_card' : 'open_source_link',
            destination_path: cardLinkUrl,
            is_demo_link: Boolean(demoUrl),
            link_category: 'open_source_project',
            project_name: name,
            repo_name: githubRepoName,
            source_page: 'open_source',
          }}
          aria-label={cardLinkLabel}
          className="absolute inset-0 z-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 dark:focus-visible:outline-dark-text"
          external
          href={cardLinkUrl}
          showIcon="never"
        >
          <span className="sr-only">{cardLinkLabel}</span>
        </Link>
      ) : null}

      <div
        className={classnames(
          'flex w-full space-x-5 max-md:flex-col max-md:items-center max-md:space-x-0 max-md:space-y-5 max-md:px-6 max-md:text-center',
          cardClickable ? 'pointer-events-none relative z-10' : '',
        )}
      >
        <div className="flex-1">
          <Image
            alt={name}
            height={250}
            priority={priority}
            sizes="(max-width: 768px) calc(100vw - 3rem), 352px"
            src={image}
            width={400}
          />
        </div>
        <div className="flex-1 py-4">
          <HeadingTag className="mb-3 font-semibold text-lg dark:text-dark-text">{name}</HeadingTag>
          <p className="mb-4 text-gray-dark text-sm dark:text-dark-text-secondary">{description}</p>
          <Chips chips={tags} className="mb-4 text-sm" />
          <div className="pointer-events-auto relative z-20 mt-2 flex flex-wrap gap-3 max-md:justify-center">
            {showDemoButton && demoUrl ? (
              <Link
                analyticsProperties={{
                  click_area: 'open_source_demo_button',
                  destination_path: demoUrl,
                  is_demo_link: true,
                  link_category: 'open_source_project',
                  project_name: name,
                  repo_name: githubRepoName,
                  source_page: 'open_source',
                }}
                className="rounded-xs border border-gray-lighter bg-gray-lightest px-3 py-1 text-xs dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary"
                external
                href={demoUrl}
                showIcon="never"
              >
                <Image alt="" className="mr-2 dark:invert" height={14} src={globeIcon} width={14} />
                See Demo
              </Link>
            ) : null}
            <Suspense fallback={null}>
              <GithubStarCount githubOrgName={githubOrgName} githubRepoName={githubRepoName} />
            </Suspense>
          </div>
        </div>
      </div>
    </article>
  )
}

export default OpenSourceProject
