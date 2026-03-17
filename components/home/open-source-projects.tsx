import OpenSourceProject from 'components/open-source/open-source-project'

import Link from 'components/ui/link'
import { classnames } from 'lib/helpers'
import { OPEN_SOURCE_PROJECTS } from 'lib/projects'

interface OpenSourceProjectsProps {
  compactBottomSpacing?: boolean
}

const OpenSourceProjects = ({ compactBottomSpacing = false }: OpenSourceProjectsProps) => (
  <section
    className={classnames('mx-auto w-full max-w-3xl pt-4', compactBottomSpacing ? 'pb-8' : 'pb-16')}
  >
    <h2 className="mx-auto mb-8 w-full max-w-lg font-semibold text-lg max-md:px-6 dark:text-dark-text">
      My Open Source Projects
    </h2>

    <OpenSourceProject {...OPEN_SOURCE_PROJECTS[0]} priority />

    <div className="text-center">
      <Link
        className="mt-4 inline-block text-sm underline hover:text-black dark:text-dark-text-secondary dark:hover:text-dark-text"
        href="/open-source"
      >
        See all my open source projects...
      </Link>
    </div>
  </section>
)

export default OpenSourceProjects
