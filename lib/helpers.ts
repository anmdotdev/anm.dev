const compactCountFormatter = new Intl.NumberFormat('en', {
  compactDisplay: 'short',
  maximumFractionDigits: 1,
  notation: 'compact',
})

export const classnames = (...args) => args.join(' ').trim()

export const formatCompactCount = (value: number): string =>
  compactCountFormatter.format(value).toLowerCase()
