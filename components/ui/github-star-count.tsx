import Link from 'components/ui/link'
import { getGithubStars } from 'lib/projects'
import Image from 'next/image'
import githubIcon from 'public/icons/github.svg'

const GithubStarCount = async ({ githubOrgName, githubRepoName }) => {
  const githubStars = await getGithubStars({ githubOrgName, githubRepoName })

  return (
    <Link
      className="rounded-xs border border-gray-lighter bg-white text-xs dark:border-dark-border dark:bg-dark-surface"
      external
      href={`https://github.com/${githubOrgName}/${githubRepoName}`}
      showIcon="never"
    >
      <span className="flex items-center space-x-2 bg-gray-lightest p-1 px-2 group-hover:bg-white dark:bg-dark-surface dark:group-hover:bg-dark-surface-hover">
        <Image alt="" className="dark:invert" height={18} src={githubIcon} width={18} />
        <span className="dark:text-dark-text-secondary">Star on Github</span>
      </span>
      {githubStars > 0 && (
        <span className="flex items-center border-gray-lighter border-l bg-white p-1 px-2 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary">
          {githubStars}
        </span>
      )}
    </Link>
  )
}

export default GithubStarCount
