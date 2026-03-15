interface Heading {
  id: string
  level: number
  text: string
}

interface TableOfContentsProps {
  headings: Heading[]
}

const TableOfContents = ({ headings }: TableOfContentsProps) => (
  <nav
    aria-label="Table of contents"
    className="mb-8 rounded-lg border border-gray-lighter bg-gray-lightest p-4 dark:border-dark-border dark:bg-dark-surface"
  >
    <h2 className="mb-2 font-semibold text-black text-xs uppercase tracking-wider dark:text-dark-text">
      On this page
    </h2>
    <ul className="space-y-1">
      {headings.map((heading) => (
        <li key={heading.id} style={{ paddingLeft: heading.level === 3 ? '1rem' : 0 }}>
          <a
            className="text-gray-dark text-xs transition-colors hover:text-black dark:text-dark-text-secondary dark:hover:text-dark-text"
            href={`#${heading.id}`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)

export default TableOfContents
