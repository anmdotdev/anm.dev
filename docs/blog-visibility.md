
## Visibility and Deployment Behavior

### Local Development

- `bun run dev` behaves like an authoring environment.
- Scheduled posts are visible on listing pages such as `/` and `/blog`.
- Scheduled posts are also directly viewable by URL.

### Vercel Preview Deployments

- Preview deployments send `X-Robots-Tag: noindex, nofollow` as an extra safety layer.
- Scheduled posts are **not** listed on `/`, `/blog`, tag pages, feeds, sitemap, search, `llms.txt`, `llms-full.txt`, or `ai.txt`.
- If `ENABLE_SCHEDULED_CONTENT_PREVIEW=true`, scheduled posts can still be previewed by direct URL.

### Production Deployments

- Scheduled posts stay hidden from all public discovery surfaces until their publish date.
- Once their publish date is reached, they can appear automatically through ISR/revalidation without a redeploy.

## Relevant Environment Variables

- `ENABLE_SCHEDULED_CONTENT_PREVIEW=true`
  Enables direct scheduled-post preview outside local development. This is intended for controlled preview/testing workflows, not public discovery.
- `VERCEL_ENV=preview`
  On Vercel preview deployments, the app adds `X-Robots-Tag: noindex, nofollow` responses across the site.
