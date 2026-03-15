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

const projectsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Open Source Projects by Anmol Mahatpurkar',
  description:
    'Open source projects by Anmol Mahatpurkar — React libraries, developer tools, and more.',
  url: 'https://anm.dev/open-source',
  author: {
    '@type': 'Person',
    name: 'Anmol Mahatpurkar',
    url: 'https://anm.dev',
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: OPEN_SOURCE_PROJECTS.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: project.description,
        codeRepository: `https://github.com/${project.githubOrgName}/${project.githubRepoName}`,
        programmingLanguage: project.tags.map((t) => t.label),
        author: {
          '@type': 'Person',
          name: 'Anmol Mahatpurkar',
        },
      },
    })),
  },
}

const OpenSourcePage = () => (
  <section className="mx-auto w-full max-w-3xl pt-4 pb-16">
    <h1 className="mx-auto mb-2 w-full max-w-lg text-center font-semibold text-lg dark:text-dark-text">
      My Open Source Projects
    </h1>

    {OPEN_SOURCE_PROJECTS.map((project) => (
      <OpenSourceProject
        key={project.name}
        {...project}
        className="border-gray-lighter border-b py-6 last:border-b-0 dark:border-dark-border"
      />
    ))}

    <script
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      type="application/ld+json"
    />
  </section>
)

export default OpenSourcePage
