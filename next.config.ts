import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.github.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  trailingSlash: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  redirects: async () => [
    {
      source: '/about',
      destination: '/journey',
      permanent: true,
    },
    {
      source: '/projects',
      destination: '/open-source',
      permanent: true,
    },
    {
      source: '/resume',
      destination: '/resume-anmol-mahatpurkar.pdf',
      permanent: true,
    },
    {
      source: '/.well-known/llms.txt',
      destination: '/llms.txt',
      permanent: true,
    },
    {
      source: '/.well-known/ai.txt',
      destination: '/ai.txt',
      permanent: true,
    },
    {
      source: '/.well-known/security.txt',
      destination: '/security.txt',
      permanent: true,
    },
    {
      source: '/.well-known/humans.txt',
      destination: '/humans.txt',
      permanent: true,
    },
  ],
}

export default nextConfig
