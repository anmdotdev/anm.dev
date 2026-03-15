import Link from 'components/ui/link'
import type { MDXComponents } from 'mdx/types'
import Mermaid from './mermaid'

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const Tag = `h${level}` as const

  return ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === 'string' ? children : ''
    const id =
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || undefined

    return (
      <Tag id={id} {...props}>
        {id ? (
          <a className="no-underline" href={`#${id}`}>
            {children}
          </a>
        ) : (
          children
        )}
      </Tag>
    )
  }
}

const mdxComponents: MDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} showIcon="never" {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
        {children}
      </a>
    )
  },
  Mermaid,
}

export default mdxComponents
