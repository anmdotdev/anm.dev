import OpenSourceProject from 'components/open-source/open-source-project'
import { OPEN_SOURCE_PROJECTS } from 'lib/projects'
import type { Metadata } from 'next'

export const revalidate = 300

const PROGRAMMING_LANGUAGES = new Set(['JavaScript', 'TypeScript', 'HTML', 'CSS'])

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
    type: 'website',
    siteName: 'anmdotdev',
    locale: 'en_US',
    images: [
      {
        url: 'https://anm.dev/open-source/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Open source projects',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Source Projects - Anmol Mahatpurkar',
    description:
      'Open source projects by Anmol Mahatpurkar — React libraries, developer tools, and more.',
    creator: '@anmdotdev',
    site: '@anmdotdev',
    images: [
      {
        url: 'https://anm.dev/open-source/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Open source projects',
        type: 'image/png',
      },
    ],
  },
}

const projectsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://anm.dev/open-source#collection',
  name: 'Open Source Projects by Anmol Mahatpurkar',
  description:
    'Open source projects by Anmol Mahatpurkar — React libraries, developer tools, and more.',
  url: 'https://anm.dev/open-source',
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://anm.dev/#website',
  },
  author: {
    '@type': 'Person',
    '@id': 'https://anm.dev/#person',
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
        ...(project.tags.map((tag) => tag.label).filter((tag) => PROGRAMMING_LANGUAGES.has(tag))
          .length > 0
          ? {
              programmingLanguage: project.tags
                .map((tag) => tag.label)
                .filter((tag) => PROGRAMMING_LANGUAGES.has(tag)),
            }
          : {}),
        keywords: project.tags.map((tag) => tag.label).join(', '),
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
    <p className="mx-auto mb-8 max-w-2xl px-6 text-center text-gray-dark text-sm leading-relaxed dark:text-dark-text-secondary">
      A collection of React libraries, developer tools, and frontend experiments I have built in
      public. Each project reflects the kind of product engineering, design systems work, and
      tooling I care about.
    </p>

    {OPEN_SOURCE_PROJECTS.map((project) => (
      <OpenSourceProject
        key={project.name}
        {...project}
        cardClickable
        className="border-gray-lighter border-b py-6 last:border-b-0 dark:border-dark-border"
        headingLevel="h2"
        priority={project.name === OPEN_SOURCE_PROJECTS[0]?.name}
        showDemoButton
      />
    ))}

    <script
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      type="application/ld+json"
    />
    <script
      /* biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://anm.dev',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Open Source',
              item: 'https://anm.dev/open-source',
            },
          ],
        }),
      }}
      type="application/ld+json"
    />
  </section>
)

export default OpenSourcePage
