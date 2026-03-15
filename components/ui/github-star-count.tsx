import Link from 'components/ui/link'
import { getGithubStars } from 'lib/projects'
import Image from 'next/image'
import githubIcon from 'public/icons/github.svg'

const GithubStarCount = async ({ githubOrgName, githubRepoName }) => {
  const githubStars = await getGithubStars({ githubOrgName, githubRepoName })

  return (
    <Link
      href={`https://github.com/${githubOrgName}/${githubRepoName}`}
      external
      className="border border-gray-lighter text-xs rounded-xs bg-white"
      showIcon="never"
    >
      <span className="flex items-center p-1 px-2 space-x-2 bg-gray-lightest group-hover:bg-white">
        <Image src={githubIcon} width={18} height={18} alt="" />
        <span>Star on Github</span>
      </span>
      {githubStars > 0 && (
        <span className="border-l border-gray-lighter bg-white p-1 px-2 flex items-center">
          {githubStars}
        </span>
      )}
    </Link>
  )
}

export default GithubStarCount
