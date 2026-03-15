import Link from 'components/ui/link'

const Intro = () => (
  <section className="mx-auto w-full max-w-lg pt-10 pb-8 max-sm:px-6">
    <h1 className="mb-8 text-center font-bold text-4xl">Hey, I'm Anmol 👋</h1>
    <p className="mb-6">
      I am a remote <strong className="font-medium">Staff Frontend Engineer</strong>, based in
      Mumbai, India, and I love JavaScript and React. I currently work at{' '}
      <Link
        className="font-semibold text-link"
        external
        href="https://airbase.com"
        showIcon="never"
      >
        Airbase Inc.
      </Link>
      , recently acquired by{' '}
      <Link
        className="font-semibold text-link"
        external
        href="https://www.paylocity.com/resources/resource-library/press-release/paylocity-announces-completion-of-acquisition-of-airbase-inc/"
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
