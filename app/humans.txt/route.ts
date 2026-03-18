export const GET = () => {
  const content = `/* TEAM */
Name: Anmol Mahatpurkar
Role: Software Engineer building AI products at a stealth startup
Site: https://anm.dev
Location: Mumbai, India
GitHub: https://github.com/anmdotdev
X: https://x.com/anmdotdev
LinkedIn: https://linkedin.com/in/anmolmahatpurkar

/* SITE */
Standards: HTML5, CSS3, ES2020+
Components: React 19, Next.js 16, TypeScript 5
Styling: Tailwind CSS 4
Content: MDX
Hosting: Vercel
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
