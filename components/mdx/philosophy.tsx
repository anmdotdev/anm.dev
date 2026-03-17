interface PhilosophyProps {
  children: React.ReactNode
}

import Callout from './callout'

const Philosophy = ({ children }: PhilosophyProps) => {
  return <Callout type="philosophy">{children}</Callout>
}

export default Philosophy
