import { getCronAuthorizationHeader, runNewsletterPublishJob } from 'lib/newsletter'
import type { NextRequest } from 'next/server'

export const maxDuration = 60

export const GET = async (request: NextRequest) => {
  try {
    if (request.headers.get('authorization') !== getCronAuthorizationHeader()) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await runNewsletterPublishJob()
    return Response.json(result, { status: 200 })
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to run newsletter cron.',
      },
      { status: 500 },
    )
  }
}
