import { subscribeToNewsletter } from 'lib/newsletter'
import type { NextRequest } from 'next/server'

interface SubscribeRequestBody {
  company?: string
  email?: string
  source?: string
}

const getRequestIpAddress = (request: NextRequest): string | null => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null
  }

  return request.headers.get('x-real-ip')
}

export const POST = async (request: NextRequest) => {
  const body = (await request.json().catch(() => null)) as SubscribeRequestBody | null

  if (!body) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (body.company?.trim()) {
    return Response.json(
      {
        message: 'If this email can receive updates, a confirmation link is on its way.',
      },
      { status: 200 },
    )
  }

  if (!body.email?.trim()) {
    return Response.json({ error: 'Email is required.' }, { status: 400 })
  }

  try {
    const result = await subscribeToNewsletter({
      email: body.email,
      ipAddress: getRequestIpAddress(request),
      source: body.source?.trim() || 'website',
    })

    return Response.json(result, { status: 200 })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to subscribe right now.',
      },
      { status: 400 },
    )
  }
}
