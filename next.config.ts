import type { NextConfig } from 'next'

const DEFAULT_POSTHOG_PROXY_PATH = '/ingest'
const TRAILING_SLASH_REGEX = /\/+$/

const normalizeHost = (value?: string): string | null => {
  const trimmed = value?.trim()
  return trimmed ? trimmed.replace(TRAILING_SLASH_REGEX, '') : null
}

const posthogHost = normalizeHost(process.env.NEXT_PUBLIC_POSTHOG_HOST)
const posthogProxyPath =
  process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH?.trim() || DEFAULT_POSTHOG_PROXY_PATH

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
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.github.com",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  trailingSlash: false,
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  rewrites: async () =>
    posthogHost
      ? [
          {
            source: `${posthogProxyPath}/:path*`,
            destination: `${posthogHost}/:path*`,
          },
        ]
      : [],
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
