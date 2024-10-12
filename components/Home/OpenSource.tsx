import React from 'react'

import Link from 'common/Link'
import OpenSourceProject from 'components/OpenSource/OpenSourceProject'

import { OPEN_SOURCE_PROJECTS } from 'utils/projects'

const OpenSourceProjects = () => {
  return (
    <section className="w-full max-w-3xl mx-auto py-4">
      <h2 className="w-full max-w-lg mx-auto text-lg font-semibold mb-8 md:px-6">
        My Open Source Projects
      </h2>

      <OpenSourceProject {...OPEN_SOURCE_PROJECTS[0]} />

      <div className="text-center">
        <Link href="/open-source" className="my-4 text-sm underline hover:text-black">
          See all my open source projects...
        </Link>
      </div>
    </section>
  )
}

export default OpenSourceProjects
