import { logs, SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributePrimitive = boolean | number | string
type LogAttributeValue = LogAttributePrimitive | LogAttributePrimitive[] | null | undefined

type LogAttributes = Record<string, LogAttributeValue>

type BackendLogLevel = 'DEBUG' | 'ERROR' | 'INFO' | 'WARN'

interface PostHogLogsConfig {
  serviceName: string
  token: string
  url: string
}

const LOGS_EXPORT_DELAY_MS = 1000
const DEFAULT_POSTHOG_SERVICE_NAME = 'anm.dev'
const POSTHOG_LOGGER_NAME = 'anm.dev.backend'

let loggerProvider: LoggerProvider | null = null
let logsInitialized = false
let didWarnAboutLogsConfig = false

const warnPostHogLogs = (message: string): void => {
  if (didWarnAboutLogsConfig) {
    return
  }

  didWarnAboutLogsConfig = true
  console.warn(`[posthog-logs] ${message}`)
}

const getSeverityNumber = (level: BackendLogLevel): SeverityNumber => {
  switch (level) {
    case 'DEBUG':
      return SeverityNumber.DEBUG
    case 'WARN':
      return SeverityNumber.WARN
    case 'ERROR':
      return SeverityNumber.ERROR
    default:
      return SeverityNumber.INFO
  }
}

const normalizeLogAttributes = (
  attributes?: LogAttributes,
): Record<string, LogAttributePrimitive | LogAttributePrimitive[]> => {
  if (!attributes) {
    return {}
  }

  const nextAttributes: Record<string, LogAttributePrimitive | LogAttributePrimitive[]> = {}

  for (const [key, value] of Object.entries(attributes)) {
    if (value == null) {
      continue
    }

    nextAttributes[key] = value
  }

  // Preserve the existing query surface while also emitting the canonical
  // PostHog/OTel-friendly attributes used for replay and user linking.
  const posthogDistinctId = nextAttributes.posthog_distinct_id
  if (typeof posthogDistinctId === 'string' && !('posthogDistinctId' in nextAttributes)) {
    nextAttributes.posthogDistinctId = posthogDistinctId
  }

  const posthogSessionId = nextAttributes.posthog_session_id
  if (typeof posthogSessionId === 'string' && !('sessionId' in nextAttributes)) {
    nextAttributes.sessionId = posthogSessionId
  }

  const httpMethod = nextAttributes.http_method
  if (typeof httpMethod === 'string' && !('http.request.method' in nextAttributes)) {
    nextAttributes['http.request.method'] = httpMethod
  }

  const httpStatusCode = nextAttributes.http_status_code
  if (typeof httpStatusCode === 'number' && !('http.response.status_code' in nextAttributes)) {
    nextAttributes['http.response.status_code'] = httpStatusCode
  }

  const httpRoute = nextAttributes.http_route
  if (typeof httpRoute === 'string' && !('url.path' in nextAttributes)) {
    nextAttributes['url.path'] = httpRoute
  }

  return nextAttributes
}

const getServiceVersion = (): string | undefined => {
  const serviceVersion =
    process.env.POSTHOG_SERVICE_VERSION ??
    process.env.VERCEL_GIT_COMMIT_SHA ??
    process.env.GITHUB_SHA

  return serviceVersion?.trim() || undefined
}

const getDeploymentEnvironment = (): string =>
  process.env.POSTHOG_DEPLOYMENT_ENVIRONMENT ??
  process.env.VERCEL_ENV ??
  process.env.NODE_ENV ??
  'unknown'

const getPostHogLogsUrl = (token: string): string | null => {
  const explicitLogsUrl = process.env.POSTHOG_LOGS_URL?.trim()
  if (explicitLogsUrl) {
    return explicitLogsUrl
  }

  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim()
  if (!posthogHost) {
    return null
  }

  try {
    const url = new URL('/i/v1/logs', posthogHost)
    url.searchParams.set('token', token)
    return url.toString()
  } catch {
    warnPostHogLogs(
      'Invalid PostHog host. Set NEXT_PUBLIC_POSTHOG_HOST to the ingest host ' +
        '(for example https://us.i.posthog.com) or set POSTHOG_LOGS_URL ' +
        'directly.',
    )
    return null
  }
}

const getPostHogLogsConfig = (): PostHogLogsConfig | null => {
  const token =
    process.env.POSTHOG_LOGS_TOKEN?.trim() ?? process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? null

  if (!token) {
    warnPostHogLogs(
      'PostHog OTEL log export is disabled because the token is missing. ' +
        'Set NEXT_PUBLIC_POSTHOG_KEY or POSTHOG_LOGS_TOKEN.',
    )
    return null
  }

  const url = getPostHogLogsUrl(token)

  if (!url) {
    warnPostHogLogs(
      'PostHog OTEL log export is disabled because the endpoint is missing. ' +
        'Set NEXT_PUBLIC_POSTHOG_HOST or POSTHOG_LOGS_URL.',
    )
    return null
  }

  return {
    serviceName: process.env.POSTHOG_SERVICE_NAME?.trim() || DEFAULT_POSTHOG_SERVICE_NAME,
    token,
    url,
  }
}

export const initializePostHogLogs = (): void => {
  if (logsInitialized) {
    return
  }

  const config = getPostHogLogsConfig()
  if (!config) {
    return
  }

  console.info(`[posthog-logs] Initializing OTLP log export to ${config.url}`)

  loggerProvider = new LoggerProvider({
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          headers: {
            Authorization: `Bearer ${config.token}`,
            'Content-Type': 'application/json',
          },
          url: config.url,
        }),
        {
          scheduledDelayMillis: LOGS_EXPORT_DELAY_MS,
        },
      ),
    ],
    resource: resourceFromAttributes({
      'deployment.environment': getDeploymentEnvironment(),
      'service.name': config.serviceName,
      ...(getServiceVersion() ? { 'service.version': getServiceVersion() } : {}),
    }),
  })

  logs.setGlobalLoggerProvider(loggerProvider)
  logsInitialized = true
}

const getBackendLogger = () => {
  initializePostHogLogs()

  if (!loggerProvider) {
    return null
  }

  return loggerProvider.getLogger(POSTHOG_LOGGER_NAME)
}

export const emitBackendLog = (input: {
  attributes?: LogAttributes
  body: string
  eventName: string
  level?: BackendLogLevel
}): void => {
  const logger = getBackendLogger()
  if (!logger) {
    return
  }

  const level = input.level ?? 'INFO'

  logger.emit({
    attributes: normalizeLogAttributes({
      event: input.eventName,
      ...input.attributes,
    }),
    body: input.body,
    eventName: input.eventName,
    severityNumber: getSeverityNumber(level),
    severityText: level,
  })
}

export const flushPostHogLogs = async (): Promise<void> => {
  if (!loggerProvider) {
    return
  }

  try {
    await loggerProvider.forceFlush()
  } catch (error) {
    console.error('[posthog-logs] Failed to flush logs to PostHog.', error)
  }
}
