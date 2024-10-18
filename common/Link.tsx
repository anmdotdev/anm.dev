import { ReactNode } from 'react'

import NextLink from 'next/link'

import IconNewTab from 'common/Icons/IconNewTab'
import IconDownload from 'common/Icons/IconDownload'

import { css } from '@pigment-css/react'
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

const Link = ({
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
    css(({ theme }) => ({ color: theme.colors.gray, marginLeft: 8 })),
    showIcon === 'hover'
      ? css({
          opacity: 0,

          '&:hover': {
            opacity: 1,
          },
        })
      : '',
  )

  const icon = download ? (
    <IconDownload className={classnames(iconClassName, css({ width: 12 }))} />
  ) : target === '_blank' ? (
    <IconNewTab className={classnames(iconClassName, css({ width: 16 }))} />
  ) : null

  return (
    <NextLink
      {...rest}
      href={href}
      target={target}
      download={download}
      rel={rel || external ? 'noreferrer noopener nofollow' : ''}
      className={classnames(
        css(({ theme }) => ({
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: theme.colors.black,

          '&:hover': {
            textDecoration: 'underline',
          },
        })),
        className || '',
      )}
      prefetch={!external}
    >
      {children}

      {showIcon !== 'never' ? icon : null}
    </NextLink>
  )
}

export default Link
