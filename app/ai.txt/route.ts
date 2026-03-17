import { getAllTags, getBlogPosts, getTagPath } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()
  const tags = getAllTags()
  const availableSlugs =
    posts.length > 0 ? posts.map((post) => post.slug).join(', ') : 'none currently published'
  const availableTopics =
    tags.length > 0
      ? tags.map((tag) => `- ${tag}: https://anm.dev${getTagPath(tag)}`).join('\n')
      : '- none currently published'

  const content = `# AI Content Access Policy — anm.dev

## Purpose
This file describes how AI systems can access and use content from anm.dev.

## Permissions
- AI crawlers are welcome to index all public content
- Content may be used for training, summarization, and retrieval
- Attribution to "Anmol Mahatpurkar" and "anm.dev" is appreciated

## Content Endpoints

### Human-Readable
- Homepage: https://anm.dev
- Blog: https://anm.dev/blog
- Open Source: https://anm.dev/open-source
- Journey: https://anm.dev/journey

### Machine-Readable
- LLM summary: https://anm.dev/llms.txt
- Full site content: https://anm.dev/llms-full.txt
- OpenAPI spec: https://anm.dev/api/openapi.json
- AI plugin manifest: https://anm.dev/.well-known/ai-plugin.json
- RSS Feed: https://anm.dev/feed.xml
- JSON Feed: https://anm.dev/feed.json
- Sitemap: https://anm.dev/sitemap.xml

### Blog Content API
- Raw markdown: GET https://anm.dev/api/blog/{slug}/raw
  - Returns: text/markdown
  - Available slugs: ${availableSlugs}
- Search: GET https://anm.dev/api/search?q={query}
  - Returns: application/json with ranked results
  - Searches: titles, summaries, tags, and content

### Available Topics
${availableTopics}

## Content Negotiation

Blog post pages support content negotiation via the Accept header:
- \`Accept: text/html\` → HTML page (default)
- \`Accept: text/markdown\` → Raw markdown content
- \`Accept: text/plain\` → Raw markdown content

## Structured Data
All pages include Schema.org JSON-LD structured data.

## Publishing Notes
- Scheduled and draft content is intentionally omitted from these public AI endpoints until published.

## Contact
- Author: Anmol Mahatpurkar
- Email: hey@anm.dev
- Website: https://anm.dev
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
