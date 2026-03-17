interface PhilosophyProps {
  children: React.ReactNode
}

const Philosophy = ({ children }: PhilosophyProps) => (
  <figure className="philosophy">
    <blockquote>{children}</blockquote>
  </figure>
)

export default Philosophy
