import { EXPERIENCE_YEARS_LABEL } from 'lib/profile'

const Intro = () => (
  <section className="mx-auto w-full max-w-lg pt-10 pb-8 max-sm:px-6">
    <h1 className="mb-8 text-center font-bold text-4xl dark:text-dark-text">Hey, I'm Anmol 👋</h1>
    <p className="mb-6 text-gray-dark dark:text-dark-text-secondary">
      I am a remote{' '}
      <strong className="font-medium text-black dark:text-dark-text">
        Staff Software Engineer
      </strong>
      , based in Mumbai, India, currently working on AI products at a{' '}
      <strong className="font-medium text-black dark:text-dark-text">stealth startup</strong>. I
      love JavaScript, React, and the web, and I have a total of{' '}
      <strong className="font-medium text-black dark:text-dark-text">
        about {EXPERIENCE_YEARS_LABEL} of experience
      </strong>{' '}
      as an engineer.
    </p>
    <p className="mb-6 text-gray-dark dark:text-dark-text-secondary">
      Over the span of {EXPERIENCE_YEARS_LABEL}, I have worked with a{' '}
      <strong className="font-medium text-black dark:text-dark-text">
        range of Frontend initiatives
      </strong>
      , including multiple{' '}
      <strong className="font-medium text-black dark:text-dark-text">
        Design Systems, Web & Mobile Apps, & mentored
      </strong>{' '}
      multiple teams on building{' '}
      <strong className="font-medium text-black dark:text-dark-text">
        frontend across multiple different product areas.
      </strong>{' '}
      These days, a lot of that energy goes into building at the intersection of web engineering and
      AI.
    </p>
    <p className="text-gray-dark dark:text-dark-text-secondary">
      When I am not working, you would find me playing Age of Empires 2 on my PC. I also like to
      play chess, and think about the mysteries of the human mind, sometimes.
    </p>
  </section>
)

export default Intro
