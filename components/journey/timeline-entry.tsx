import { Chip } from 'components/ui/chips'
import Link from 'components/ui/link'
import type { IJourneyEntry } from 'lib/journey'

interface ITimelineEntryProps {
  entry: IJourneyEntry
  index: number
}

const categoryLabels: Record<string, string> = {
  education: 'EDU',
  entrepreneurship: 'BIZ',
  work: 'WORK',
}

const getNodeStyle = (entry: IJourneyEntry): string => {
  if (entry.highlight) {
    return 'border-purple bg-purple-lightest text-purple-dark dark:bg-purple-darker/20 dark:text-purple-light'
  }
  if (entry.category === 'education') {
    return 'border-gray-light bg-white text-gray-dark dark:border-dark-border-highlight dark:bg-dark-surface dark:text-dark-text-muted'
  }
  return 'border-gray-lighter bg-white text-gray-dark dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-muted'
}

const TimelineEntry = ({ entry, index }: ITimelineEntryProps) => {
  const isLeft = index % 2 === 0
  const dateRange = entry.endDate
    ? `${entry.startDate} — ${entry.endDate}`
    : entry.startDate || 'Early career'

  return (
    <div className="group relative flex w-full items-start max-md:flex-row md:items-center">
      {/* Left content (desktop only) */}
      <div
        className={`hidden w-[calc(50%-20px)] md:block ${isLeft ? 'pr-8' : 'pointer-events-none invisible pr-8'}`}
      >
        {isLeft && <EntryCard dateRange={dateRange} entry={entry} side="left" />}
      </div>

      {/* Timeline node */}
      <div className="z-10 flex shrink-0 flex-col items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold font-mono text-[10px] tracking-tight ${getNodeStyle(entry)}`}
        >
          {categoryLabels[entry.category] ?? '—'}
        </div>
      </div>

      {/* Right content (desktop only) */}
      <div
        className={`hidden w-[calc(50%-20px)] md:block ${isLeft ? 'pointer-events-none invisible pl-8' : 'pl-8'}`}
      >
        {!isLeft && <EntryCard dateRange={dateRange} entry={entry} side="right" />}
      </div>

      {/* Mobile content */}
      <div className="ml-4 flex-1 md:hidden">
        <EntryCard dateRange={dateRange} entry={entry} side="right" />
      </div>
    </div>
  )
}

const EntryCard = ({
  dateRange,
  entry,
  side,
}: {
  dateRange: string
  entry: IJourneyEntry
  side: 'left' | 'right'
}) => (
  <div
    className={`rounded-lg border bg-white p-5 transition-shadow hover:shadow dark:bg-dark-surface dark:hover:bg-dark-surface-hover dark:hover:shadow-none ${
      entry.highlight
        ? 'border-purple-lighter dark:border-purple-darker/50'
        : 'border-gray-lighter dark:border-dark-border'
    } ${side === 'left' ? 'text-right' : 'text-left'}`}
  >
    <p className="mb-1.5 font-mono text-gray-dark text-xs tracking-wider dark:text-dark-text-muted">
      {dateRange}
    </p>
    <h3 className="mb-1 font-semibold text-base text-black dark:text-dark-text">{entry.role}</h3>
    <p className="mb-2 text-gray-darker text-sm dark:text-dark-text-secondary">
      {entry.companyUrl ? (
        <Link
          className="text-link dark:text-dark-link"
          external
          href={entry.companyUrl}
          showIcon="never"
        >
          {entry.company}
        </Link>
      ) : (
        entry.company
      )}
      {entry.location && (
        <span className="text-gray dark:text-dark-text-muted"> · {entry.location}</span>
      )}
    </p>
    {entry.description && (
      <p className="mb-3 text-gray-darker text-sm leading-relaxed dark:text-dark-text-secondary">
        {entry.description}
      </p>
    )}
    <div className={`flex flex-wrap gap-1.5 ${side === 'left' ? 'justify-end' : 'justify-start'}`}>
      {entry.tags.map((tag) => (
        <Chip key={tag}>{tag}</Chip>
      ))}
    </div>
  </div>
)

export default TimelineEntry
