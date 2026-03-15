import { getAllTags, getBlogPosts } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()
  const tags = getAllTags()

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
- RSS Feed: https://anm.dev/feed.xml
- JSON Feed: https://anm.dev/feed.json
- Sitemap: https://anm.dev/sitemap.xml

### Blog Content API
- Raw markdown: GET https://anm.dev/api/blog/{slug}/raw
  - Returns: text/markdown
  - Available slugs: ${posts.map((p) => p.slug).join(', ')}

### Available Topics
${tags.map((tag) => `- ${tag}: https://anm.dev/blog/tag/${encodeURIComponent(tag.toLowerCase())}`).join('\n')}

## Structured Data
All pages include Schema.org JSON-LD structured data.

## Contact
- Author: Anmol Mahatpurkar
- Email: hey@anm.dev
- Website: https://anm.dev
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
