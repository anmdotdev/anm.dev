import { Suspense } from 'react'

import Image from 'next/image'

import Chips from 'common/Chips'
import GithubStarCount from 'common/GithubStarCount'

import { classnames } from 'utils/helpers'
import { IOpenSourceProject } from 'utils/projects'

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
      'w-full flex space-x-5 md:flex-col md:space-x-0 md:space-y-5 md:items-center md:px-6 md:text-center',
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
        <Suspense fallback={<></>}>
          <GithubStarCount githubOrgName={githubOrgName} githubRepoName={githubRepoName} />
        </Suspense>
      </div>
    </div>
  </div>
)

export default OpenSourceProject
