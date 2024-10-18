import { css } from '@pigment-css/react'
import { ReactNode } from 'react'
import { classnames } from 'utils/helpers'

interface IChipProps {
  color?: string
  children: ReactNode
}

export const Chip = ({ children }: IChipProps) => {
  return (
    <span
      className={css(({ theme }) => ({
        border: `1px solid ${theme.colors.gray.lighter}`,
        padding: 4,
        background: theme.colors.gray.lightest,
        color: theme.colors.gray.darker,
        fontSize: 12,
        lineHeight: 1.1,
        borderRadius: 4,
      }))}
    >
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
  <div className={classnames(css({ display: 'inline-flex', gap: 8 }), className)}>
    {chips.map((chip, id: number) => (
      <Chip key={id} color={chip.color}>
        {chip.label}
      </Chip>
    ))}
  </div>
)

export default Chips
