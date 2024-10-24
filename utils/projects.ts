import { StaticImageData } from 'next/image'

import cogoToastImage from 'public/images/cogo-toast.png'
import aashayDedhiaImage from 'public/images/aashay-dedhia.png'
import anmdotdevImage from 'public/images/anmdotdev.png'
import gridsAndTablesImage from 'public/images/grids-and-tables.png'

export interface IOpenSourceProject {
  image: StaticImageData

  name: string
  description: string
  tags: { label: string; color: string }[]

  githubOrgName: string
  githubRepoName: string
  githubStars?: number
}

export const OPEN_SOURCE_PROJECTS: IOpenSourceProject[] = [
  {
    image: cogoToastImage,
    name: 'CogoToast',
    description: 'A Beautiful, Zero Configuration, Plug and Play Toast Notifications Library',
    tags: [
      { label: 'NPM Library', color: 'gray' },
      { label: 'React', color: 'gray' },
      { label: 'TypeScript', color: 'gray' },
      { label: 'Rollup', color: 'gray' },
    ],
    githubOrgName: 'Cogoport',
    githubRepoName: 'cogo-toast',
  },
  {
    image: aashayDedhiaImage,
    name: 'Aashay Dedhia - Portfolio Website for a Designer Friend',
    description: 'A portfolio website developed in partnership with a UX UI designer friend.',
    tags: [
      { label: 'React', color: 'gray' },
      { label: 'TypeScript', color: 'gray' },
      { label: 'Next.js', color: 'gray' },
      { label: 'TailwindCSS', color: 'gray' },
    ],
    githubOrgName: 'aashaydedhia01',
    githubRepoName: 'aashaydedhia',
  },
  {
    image: anmdotdevImage,
    name: 'anmdotdev - This Website',
    description:
      'My dev website. Feel free to use it as a template for your dev site. Would love credits on your site, if you do 😃',
    tags: [
      { label: 'React', color: 'gray' },
      { label: 'TypeScript', color: 'gray' },
      { label: 'Next.js', color: 'gray' },
      { label: 'TailwindCSS', color: 'gray' },
    ],
    githubOrgName: 'anmdotdev',
    githubRepoName: 'anmdotdev',
  },
  {
    image: gridsAndTablesImage,
    name: 'Grids and Tables',
    description:
      'A Sample React app built using TypeScript, Next.js, Redux, that fetches and display data with SSR.',
    tags: [
      { label: 'React', color: 'gray' },
      { label: 'TypeScript', color: 'gray' },
      { label: 'Next.js', color: 'gray' },
      { label: 'Redux', color: 'gray' },
    ],
    githubOrgName: 'anmdotdev',
    githubRepoName: 'grids-and-tables',
  },
]

interface IGithubStarsParams {
  githubOrgName: string
  githubRepoName: string
}

export async function getGithubStars({ githubOrgName, githubRepoName }: IGithubStarsParams) {
  const res = await fetch(`https://api.github.com/repos/${githubOrgName}/${githubRepoName}`, {
    cache: 'force-cache',
  })
  const { stargazers_count } = await res.json()
  return stargazers_count
}
