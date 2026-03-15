import { getAllTags, getBlogPosts } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()
  const tags = getAllTags()

  const blogList = posts
    .map(
      (post) =>
        `- [${post.title}](https://anm.dev/blog/${post.slug}): ${post.summary}\n  - Tags: ${post.tags.join(', ')}\n  - [Raw Markdown](https://anm.dev/api/blog/${post.slug}/raw)`,
    )
    .join('\n')

  const tagList = tags
    .map((tag) => `- [${tag}](https://anm.dev/blog/tag/${encodeURIComponent(tag.toLowerCase())})`)
    .join('\n')

  const lastUpdated = posts.length > 0 ? posts[0].date : new Date().toISOString().split('T')[0]

  const content = `# anm.dev

> Last updated: ${lastUpdated}

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

## Topics

${tagList || 'No tags yet.'}

## Content API

Access blog content in machine-readable formats:

- Raw markdown for any blog post: \`GET https://anm.dev/api/blog/{slug}/raw\` → \`text/markdown\`
- Full site content: \`GET https://anm.dev/llms-full.txt\` → \`text/plain\`
- Each blog post page includes \`<link rel="alternate" type="text/markdown">\` pointing to its raw markdown

## Structured Data

Every page includes JSON-LD structured data (Schema.org):
- Person, WebSite schemas on all pages
- BlogPosting schema on individual blog posts
- BreadcrumbList on all pages
- CollectionPage on tag and project pages

## Feeds

- [RSS Feed](https://anm.dev/feed.xml): XML RSS 2.0 feed with full content
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
