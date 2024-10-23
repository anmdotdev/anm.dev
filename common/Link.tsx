import { ReactNode } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { classnames } from 'utils/helpers'

interface ILinkProps {
  href: string
  children?: ReactNode
  target?: string
  external?: boolean
  download?: string
  rel?: string
  className?: string
  showIcon?: 'always' | 'hover' | 'never'
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
  const target = propTarget || external ? '_blank' : ''
  const iconClassName = classnames(
    'text-gray ml-2',
    showIcon === 'hover' ? 'opacity-0 group-hover:opacity-100' : '',
  )

  const icon = download ? (
    <Image
      src="/icons/download.svg"
      className={classnames(iconClassName, 'w-3')}
      width={12}
      height={12}
      alt=""
    />
  ) : target === '_blank' ? (
    <Image
      src="/icons/new-tab.svg"
      className={classnames(iconClassName, 'w-4')}
      width={16}
      height={16}
      alt=""
    />
  ) : null

  return (
    <Link
      {...rest}
      href={href}
      target={target}
      download={download}
      rel={rel || external ? 'noreferrer noopener nofollow' : ''}
      className={classnames('group inline-flex items-center hover:underline', className || '')}
      prefetch={!external}
    >
      {children}

      {showIcon !== 'never' ? icon : null}
    </Link>
  )
}
