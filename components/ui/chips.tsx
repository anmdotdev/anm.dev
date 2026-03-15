import { classnames } from 'lib/helpers'

interface IChipProps {
  children: React.ReactNode
  color?: string
}

export const Chip = ({ children }: IChipProps) => {
  return (
    <span className="rounded border border-gray-lighter bg-gray-lightest p-1 text-gray-darker text-xs">
      {children}
    </span>
  )
}

interface IChipsProps {
  chips: {
    label: React.ReactNode
    color?: string
  }[]
  className?: string
}

const Chips = ({ chips, className }: IChipsProps) => (
  <div className={classnames('space-x-3', className)}>
    {chips.map((chip) => (
      <Chip color={chip.color} key={String(chip.label)}>
        {chip.label}
      </Chip>
    ))}
  </div>
)

export default Chips
