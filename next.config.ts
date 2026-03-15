import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
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
      source: '/.well-known/llms.txt',
      destination: '/llms.txt',
      permanent: true,
    },
    {
      source: '/.well-known/ai.txt',
      destination: '/ai.txt',
      permanent: true,
    },
  ],
}

export default nextConfig
