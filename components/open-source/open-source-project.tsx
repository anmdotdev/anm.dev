import Chips from 'components/ui/chips'
import GithubStarCount from 'components/ui/github-star-count'
import { classnames } from 'lib/helpers'
import type { IOpenSourceProject } from 'lib/projects'
import Image from 'next/image'
import { Suspense } from 'react'

const OpenSourceProject = ({
  className,
  image,
  name,
  description,
  tags,
  githubOrgName,
  githubRepoName,
}: IOpenSourceProject & { className?: string }) => (
  <div
    className={classnames(
      'flex w-full space-x-5 max-md:flex-col max-md:items-center max-md:space-x-0 max-md:space-y-5 max-md:px-6 max-md:text-center',
      className,
    )}
  >
    <div className="flex-1">
      <Image alt={name} height={250} priority src={image} width={400} />
    </div>
    <div className="flex-1 py-4">
      <h3 className="mb-3 font-semibold text-lg dark:text-dark-text">{name}</h3>
      <p className="mb-4 text-black text-sm dark:text-dark-text-secondary">{description}</p>
      <Chips chips={tags} className="mb-4 text-sm" />
      <div className="mt-2">
        <Suspense fallback={null}>
          <GithubStarCount githubOrgName={githubOrgName} githubRepoName={githubRepoName} />
        </Suspense>
      </div>
    </div>
  </div>
)

export default OpenSourceProject
