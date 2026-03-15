import { getBlogPosts } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()

  const blogList = posts
    .map(
      (post) =>
        `- [${post.title}](https://anm.dev/blog/${post.slug}): ${post.summary}\n  - [Raw Markdown](https://anm.dev/api/blog/${post.slug}/raw)`,
    )
    .join('\n')

  const content = `# anm.dev

> Personal website and blog by Anmol Mahatpurkar, a Staff Frontend Engineer with 10+ years of experience building design systems, web & mobile apps with React and TypeScript. Currently at Airbase (Paylocity).

> Optional: [Full site content](https://anm.dev/llms-full.txt)

## About

Anmol Mahatpurkar is a Staff Frontend Engineer based in Mumbai, India. He specializes in React, TypeScript, design systems, and frontend architecture. He has worked at companies including Airbase (Paylocity), Cogoport, and Emotix.

## Pages

- [Home](https://anm.dev/): Personal homepage with introduction and featured projects
- [Blog](https://anm.dev/blog): Technical articles on frontend engineering, TypeScript, React, and developer tools
- [Open Source](https://anm.dev/open-source): Open source projects including CogoToast, and more
- [Journey](https://anm.dev/journey): Professional career timeline from 2012 to present

## Blog Posts

${blogList || 'No blog posts published yet.'}

## Raw Content Access

- Raw markdown for any blog post: \`https://anm.dev/api/blog/{slug}/raw\`
- Full site content: https://anm.dev/llms-full.txt

## Feeds

- [RSS Feed](https://anm.dev/feed.xml): XML RSS 2.0 feed
- [JSON Feed](https://anm.dev/feed.json): JSON Feed 1.1

## Contact

- GitHub: https://github.com/anmdotdev
- X (Twitter): https://x.com/anmdotdev
- LinkedIn: https://linkedin.com/in/anmolmahatpurkar
- Email: hey@anm.dev
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
