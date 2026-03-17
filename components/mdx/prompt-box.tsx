interface PromptBoxProps {
  children: React.ReactNode
}

const PromptBox = ({ children }: PromptBoxProps) => {
  return (
    <div className="prompt-box">
      <div className="prompt-box__inner">{children}</div>
    </div>
  )
}

export default PromptBox
