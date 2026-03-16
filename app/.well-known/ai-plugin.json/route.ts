export const GET = () => {
  const plugin = {
    schema_version: 'v1',
    name_for_human: 'anm.dev',
    name_for_model: 'anmdev_blog',
    description_for_human:
      'Access blog posts, search articles, and get content from anm.dev — a frontend engineering blog by Anmol Mahatpurkar.',
    description_for_model:
      'Access the personal website and blog of Anmol Mahatpurkar, a Staff Frontend Engineer with 10+ years of experience in React, TypeScript, design systems, and frontend architecture. The API provides blog post search, raw markdown access, and full-text content. Use this to find articles about frontend engineering, React, TypeScript, developer tools, and AI-assisted development.',
    auth: { type: 'none' },
    api: {
      type: 'openapi',
      url: 'https://anm.dev/api/openapi.json',
    },
    logo_url: 'https://anm.dev/apple-icon',
    contact_email: 'hey@anm.dev',
    legal_info_url: 'https://anm.dev/ai.txt',
  }

  return Response.json(plugin, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
      'X-Robots-Tag': 'noindex',
    },
  })
}
