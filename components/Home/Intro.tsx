import React from 'react'

import Link from 'common/Link'

const Intro = () => {
  return (
    <section className="w-full max-w-lg mx-auto pt-10 pb-8 sm:px-6">
      <h1 className="text-center font-bold text-4xl mb-8">Hey, I'm Anmol 👋</h1>
      <p className="mb-6">
        I am a Frontend Engineer from India 🇮🇳 and I love JavaScript and React. I currently work as
        a <strong className="font-medium">Sr. Software Engineer</strong> at{' '}
        <Link href="https://airbase.com" className="text-link" external showIcon="never">
          Airbase Inc.
        </Link>{' '}
        and have a total of about 6 years of experience as an engineer.
      </p>
      <p>
        When I am not working, you would find me playing games on my not-so-gaming PC. I also like
        to play chess, and think about the mysteries of the human mind, sometimes.
      </p>
    </section>
  )
}

export default Intro
