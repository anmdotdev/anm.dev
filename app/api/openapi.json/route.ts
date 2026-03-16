import { getAllTags, getBlogPosts } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()
  const tags = getAllTags()

  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'anm.dev Content API',
      description:
        'API for accessing blog content, search, and raw markdown from anm.dev — the personal website and blog of Anmol Mahatpurkar, a Staff Frontend Engineer.',
      version: '1.0.0',
      contact: {
        name: 'Anmol Mahatpurkar',
        url: 'https://anm.dev',
        email: 'hey@anm.dev',
      },
      license: {
        name: 'CC BY 4.0',
        url: 'https://creativecommons.org/licenses/by/4.0/',
      },
    },
    servers: [{ url: 'https://anm.dev', description: 'Production' }],
    paths: {
      '/api/search': {
        get: {
          operationId: 'searchBlogPosts',
          summary: 'Search blog posts',
          description:
            'Full-text search across blog post titles, tags, summaries, and content. Results are ranked by relevance score.',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: true,
              description: 'Search query string',
              schema: { type: 'string', minLength: 1 },
              example: 'react',
            },
          ],
          responses: {
            '200': {
              description: 'Search results',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      query: { type: 'string' },
                      count: { type: 'integer' },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            title: { type: 'string' },
                            slug: { type: 'string' },
                            url: { type: 'string', format: 'uri' },
                            summary: { type: 'string' },
                            date: { type: 'string', format: 'date' },
                            readingTime: { type: 'string' },
                            tags: { type: 'array', items: { type: 'string' } },
                            markdownUrl: { type: 'string', format: 'uri' },
                            score: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': { description: 'Missing query parameter' },
          },
        },
      },
      '/api/blog/{slug}/raw': {
        get: {
          operationId: 'getBlogPostMarkdown',
          summary: 'Get blog post as raw Markdown',
          description:
            'Returns a blog post in Markdown format with metadata header including title, author, date, reading time, and tags.',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              description: 'Blog post URL slug',
              schema: {
                type: 'string',
                enum: posts.map((p) => p.slug),
              },
            },
          ],
          responses: {
            '200': {
              description: 'Markdown content',
              content: {
                'text/markdown': {
                  schema: { type: 'string' },
                },
              },
            },
            '404': { description: 'Post not found' },
          },
        },
      },
      '/feed.xml': {
        get: {
          operationId: 'getRssFeed',
          summary: 'RSS 2.0 feed',
          description: 'Full-content RSS 2.0 feed of all blog posts.',
          responses: {
            '200': {
              description: 'RSS XML feed',
              content: {
                'application/rss+xml': {
                  schema: { type: 'string' },
                },
              },
            },
          },
        },
      },
      '/feed.json': {
        get: {
          operationId: 'getJsonFeed',
          summary: 'JSON Feed 1.1',
          description: 'JSON Feed 1.1 format with full post content and markdown attachments.',
          responses: {
            '200': {
              description: 'JSON Feed',
              content: {
                'application/feed+json': {
                  schema: { type: 'object' },
                },
              },
            },
          },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsSummary',
          summary: 'LLM-friendly site summary',
          description: 'Plain text summary of site content optimized for large language models.',
          responses: {
            '200': {
              description: 'Plain text summary',
              content: { 'text/plain': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/llms-full.txt': {
        get: {
          operationId: 'getLlmsFullContent',
          summary: 'Full site content for LLMs',
          description:
            'Complete site content in plain text including all blog posts, professional journey, and project descriptions.',
          responses: {
            '200': {
              description: 'Full plain text content',
              content: { 'text/plain': { schema: { type: 'string' } } },
            },
          },
        },
      },
    },
    'x-metadata': {
      availableTags: tags,
      totalPosts: posts.length,
      author: 'Anmol Mahatpurkar',
      authorUrl: 'https://anm.dev',
    },
  }

  return Response.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'noindex',
    },
  })
}
