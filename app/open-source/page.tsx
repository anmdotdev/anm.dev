import { css } from '@pigment-css/react'
import OpenSourceProject from 'components/OpenSourceProjects/OpenSourceProject'
import { OPEN_SOURCE_PROJECTS } from 'utils/projects'

const OpenSourcePage = () => (
  <section
    className={css(({ theme }) => ({
      width: '100%',
      maxWidth: 768,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: 16,
      paddingBottom: 16,
    }))}
  >
    <h2
      className={css(({ theme }) => ({
        width: '100%',
        maxWidth: 512,

        marginLeft: 'auto',
        marginRight: 'auto',

        fontSize: 18,
        lineHeight: 1.1,

        textAlign: 'center',
        fontWeight: 600,
        marginBottom: 32,
      }))}
    >
      My Open Source Projects
    </h2>

    {OPEN_SOURCE_PROJECTS.map((project) => (
      <OpenSourceProject
        key={project.name}
        {...project}
        className={css(({ theme }) => ({
          paddingTop: 24,
          paddingBottom: 24,
          borderBottom: `1px solid ${theme.colors.gray.lighter}`,

          '&:last-child': {
            borderBottom: 'none',
          },
        }))}
      />
    ))}
  </section>
)

export default OpenSourcePage
