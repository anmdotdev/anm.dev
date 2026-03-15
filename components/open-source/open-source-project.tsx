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
      'w-full flex space-x-5 max-md:flex-col max-md:space-x-0 max-md:space-y-5 max-md:items-center max-md:px-6 max-md:text-center',
      className,
    )}
  >
    <div className="flex-1">
      <Image src={image} alt={name} width={400} height={250} priority />
    </div>
    <div className="flex-1 py-4">
      <h3 className="text-lg font-semibold mb-3">{name}</h3>
      <p className="text-black text-sm mb-4">{description}</p>
      <Chips className="text-sm mb-4" chips={tags} />
      <div className="mt-2">
        <Suspense fallback={null}>
          <GithubStarCount githubOrgName={githubOrgName} githubRepoName={githubRepoName} />
        </Suspense>
      </div>
    </div>
  </div>
)

export default OpenSourceProject
