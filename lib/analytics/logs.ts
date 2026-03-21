import { logs, SeverityNumber } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'

type LogAttributePrimitive = boolean | number | string
type LogAttributeValue = LogAttributePrimitive | LogAttributePrimitive[] | null | undefined

type LogAttributes = Record<string, LogAttributeValue>

type BackendLogLevel = 'DEBUG' | 'ERROR' | 'INFO' | 'WARN'

const LOGS_EXPORT_DELAY_MS = 1000
const POSTHOG_SERVICE_NAME = process.env.POSTHOG_SERVICE_NAME ?? 'anm.dev'
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
const posthogLogsUrl = posthogHost ? new URL('/i/v1/logs', posthogHost).toString() : null

let loggerProvider: LoggerProvider | null = null
let logsInitialized = false

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

export const initializePostHogLogs = (): void => {
  if (logsInitialized || !(posthogKey && posthogLogsUrl)) {
    return
  }

  loggerProvider = new LoggerProvider({
    processors: [
      new BatchLogRecordProcessor(
        new OTLPLogExporter({
          headers: {
            Authorization: `Bearer ${posthogKey}`,
            'Content-Type': 'application/json',
          },
          url: posthogLogsUrl,
        }),
        {
          scheduledDelayMillis: LOGS_EXPORT_DELAY_MS,
        },
      ),
    ],
    resource: resourceFromAttributes({
      'deployment.environment': getDeploymentEnvironment(),
      'service.name': POSTHOG_SERVICE_NAME,
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

  return logs.getLogger('anm.dev.backend')
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

  await loggerProvider.forceFlush()
}
