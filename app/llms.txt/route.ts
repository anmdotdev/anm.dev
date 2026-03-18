import { getAllTags, getBlogPosts, getTagPath } from 'lib/blog'
import { EXPERIENCE_YEARS_LABEL } from 'lib/profile'

export const GET = () => {
  const posts = getBlogPosts()
  const tags = getAllTags()

  const blogList = posts
    .map(
      (post) =>
        `- [${post.title}](https://anm.dev/blog/${post.slug}): ${post.summary}\n  - Tags: ${post.tags.join(', ')}\n  - [Raw Markdown](https://anm.dev/api/blog/${post.slug}/raw)`,
    )
    .join('\n')

  const tagList = tags.map((tag) => `- [${tag}](https://anm.dev${getTagPath(tag)})`).join('\n')

  const lastUpdated = posts.length > 0 ? posts[0].date : new Date().toISOString().split('T')[0]

  const content = `# anm.dev

> Last updated: ${lastUpdated}

> Personal website and blog by Anmol Mahatpurkar, a software engineer with ${EXPERIENCE_YEARS_LABEL} of experience building web products, design systems, and frontend architecture with React and TypeScript. Currently building AI products at a stealth startup.

> Optional: [Full site content](https://anm.dev/llms-full.txt)

## About

Anmol Mahatpurkar is a software engineer based in Mumbai, India. He specializes in React, TypeScript, design systems, frontend architecture, and AI-native product work. He is currently working on AI products at a stealth startup and has previously worked at Airbase, Cogoport, and Emotix.

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
- Search blog posts: \`GET https://anm.dev/api/search?q={query}\` → \`application/json\`
- Full site content: \`GET https://anm.dev/llms-full.txt\` → \`text/plain\`
- OpenAPI specification: \`GET https://anm.dev/api/openapi.json\` → \`application/json\`
- AI plugin manifest: \`GET https://anm.dev/.well-known/ai-plugin.json\` → \`application/json\`
- Each blog post page includes \`<link rel="alternate" type="text/markdown">\` pointing to its raw markdown
- Blog post pages support content negotiation: send \`Accept: text/markdown\` to receive markdown directly

### Search API

\`GET https://anm.dev/api/search?q={query}\`

Returns JSON with ranked results:
\`\`\`json
{
  "query": "react",
  "count": 2,
  "results": [
    {
      "title": "Post Title",
      "slug": "post-slug",
      "url": "https://anm.dev/blog/post-slug",
      "summary": "...",
      "date": "2026-01-01",
      "readingTime": "5 min read",
      "tags": ["React"],
      "markdownUrl": "https://anm.dev/api/blog/post-slug/raw",
      "score": 10
    }
  ]
}
\`\`\`


## Structured Data

Every page includes JSON-LD structured data (Schema.org):
- Person, WebSite schemas on all pages
- BlogPosting schema on individual blog posts
- BreadcrumbList on all pages
- CollectionPage on tag and project pages

## Feeds

- [RSS Feed](https://anm.dev/feed.xml): XML RSS 2.0 feed with full content
- [JSON Feed](https://anm.dev/feed.json): JSON Feed 1.1

## Publishing Notes

- Scheduled and draft content is intentionally omitted from these public AI endpoints until published.

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
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
