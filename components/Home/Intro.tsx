import React from 'react'

import Link from 'common/Link'

const Intro = () => (
  <section className="w-full max-w-lg mx-auto pt-10 pb-8 sm:px-6">
    <h1 className="text-center font-bold text-4xl mb-8">Hey, I'm Anmol 👋</h1>
    <p className="mb-6">
      I am a remote <strong className="font-medium">Staff Frontend Engineer</strong>, based in
      Mumbai, India, and I love JavaScript and React. I currently work at{' '}
      <Link
        href="https://airbase.com"
        className="text-link font-semibold"
        external
        showIcon="never"
      >
        Airbase Inc.
      </Link>
      , recently acquired by{' '}
      <Link
        href="https://www.paylocity.com/resources/resource-library/press-release/paylocity-announces-completion-of-acquisition-of-airbase-inc/"
        className="text-link font-semibold"
        external
        showIcon="never"
      >
        Paylocity
      </Link>
      , and have a total of <strong className="font-medium">about 10 years of experience</strong> as
      an engineer.
    </p>
    <p className="mb-6">
      Over the span of 10 years, I have worked with a{' '}
      <strong className="font-medium">range of Frontend initiatives</strong>, including multiple{' '}
      <strong className="font-medium">Design Systems, Web & Mobile Apps, & mentored</strong>{' '}
      multiple teams on building{' '}
      <strong className="font-medium">frontend across multiple different product areas.</strong>
    </p>
    <p>
      When I am not working, you would find me playing Age of Empires 2 on my PC. I also like to
      play chess, and think about the mysteries of the human mind, sometimes.
    </p>
  </section>
)

export default Intro
