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
