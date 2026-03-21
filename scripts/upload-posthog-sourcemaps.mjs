import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

const outputDirectory = '.next/static'
const releaseVersion =
  process.env.POSTHOG_SERVICE_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA
const cliProjectId = process.env.POSTHOG_CLI_PROJECT_ID
const cliApiKey = process.env.POSTHOG_CLI_API_KEY

if (!(cliProjectId && cliApiKey)) {
  console.log('Skipping PostHog sourcemap upload: missing CLI credentials.')
  process.exit(0)
}

if (!releaseVersion) {
  console.log('Skipping PostHog sourcemap upload: missing release version.')
  process.exit(0)
}

if (!existsSync(outputDirectory)) {
  console.log('Skipping PostHog sourcemap upload: build output not found.')
  process.exit(0)
}

const result = spawnSync(
  'npx',
  [
    '@posthog/cli',
    'sourcemap',
    'process',
    '--directory',
    outputDirectory,
    '--public-path-prefix',
    '/_next/static/',
    '--release-name',
    'anm.dev',
    '--release-version',
    releaseVersion,
  ],
  {
    env: {
      ...process.env,
      POSTHOG_CLI_HOST:
        process.env.POSTHOG_CLI_HOST ??
        process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ??
        'https://us.posthog.com',
    },
    stdio: 'inherit',
  },
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
