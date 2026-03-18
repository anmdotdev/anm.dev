import { classnames } from 'lib/helpers'
import Image from 'next/image'
import Link from 'next/link'

import downloadIcon from 'public/icons/download.svg'
import newTabIcon from 'public/icons/new-tab.svg'

interface ILinkProps {
  children?: React.ReactNode
  className?: string
  download?: string
  external?: boolean
  href: string
  rel?: string
  showIcon?: 'always' | 'hover' | 'never'
  style?: React.CSSProperties
  target?: string
}

const EXTERNAL_REL_VALUES = ['nofollow', 'noopener', 'noreferrer'] as const
const REL_SPLIT_REGEX = /\s+/

const getRelValue = (external?: boolean, rel?: string): string | undefined => {
  if (!external) {
    return rel || undefined
  }

  const relValues = new Set((rel || '').split(REL_SPLIT_REGEX).filter(Boolean))

  for (const value of EXTERNAL_REL_VALUES) {
    relValues.add(value)
  }

  return Array.from(relValues).join(' ')
}

export default ({
  href,
  target: propTarget,
  external,
  download,
  rel,
  children,
  className,
  showIcon = 'hover',
  ...rest
}: ILinkProps) => {
  const target = propTarget || (external ? '_blank' : undefined)
  const iconClassName = classnames(
    'text-gray ml-2',
    showIcon === 'hover' ? 'opacity-0 group-hover:opacity-100' : '',
  )

  let icon: React.ReactNode = null
  if (download) {
    icon = (
      <Image
        alt=""
        className={classnames(iconClassName, 'w-3')}
        height={12}
        src={downloadIcon}
        width={12}
      />
    )
  } else if (target === '_blank') {
    icon = (
      <Image
        alt=""
        className={classnames(iconClassName, 'w-4')}
        height={16}
        src={newTabIcon}
        width={16}
      />
    )
  }

  return (
    <Link
      {...rest}
      className={classnames(
        'group inline-flex items-center hover:underline focus-visible:underline focus-visible:outline-none',
        className || '',
      )}
      download={download}
      href={href}
      prefetch={!external}
      rel={getRelValue(external, rel)}
      target={target}
    >
      {children}

      {showIcon === 'never' ? null : icon}
    </Link>
  )
}
