import {
  getNewsletterAdminAuthorizationHeader,
  queueNewsletterCampaignForPost,
  runNewsletterPublishJob,
} from 'lib/newsletter'
import type { NextRequest } from 'next/server'

interface PublishRequestBody {
  slug?: string
}

export const POST = async (request: NextRequest) => {
  try {
    if (request.headers.get('authorization') !== getNewsletterAdminAuthorizationHeader()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => null)) as PublishRequestBody | null
    const slug = body?.slug?.trim()

    const queuedCampaign = slug ? await queueNewsletterCampaignForPost(slug) : false
    const result = await runNewsletterPublishJob()

    return Response.json(
      {
        queuedCampaign,
        ...result,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to trigger newsletter publish.',
      },
      { status: 500 },
    )
  }
}
