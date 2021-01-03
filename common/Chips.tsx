import { ReactNode, FC } from 'react'
import { classnames } from 'utils/helpers'

interface ChipProps {
  color?: string
  children: ReactNode
}

export const Chip: FC<ChipProps> = ({ children }) => {
  return (
    <span className="border p-1 rounded border-gray-lighter bg-gray-lightest text-gray-darker text-xs">
      {children}
    </span>
  )
}

interface ChipsProps {
  chips: {
    label: ReactNode
    color?: string
  }[]
  className?: string
}

const Chips: FC<ChipsProps> = ({ chips, className }) => {
  return (
    <div className={classnames('space-x-3', className)}>
      {chips.map((chip, id: number) => (
        <Chip key={id} color={chip.color}>
          {chip.label}
        </Chip>
      ))}
    </div>
  )
}

export default Chips
