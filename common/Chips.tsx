import { ReactNode } from 'react'
import { classnames } from 'utils/helpers'

interface IChipProps {
  color?: string
  children: ReactNode
}

export const Chip = ({ children }: IChipProps) => {
  return (
    <span className="border p-1 rounded border-gray-lighter bg-gray-lightest text-gray-darker text-xs">
      {children}
    </span>
  )
}

interface IChipsProps {
  chips: {
    label: ReactNode
    color?: string
  }[]
  className?: string
}

const Chips = ({ chips, className }: IChipsProps) => (
  <div className={classnames('space-x-3', className)}>
    {chips.map((chip, id: number) => (
      <Chip key={id} color={chip.color}>
        {chip.label}
      </Chip>
    ))}
  </div>
)

export default Chips
