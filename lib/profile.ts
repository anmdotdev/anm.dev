const CAREER_START_YEAR = 2014
const CAREER_START_MONTH_INDEX = 5

export const CAREER_START_LABEL = 'June 2014'

export const getRoundedExperienceYears = (referenceDate: Date = new Date()): number => {
  const monthsSinceStart =
    (referenceDate.getUTCFullYear() - CAREER_START_YEAR) * 12 +
    (referenceDate.getUTCMonth() - CAREER_START_MONTH_INDEX)

  return Math.max(1, Math.round(monthsSinceStart / 12))
}

export const EXPERIENCE_YEARS = getRoundedExperienceYears()
export const EXPERIENCE_YEARS_LABEL = `${EXPERIENCE_YEARS} years`
