import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import {
  getNewsletterAdminAuthorizationHeader,
  queueNewsletterCampaignForPost,
  runNewsletterPublishJob,
} from 'lib/newsletter'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

interface PublishRequestBody {
  slug?: string
}

export const POST = async (request: NextRequest) => {
  const startedAt = Date.now()

  after(async () => {
    await flushPostHogLogs()
  })

  try {
    if (request.headers.get('authorization') !== getNewsletterAdminAuthorizationHeader()) {
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: request.method,
          http_route: request.nextUrl.pathname,
          http_status_code: 401,
          outcome: 'unauthorized',
        },
        body: 'Internal newsletter publish request was rejected as unauthorized',
        eventName: 'newsletter.publish.internal.request.completed',
        level: 'WARN',
      })
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json().catch(() => null)) as PublishRequestBody | null
    const slug = body?.slug?.trim()

    const queuedCampaign = slug ? await queueNewsletterCampaignForPost(slug) : false
    const result = await runNewsletterPublishJob()

    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 200,
        newsletter_campaigns_created: result.createdCampaigns,
        newsletter_campaigns_failed: result.failedCampaigns,
        newsletter_campaigns_sent: result.sentCampaigns,
        newsletter_posts_skipped: result.skippedPosts,
        newsletter_total_published_posts: result.totalPublishedPosts,
        outcome: 'success',
        queued_campaign: queuedCampaign,
        queued_slug: slug,
      },
      body: 'Internal newsletter publish request completed successfully',
      eventName: 'newsletter.publish.internal.request.completed',
    })

    return Response.json(
      {
        queuedCampaign,
        ...result,
      },
      { status: 200 },
    )
  } catch (error) {
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        error_message: error instanceof Error ? error.message : 'publish_failed',
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 500,
        outcome: 'error',
      },
      body: 'Internal newsletter publish request failed',
      eventName: 'newsletter.publish.internal.request.completed',
      level: 'ERROR',
    })
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to trigger newsletter publish.',
      },
      { status: 500 },
    )
  }
}
