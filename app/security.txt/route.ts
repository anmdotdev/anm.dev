export const GET = () => {
  const content = `# Security Policy — anm.dev

Contact: mailto:hey@anm.dev
Preferred-Languages: en
Canonical: https://anm.dev/.well-known/security.txt
Policy: https://anm.dev/ai.txt

# This is a personal blog and portfolio website.
# If you find a security issue, please report it via email.
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
