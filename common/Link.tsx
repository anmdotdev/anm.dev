'use client'

import { ReactNode, FC } from 'react'

import NextLink from 'next/link'

import IconNewTab from 'common/Icons/IconNewTab'
import IconDownload from 'common/Icons/IconDownload'

import { logEvent, Events } from 'utils/analytics'
import { classnames } from 'utils/helpers'

interface Props {
  href: string
  children?: ReactNode
  target?: string
  external?: boolean
  download?: string
  rel?: string
  className?: string
  showIcon?: 'always' | 'hover' | 'never'
}

const Link: FC<Props> = (props) => {
  const {
    href,
    target: propTarget,
    external,
    download,
    rel,
    children,
    className,
    showIcon = 'hover',
    ...rest
  } = props

  const target = propTarget || external ? '_blank' : ''
  const iconClassName = classnames(
    'text-gray ml-2',
    showIcon === 'hover' ? 'opacity-0 group-hover:opacity-100' : '',
  )

  const icon = download ? (
    <IconDownload className={classnames(iconClassName, 'w-3')} />
  ) : target === '_blank' ? (
    <IconNewTab className={classnames(iconClassName, 'w-4')} />
  ) : null
  const onClick = () => {
    logEvent(Events.Link.Clicked, { href, target, download, rel, external })
  }
  return (
    <NextLink
      {...rest}
      href={href}
      target={target}
      download={download}
      rel={rel || external ? 'noreferrer noopener nofollow' : ''}
      className={classnames('group inline-flex items-center hover:underline', className || '')}
      onClick={onClick}
    >
      {children}

      {showIcon !== 'never' ? icon : null}
    </NextLink>
  )
}

export default Link
