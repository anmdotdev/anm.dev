import { ReactNode, FC } from 'react'
import { classnames } from 'utils/helpers'

const colors = ['success', 'warn', 'error', 'purple']

interface ChipProps {
  color?: string
  children: ReactNode
}

export const Chip: FC<ChipProps> = ({ color: propColor, children }) => {
  const color = propColor || colors[Math.floor(Math.random() * colors.length)]

  const classNames = {
    success: 'border-success bg-success-lightest',
    warn: 'border-warn bg-warn-lightest',
    error: 'border-error bg-error-lightest',
    purple: 'border-purple bg-purple-lightest',
  }

  return <span className={classnames('border p-1 rounded', classNames[color])}>{children}</span>
}

interface ChipsProps {
  chips: {
    label: ReactNode
    color?: string
  }[],
  className?: string
}

const Chips: FC<ChipsProps> = ({ chips, className }) => {
  return (
    <div className={classnames("space-x-3", className)}>
      {chips.map((chip, id: number) => (
        <Chip key={id} color={chip.color}>
          {chip.label}
        </Chip>
      ))}
    </div>
  )
}

export default Chips
