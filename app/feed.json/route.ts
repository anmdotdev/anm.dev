import { getBlogPosts } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Anmol Mahatpurkar - Blog',
    home_page_url: 'https://anm.dev',
    feed_url: 'https://anm.dev/feed.json',
    description:
      'Thoughts on frontend engineering, TypeScript, React, developer tools, and building for the web.',
    icon: 'https://anm.dev/apple-icon',
    favicon: 'https://anm.dev/favicon.ico',
    language: 'en',
    authors: [
      {
        name: 'Anmol Mahatpurkar',
        url: 'https://anm.dev',
      },
    ],
    items: posts.map((post) => ({
      id: `https://anm.dev/blog/${post.slug}`,
      url: `https://anm.dev/blog/${post.slug}`,
      title: post.title,
      content_text: post.content,
      summary: post.summary,
      date_published: new Date(post.date).toISOString(),
      ...(post.lastModified ? { date_modified: new Date(post.lastModified).toISOString() } : {}),
      tags: post.tags,
      image: `https://anm.dev/blog/${post.slug}/opengraph-image`,
      authors: [
        {
          name: 'Anmol Mahatpurkar',
          url: 'https://anm.dev',
        },
      ],
      attachments: [
        {
          url: `https://anm.dev/api/blog/${post.slug}/raw`,
          mime_type: 'text/markdown',
          title: `${post.title} (Markdown)`,
        },
      ],
    })),
  }

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
