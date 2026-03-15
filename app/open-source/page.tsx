import OpenSourceProject from 'components/open-source/open-source-project'
import { OPEN_SOURCE_PROJECTS } from 'lib/projects'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Source Projects',
  description:
    'Open source projects by Anmol Mahatpurkar — React libraries, developer tools, and more.',
  alternates: { canonical: '/open-source' },
  openGraph: {
    title: 'Open Source Projects - Anmol Mahatpurkar',
    description:
      'Open source projects by Anmol Mahatpurkar — React libraries, developer tools, and more.',
    url: 'https://anm.dev/open-source',
  },
}

const OpenSourcePage = () => (
  <section className="mx-auto w-full max-w-3xl py-4">
    <h2 className="mx-auto mb-2 w-full max-w-lg text-center font-semibold text-lg dark:text-dark-text">
      My Open Source Projects
    </h2>

    {OPEN_SOURCE_PROJECTS.map((project) => (
      <OpenSourceProject
        key={project.name}
        {...project}
        className="border-gray-lighter border-b py-6 last:border-b-0 dark:border-dark-border"
      />
    ))}
  </section>
)

export default OpenSourcePage
