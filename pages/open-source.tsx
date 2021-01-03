import OpenSourceProject from 'components/OpenSource/OpenSourceProject'
import { OPEN_SOURCE_PROJECTS } from 'utils/projects'

const OpenSource = () => {
  return (
    <section className="w-full max-w-3xl mx-auto py-4 ">
      <h2 className="w-full max-w-lg mx-auto text-lg text-center font-semibold mb-10">
        My Open Source Projects
      </h2>

      <div className="space-y-8 mb-8">
        {OPEN_SOURCE_PROJECTS.map((project) => (
          <OpenSourceProject key={project.name} {...project} />
        ))}
      </div>
    </section>
  )
}

export default OpenSource
