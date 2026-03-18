import type { StaticImageData } from 'next/image'
import aashayDedhiaImage from 'public/images/aashay-dedhia.png'
import anmdotdevImage from 'public/images/anmdotdev.png'
import cogoToastImage from 'public/images/cogo-toast.png'

export interface IOpenSourceProject {
  demoUrl?: string
  description: string

  githubOrgName: string
  githubRepoName: string
  githubStars?: number
  image: StaticImageData

  name: string
  tags: { label: string; color: string }[]
}

export const OPEN_SOURCE_LAST_UPDATED = '2026-03-18'

export const OPEN_SOURCE_PROJECTS: IOpenSourceProject[] = [
  {
    image: cogoToastImage,
    name: 'CogoToast',
    description: 'A Beautiful, Zero Configuration, Plug and Play Toast Notifications Library',
    demoUrl: 'https://successtar.github.io/cogo-toast/',
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
    demoUrl: 'https://aashaydedhia.vercel.app/',
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
    demoUrl: 'https://anm.dev',
    tags: [
      { label: 'React', color: 'gray' },
      { label: 'TypeScript', color: 'gray' },
      { label: 'Next.js', color: 'gray' },
      { label: 'TailwindCSS', color: 'gray' },
    ],
    githubOrgName: 'anmdotdev',
    githubRepoName: 'anmdotdev',
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
