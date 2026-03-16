import { getBlogPosts } from 'lib/blog'
import { JOURNEY_ACHIEVEMENTS, JOURNEY_ENTRIES } from 'lib/journey'
import { OPEN_SOURCE_PROJECTS } from 'lib/projects'

export const GET = () => {
  const posts = getBlogPosts()

  const blogContent = posts
    .map(
      (post) => `### ${post.title}

- URL: https://anm.dev/blog/${post.slug}
- Date: ${post.date}
- Tags: ${post.tags.join(', ')}
- Reading Time: ${post.readingTime}
- Summary: ${post.summary}

${post.content}

---`,
    )
    .join('\n\n')

  const journeyContent = JOURNEY_ENTRIES.map(
    (entry) =>
      `- **${entry.role}** at ${entry.company} (${entry.startDate} – ${entry.endDate}) — ${entry.location}${entry.description ? `\n  ${entry.description}` : ''}`,
  ).join('\n')

  const achievementsContent = JOURNEY_ACHIEVEMENTS.map(
    (a) => `- **${a.title}** (${a.date}): ${a.description}`,
  ).join('\n')

  const projectsContent = OPEN_SOURCE_PROJECTS.map(
    (p) =>
      `- **${p.name}**: ${p.description} — GitHub: ${p.githubOrgName}/${p.githubRepoName} — Tags: ${p.tags.map((t) => t.label).join(', ')}`,
  ).join('\n')

  const content = `# anm.dev — Full Site Content

> This is the complete content of anm.dev, the personal website and blog of Anmol Mahatpurkar.

## About

Anmol Mahatpurkar is a Staff Frontend Engineer based in Mumbai, India, with over 10 years of experience. He specializes in React, TypeScript, design systems, and frontend architecture at scale. He currently works at Airbase (acquired by Paylocity), where he mentors and leads initiatives to scale frontend architecture across the product.

When not working, Anmol enjoys playing Age of Empires 2, chess, and thinking about the mysteries of the human mind.

## Professional Journey

${journeyContent}

## Achievements

${achievementsContent}

## Open Source Projects

${projectsContent}

## Blog Posts

${blogContent || 'No blog posts published yet.'}

## Content API

- Search blog posts: GET https://anm.dev/api/search?q={query} → application/json
- Raw markdown for any post: GET https://anm.dev/api/blog/{slug}/raw → text/markdown
- RSS Feed: https://anm.dev/feed.xml
- JSON Feed: https://anm.dev/feed.json
- Sitemap: https://anm.dev/sitemap.xml
- LLM summary: https://anm.dev/llms.txt

## Contact & Social

- Website: https://anm.dev
- GitHub: https://github.com/anmdotdev
- X (Twitter): https://x.com/anmdotdev
- LinkedIn: https://linkedin.com/in/anmolmahatpurkar
- Email: hey@anm.dev
- Resume: https://anm.dev/resume-anmol-mahatpurkar.pdf
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
