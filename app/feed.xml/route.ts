import { getBlogPosts } from 'lib/blog'

export const GET = () => {
  const posts = getBlogPosts()
  const lastBuildDate =
    posts.length > 0 ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://anm.dev/blog/${post.slug}</link>
      <guid isPermaLink="true">https://anm.dev/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <dc:creator>Anmol Mahatpurkar</dc:creator>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Anmol Mahatpurkar - Blog</title>
    <link>https://anm.dev/blog</link>
    <description>Thoughts on frontend engineering, TypeScript, React, developer tools, and building for the web.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>https://anm.dev/opengraph-image</url>
      <title>Anmol Mahatpurkar - Blog</title>
      <link>https://anm.dev/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    <atom:link href="https://anm.dev/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
