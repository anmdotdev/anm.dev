import { emitBackendLog, flushPostHogLogs } from 'lib/analytics/logs'
import { getCronAuthorizationHeader, runNewsletterPublishJob } from 'lib/newsletter'
import type { NextRequest } from 'next/server'
import { after } from 'next/server'

export const maxDuration = 60

export const GET = async (request: NextRequest) => {
  const startedAt = Date.now()

  after(async () => {
    await flushPostHogLogs()
  })

  try {
    if (request.headers.get('authorization') !== getCronAuthorizationHeader()) {
      emitBackendLog({
        attributes: {
          duration_ms: Date.now() - startedAt,
          http_method: request.method,
          http_route: request.nextUrl.pathname,
          http_status_code: 401,
          outcome: 'unauthorized',
        },
        body: 'Newsletter cron request was rejected as unauthorized',
        eventName: 'newsletter.publish.cron.request.completed',
        level: 'WARN',
      })
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      },
      body: 'Newsletter cron request completed successfully',
      eventName: 'newsletter.publish.cron.request.completed',
    })
    return Response.json(result, { status: 200 })
  } catch (error) {
    emitBackendLog({
      attributes: {
        duration_ms: Date.now() - startedAt,
        error_message: error instanceof Error ? error.message : 'cron_failed',
        http_method: request.method,
        http_route: request.nextUrl.pathname,
        http_status_code: 500,
        outcome: 'error',
      },
      body: 'Newsletter cron request failed',
      eventName: 'newsletter.publish.cron.request.completed',
      level: 'ERROR',
    })
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unable to run newsletter cron.',
      },
      { status: 500 },
    )
  }
}
