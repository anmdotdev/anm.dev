import { renderMermaidSVG } from 'beautiful-mermaid'

interface MermaidProps {
  chart?: string
  children?: React.ReactNode
}

const Mermaid = ({ chart, children }: MermaidProps) => {
  const raw = chart || (typeof children === 'string' ? children : '')

  if (!raw) {
    return null
  }

  // Convert pipe delimiters to newlines (MDX strips JSX expressions, so we use plain string props with | as line separator)
  const definition = raw.includes('|') ? raw.replace(/\s*\|\s*/g, '\n') : raw.replace(/\\n/g, '\n')

  try {
    const svg = renderMermaidSVG(definition, {
      bg: 'var(--color-gray-lightest)',
      fg: 'var(--color-black)',
      line: 'var(--color-gray)',
      accent: 'var(--color-purple)',
      muted: 'var(--color-gray-dark)',
      surface: 'var(--color-white)',
      border: 'var(--color-gray-lighter)',
      transparent: true,
    })

    return (
      <div
        className="my-6 overflow-x-auto rounded-lg border border-gray-lighter bg-white p-4 dark:border-dark-border dark:bg-dark-surface [&_svg]:mx-auto"
        /* biome-ignore lint/security/noDangerouslySetInnerHtml: beautiful-mermaid renders SVG */
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  } catch {
    return (
      <pre className="my-6 rounded-lg border border-error-lighter bg-error-lightest p-4 text-error-dark text-xs dark:border-dark-border dark:bg-dark-surface dark:text-error-light">
        {`Failed to render diagram:\n${definition}`}
      </pre>
    )
  }
}

export default Mermaid
