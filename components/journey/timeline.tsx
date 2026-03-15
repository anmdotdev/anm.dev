import { JOURNEY_ENTRIES, JOURNEY_ERAS } from 'lib/journey'

import TimelineEntry from './timeline-entry'

const Timeline = () => (
  <section className="mx-auto w-full max-w-5xl px-6 pt-10 pb-16">
    {/* Header */}
    <h1 className="mb-12 text-center font-bold text-4xl text-black dark:text-dark-text">
      My Journey
    </h1>

    {/* Timeline */}
    <div className="relative">
      {/* Vertical line — centered on desktop, left-aligned on mobile */}
      <div className="absolute top-0 bottom-0 left-[19px] w-px bg-gray-lighter md:left-1/2 md:-translate-x-px dark:bg-dark-border" />

      {JOURNEY_ERAS.map((era, eraIndex) => {
        const entries = JOURNEY_ENTRIES.slice(era.startIndex, era.endIndex + 1)

        return (
          <div className="mb-4" key={era.label}>
            {/* Era marker */}
            <div className="relative z-10 mb-8 flex items-center max-md:ml-12 md:justify-center">
              <div className="rounded-full border border-gray-lighter bg-white px-5 py-2.5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
                <p className="font-semibold text-black text-sm dark:text-dark-text">{era.label}</p>
                <p className="text-center font-mono text-gray text-xs tracking-wider dark:text-dark-text-muted">
                  {era.years}
                </p>
              </div>
            </div>

            {/* Era description */}
            <div className="relative z-10 mb-8 flex max-md:ml-12 md:justify-center">
              <p className="bg-gray-lightest px-4 text-center text-gray-dark text-sm italic max-md:text-left dark:bg-dark-bg dark:text-dark-text-muted">
                {era.description}
              </p>
            </div>

            {/* Entries */}
            <div className="space-y-8">
              {entries.map((entry, i) => (
                <TimelineEntry
                  entry={entry}
                  index={era.startIndex + i}
                  key={`${entry.company}-${entry.role}`}
                />
              ))}
            </div>

            {/* Era divider */}
            {eraIndex < JOURNEY_ERAS.length - 1 && (
              <div className="relative z-10 my-10 flex items-center max-md:ml-12 md:justify-center">
                <div className="h-px w-32 bg-gray-lighter dark:bg-dark-border" />
              </div>
            )}
          </div>
        )
      })}

      {/* Terminal dot at bottom */}
      <div className="relative z-10 flex max-md:justify-start md:justify-center">
        <div className="ml-[15px] h-2.5 w-2.5 rounded-full bg-gray-lighter md:ml-0 dark:bg-dark-border" />
      </div>
    </div>
  </section>
)

export default Timeline
