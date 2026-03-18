import { confirmNewsletterSubscription } from 'lib/newsletter'
import { NextResponse } from 'next/server'

const createRedirectResponse = (request: Request, status: string) =>
  NextResponse.redirect(new URL(`/blog?newsletter=${status}#newsletter`, request.url))

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')?.trim()

  if (!token) {
    return createRedirectResponse(request, 'invalid-token')
  }

  try {
    const result = await confirmNewsletterSubscription(token)

    if (result.status === 'confirmed') {
      return createRedirectResponse(request, 'confirmed')
    }

    if (result.status === 'already-confirmed') {
      return createRedirectResponse(request, 'already-confirmed')
    }

    return createRedirectResponse(request, 'invalid-token')
  } catch {
    return createRedirectResponse(request, 'confirm-error')
  }
}
