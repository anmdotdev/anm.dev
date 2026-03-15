import OpenSourceProject from 'components/open-source/open-source-project'

import Link from 'components/ui/link'
import { OPEN_SOURCE_PROJECTS } from 'lib/projects'

const OpenSourceProjects = () => (
  <section className="mx-auto w-full max-w-3xl py-4">
    <h2 className="mx-auto mb-8 w-full max-w-lg font-semibold text-lg max-md:px-6">
      My Open Source Projects
    </h2>

    <OpenSourceProject {...OPEN_SOURCE_PROJECTS[0]} />

    <div className="text-center">
      <Link className="my-4 text-sm underline hover:text-black" href="/open-source">
        See all my open source projects...
      </Link>
    </div>
  </section>
)

export default OpenSourceProjects
