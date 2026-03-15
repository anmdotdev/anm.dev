export type JourneyEntryType = 'work' | 'education' | 'entrepreneurship' | 'achievement'

export interface IJourneyEntry {
  category: JourneyEntryType
  company: string
  companyUrl?: string
  description?: string
  endDate: string
  highlight?: boolean
  location: string
  role: string
  startDate: string
  tags: string[]
}

export interface IJourneyAchievement {
  date: string
  description: string
  title: string
}

export const JOURNEY_ENTRIES: IJourneyEntry[] = [
  {
    category: 'work',
    company: 'Airbase - Paylocity',
    companyUrl: 'https://airbase.com',
    description:
      'Mentoring and leading initiatives to scale the frontend architecture and make frontend teams productive across the entire Airbase product.',
    endDate: 'Present',
    highlight: true,
    location: 'Remote',
    role: 'Staff Software Engineer - Frontend',
    startDate: 'Apr 2024',
    tags: ['TypeScript', 'React', 'Architecture', 'Leadership'],
  },
  {
    category: 'work',
    company: 'Airbase',
    companyUrl: 'https://airbase.com',
    description:
      'Led frontend platform initiatives, scaling design systems and shared infrastructure.',
    endDate: 'Jan 2024',
    location: 'Remote',
    role: 'Sr. Software Engineer II - Frontend Platform',
    startDate: 'Feb 2022',
    tags: ['TypeScript', 'React', 'Platform'],
  },
  {
    category: 'work',
    company: 'Airbase',
    companyUrl: 'https://airbase.com',
    description: 'Owned the frontend platform layer and drove adoption of shared tooling.',
    endDate: 'Jan 2022',
    location: 'Remote',
    role: 'Sr. Software Engineer - Frontend Platform',
    startDate: 'Feb 2021',
    tags: ['TypeScript', 'React', 'Platform'],
  },
  {
    category: 'work',
    company: 'Airbase',
    companyUrl: 'https://airbase.com',
    description: 'Built and maintained the Bill Payments frontend module.',
    endDate: 'Jan 2021',
    location: 'Remote',
    role: 'Software Engineer II - Frontend',
    startDate: 'Apr 2020',
    tags: ['React', 'JavaScript', 'Bill Payments'],
  },
  {
    category: 'work',
    company: 'Cogoport',
    companyUrl: 'https://www.cogoport.com',
    description:
      'Led frontend architecture for an Accel-funded tech-logistics startup. Built design systems, deployment pipelines, and an email automation tool.',
    endDate: 'Feb 2020',
    highlight: true,
    location: 'Mumbai',
    role: 'SDE III - Frontend Architect',
    startDate: 'Dec 2019',
    tags: ['React', 'Node.js', 'Architecture'],
  },
  {
    category: 'work',
    company: 'Cogoport',
    companyUrl: 'https://www.cogoport.com',
    description:
      'Led the frontend architecture team, making key technical decisions for the platform.',
    endDate: 'Dec 2019',
    location: 'Mumbai',
    role: 'Engineering Lead - Frontend Architecture',
    startDate: 'Jan 2019',
    tags: ['React', 'Leadership', 'Architecture'],
  },
  {
    category: 'work',
    company: 'Cogoport',
    companyUrl: 'https://www.cogoport.com',
    description:
      'First role at Cogoport — building React and Node.js applications from the ground up.',
    endDate: 'Dec 2018',
    location: 'Mumbai',
    role: 'Sr. Software Engineer - React | Node',
    startDate: 'Feb 2018',
    tags: ['React', 'Node.js'],
  },
  {
    category: 'entrepreneurship',
    company: 'PrimaRiSE',
    description: 'Founded a freelance development practice, building web applications for clients.',
    endDate: 'Feb 2018',
    location: 'Mumbai',
    role: 'Founder, Freelance Developer',
    startDate: 'Nov 2016',
    tags: ['Entrepreneurship', 'Freelance', 'Web Dev'],
  },
  {
    category: 'education',
    company: 'CIIE, IIM Ahmedabad',
    description:
      "Selected for an entrepreneurship program at one of India's premier business schools.",
    endDate: 'May 2017',
    location: 'Ahmedabad',
    role: 'Entrepreneurial Launchboard Program',
    startDate: 'Apr 2017',
    tags: ['Entrepreneurship', 'Education'],
  },
  {
    category: 'work',
    company: 'Emotix',
    description: 'Led game development for consumer-facing products.',
    endDate: 'Oct 2016',
    location: 'Mumbai',
    role: 'Lead Game Developer',
    startDate: 'Aug 2016',
    tags: ['Unity3D', 'Game Dev', 'Leadership'],
  },
  {
    category: 'work',
    company: 'Roosh Interactive',
    description:
      'Started as an intern building games, grew into a full-time game programmer. This is where the journey began.',
    endDate: 'Apr 2016',
    highlight: true,
    location: 'Mumbai',
    role: 'Game Programmer',
    startDate: 'Jun 2014',
    tags: ['Unity3D', 'C#', 'Game Dev'],
  },
  {
    category: 'education',
    company: "St. Xavier's College, Mumbai",
    description: 'Bachelors of Science in Information Technology. GPA: 3.67 / 4.0',
    endDate: 'May 2015',
    location: 'Mumbai',
    role: 'B.Sc - Information Technology',
    startDate: 'Jun 2012',
    tags: ['Education', 'Computer Science'],
  },
  {
    category: 'education',
    company: 'IIDT, Mumbai',
    description: 'Foundation in visual design, multimedia, and 3D modeling.',
    endDate: '',
    location: 'Mumbai',
    role: 'Diploma in Multimedia, 2D & 3D Design',
    startDate: '',
    tags: ['Education', 'Design', 'Multimedia'],
  },
]

export const JOURNEY_ACHIEVEMENTS: IJourneyAchievement[] = [
  {
    date: '2018',
    description:
      'A React toast notification library with ~30K npm downloads/month and 676 GitHub stars.',
    title: 'Cogo-Toast — Open Source Success',
  },
  {
    date: 'Jul 2018',
    description: 'Recognized as the best engineer at Cogoport, Mumbai.',
    title: 'The Best Engineer Award',
  },
  {
    date: '2015',
    description:
      "Lead developer on Zipsack's Adventure, nominated for Upcoming Game of the Year at the NGF Awards.",
    title: "NGF Awards '15 — Upcoming Game of the Year",
  },
]

export const JOURNEY_ERAS = [
  {
    description: 'Scaling frontend teams and systems at growing product organizations.',
    endIndex: 3,
    label: 'The Staff Engineer Path',
    startIndex: 0,
    years: '2020 – Present',
  },
  {
    description: 'Deep-diving into React, Node, and frontend architecture at scale.',
    endIndex: 6,
    label: 'The Architecture Years',
    startIndex: 4,
    years: '2018 – 2020',
  },
  {
    description: 'Striking out independently and learning the business side of tech.',
    endIndex: 8,
    label: 'The Entrepreneurial Leap',
    startIndex: 7,
    years: '2016 – 2018',
  },
  {
    description:
      'Where it all started — building games, learning to code, and discovering the craft.',
    endIndex: 12,
    label: 'The Early Days',
    startIndex: 9,
    years: '2012 – 2016',
  },
]
