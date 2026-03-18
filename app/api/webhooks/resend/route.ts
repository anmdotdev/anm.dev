import { handleResendWebhook, verifyResendWebhook } from 'lib/newsletter'

export const POST = async (request: Request) => {
  const body = await request.text()

  try {
    const payload = verifyResendWebhook(body, {
      id: request.headers.get('svix-id'),
      timestamp: request.headers.get('svix-timestamp'),
      signature: request.headers.get('svix-signature'),
    })

    await handleResendWebhook(payload, request.headers.get('svix-id') ?? undefined)

    return Response.json({ received: true }, { status: 200 })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to verify webhook.',
      },
      { status: 400 },
    )
  }
}
