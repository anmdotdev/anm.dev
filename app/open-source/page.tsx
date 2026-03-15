import OpenSourceProject from 'components/open-source/open-source-project'

import { OPEN_SOURCE_PROJECTS } from 'lib/projects'

const OpenSourcePage = () => (
  <section className="mx-auto w-full max-w-3xl py-4">
    <h2 className="mx-auto mb-2 w-full max-w-lg text-center font-semibold text-lg">
      My Open Source Projects
    </h2>

    {OPEN_SOURCE_PROJECTS.map((project) => (
      <OpenSourceProject
        key={project.name}
        {...project}
        className="border-gray-lighter border-b py-6 last:border-b-0"
      />
    ))}
  </section>
)

export default OpenSourcePage
