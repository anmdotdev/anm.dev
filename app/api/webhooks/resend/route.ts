import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import { handleResendWebhook, verifyResendWebhook } from 'lib/newsletter'
import { after } from 'next/server'

export const POST = async (request: Request) => {
  const startedAt = Date.now()
  const body = await request.text()
  const svixId = request.headers.get('svix-id')

  after(async () => {
    await flushPostHogLogs()
  })

  try {
    const payload = verifyResendWebhook(body, {
      id: svixId,
      timestamp: request.headers.get('svix-timestamp'),
      signature: request.headers.get('svix-signature'),
    })

    await handleResendWebhook(payload, svixId ?? undefined)

    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        email_provider: 'resend',
        http_method: 'POST',
        http_route: '/api/webhooks/resend',
        http_status_code: 200,
        outcome: 'success',
        webhook_event_type: payload.type,
        webhook_id: svixId,
      },
      body: 'Resend webhook request completed successfully',
      eventName: 'webhook.resend.request.completed',
    })

    return Response.json({ received: true }, { status: 200 })
  } catch (error) {
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        email_provider: 'resend',
        error_message: error instanceof Error ? error.message : 'webhook_verification_failed',
        http_method: 'POST',
        http_route: '/api/webhooks/resend',
        http_status_code: 400,
        outcome: 'error',
        webhook_id: svixId,
      },
      body: 'Resend webhook request failed',
      eventName: 'webhook.resend.request.completed',
      level: 'ERROR',
    })
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to verify webhook.',
      },
      { status: 400 },
    )
  }
}
