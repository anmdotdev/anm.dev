# PostHog Analytics Plan

This app uses PostHog for:

- Product analytics
- Web analytics
- Session replay
- Error tracking
- Logs

Implementation notes:

- Client-side PostHog initialization lives in
  `components/analytics/posthog-bootstrap.tsx` and `lib/analytics/browser-init.ts`.
- The browser SDK uses the bundled `posthog-js/dist/module.full.no-external` build so replay,
  exceptions, and analytics do not depend on remote script injection. Replay support also imports
  `posthog-js/dist/posthog-recorder` in `lib/analytics/posthog-browser.ts` so the recorder
  registers locally instead of relying on a remote lazy-load.
- Browser ingestion goes through the local `/ingest` reverse proxy path configured in
  `next.config.ts`.
- Analytics, replay, and exception capture initialize immediately when the browser PostHog key and
  host are configured.
- Server-side exception capture lives in `instrumentation.ts` via Next.js `onRequestError`.
- Server-side conversion events use `posthog-node` and the forwarded `x-posthog-distinct-id` and
  `x-posthog-session-id` headers so newsletter and comment events stay attached to the same web
  session.
- Server-side logs use OpenTelemetry OTLP over HTTP and ship to PostHog from
  `lib/analytics/logs.ts`.
- Newsletter subscribers are identified with internal subscriber IDs, not raw email addresses.

## Autocapture Baseline

PostHog autocapture is the default layer for:

- `$pageview`
- `$pageleave`
- `$autocapture`
- `$rageclick`
- `$dead_click`

Important elements are annotated with `data-ph-capture-attribute-*` properties so `$autocapture`
events can be segmented by page, source, and CTA intent without adding extra client code.

## Custom Events

The custom event layer is reserved for interactions where semantic meaning matters and autocapture
is not enough.

### Global

- `theme_toggled`
  - `from_theme`
  - `to_theme`

### Blog

- `blog_article_viewed`
  - `post_slug`
  - `referrer_domain`
  - `referrer_type`
- `blog_scroll_depth_reached`
  - `post_slug`
  - `scroll_depth_percent`
  - `reading_time`
  - `word_count`
- `blog_engaged_time_reached`
  - `post_slug`
  - `engaged_seconds`
- `blog_article_completed`
  - `post_slug`
  - `engaged_seconds`
  - `scroll_depth_percent`
- `blog_share_requested`
  - `post_slug`
  - `share_method`
- `blog_share_completed`
  - `post_slug`
  - `share_method`
  - `share_outcome`
- `blog_copy_action`
  - `post_slug`
  - `copy_action`
  - `copy_format`
- `blog_ai_assist_clicked`
  - `post_slug`
  - `assistant_name`
- `blog_toc_toggled`
  - `post_slug`
  - `toc_variant`
  - `is_open`
- `blog_toc_heading_selected`
  - `post_slug`
  - `heading_id`
  - `heading_text`
  - `toc_variant`
- `blog_reaction_clicked`
  - `post_slug`
  - `reaction_type`
  - `reaction_state`
- `blog_comment_submitted`
  - `post_slug`
  - `is_reply`
  - `has_email`
- `blog_comment_submission_failed`
  - `post_slug`
  - `is_reply`
- `blog_comment_deleted`
  - `post_slug`

### Newsletter

- `newsletter_cta_viewed`
  - `cta_source`
  - `cta_title`
  - `is_enabled`
- `newsletter_signup_submitted`
  - `signup_source`
- `newsletter_signup_succeeded`
  - `signup_source`
- `newsletter_signup_failed`
  - `signup_source`
  - `error_message`
- `newsletter_signup_confirmed`
  - `signup_source`
  - `confirmation_status`
- `blog_newsletter_status_viewed`
  - `status`

### Search

- `site_search_performed`
  - `query_length`
  - `query_term_count`
  - `results_count`
  - `has_results`
  - `search_surface`

## Backend Logs Coverage

The backend logs layer is for system outcomes, not user behavior. Product events still answer
"what the user did." Logs answer "what the system did."

These routes emit structured OTEL logs into PostHog:

- `POST /api/newsletter/subscribe`
- `GET /newsletter/confirm`
- `POST /api/internal/newsletter/publish`
- `GET /api/cron/newsletter-publish`
- `POST /api/webhooks/resend`
- `GET /api/search`
- `POST /api/blog/[slug]/comments`
- `DELETE /api/blog/[slug]/comments`
- `POST /api/blog/[slug]/reactions` for validation failures and server errors

Each log line is a wide event with the request outcome and context such as:

- `http_route`
- `http_method`
- `http_status_code`
- `duration_ms`
- `outcome`
- `posthogDistinctId`
- `sessionId` when available
- Route-specific fields like `post_slug`, `signup_source`, `results_count`, or webhook/job context

## Page Coverage

### Home

- Header navigation and logo clicks are autocaptured with navigation metadata.
- Open source preview clicks are autocaptured with project metadata.
- Recent post clicks are autocaptured with post metadata.
- Home newsletter signup uses custom submit/success/failure events.

### Blog Index

- Post list clicks are autocaptured with post metadata.
- Newsletter confirmation states are captured with `blog_newsletter_status_viewed`.
- Newsletter signup uses custom submit/success/failure events.
- `/newsletter` redirects here, so pageview/referrer attribution for newsletter entry should be read
  from the destination blog page and redirect source.

### Blog Tag Pages

- Tagged post clicks are autocaptured with post metadata and current tag context.

### Blog Post Pages

- Reading depth and engaged time are tracked with custom events.
- Share, copy, AI handoff, comments, reactions, TOC usage, tag clicks, related post clicks, and
  next-in-series clicks are tracked.

### Journey

- External company links are autocaptured with journey metadata.

### Open Source

- Project card, demo, and GitHub clicks are autocaptured with project metadata.

### 404

- Recovery links are autocaptured with not-found metadata.

### Error Boundaries

- `app/error.tsx` and `app/global-error.tsx` manually send captured exceptions to PostHog.
- `instrumentation.ts` captures server-side request errors that never reach the client.

## PostHog Project Settings

After deploy, enable these in the PostHog UI:

1. Web analytics
2. Session replay
3. Error tracking exception autocapture
4. Console log recording for replay
5. Logs
6. Source map upload for production builds so minified stack traces resolve correctly

Recommended replay privacy settings:

- Keep input masking enabled.
- Use `data-ph-mask-text` for any user-visible text that can contain email addresses or other
  sensitive values.
- Do not enable request or response body recording unless you have reviewed every payload path.
- If you enable request/response bodies later, add masking rules for any sensitive endpoints first.

Recommended error tracking follow-up:

- Upload source maps in PostHog for production deployments. This repo now provides
  `scripts/upload-posthog-sourcemaps.mjs` and a `postbuild` hook for it.

Recommended transport setup:

- Keep the `/ingest` reverse proxy enabled in Next.js rewrites to improve resilience against
  tracking blockers.
- Keep CSP `connect-src` on `'self'` only for PostHog browser traffic.

## Deployment Configuration

Required environment variables for production:

- `NEXT_PUBLIC_POSTHOG_KEY`
  - Your PostHog project token beginning with `phc_`
  - Used by web analytics, product analytics, session replay, error tracking, and OTEL logs
- `NEXT_PUBLIC_POSTHOG_HOST`
  - `https://us.i.posthog.com` for US projects
  - `https://eu.i.posthog.com` for EU projects
- `NEXT_PUBLIC_POSTHOG_PROXY_PATH`
  - Local reverse proxy path for browser ingestion
  - Recommended value: `/ingest`
- `NEXT_PUBLIC_POSTHOG_UI_HOST`
  - `https://us.posthog.com` for US projects
  - `https://eu.posthog.com` for EU projects

Recommended server-side environment variables:

- `POSTHOG_SERVICE_NAME`
  - Recommended value: `anm.dev`
- `POSTHOG_LOGS_URL`
  - Optional explicit OTLP logs endpoint
  - Use this if you want to override the derived `https://.../i/v1/logs` URL
- `POSTHOG_LOGS_TOKEN`
  - Optional explicit PostHog project token for OTEL logs
  - Falls back to `NEXT_PUBLIC_POSTHOG_KEY` when omitted
- `POSTHOG_CLI_HOST`
  - Recommended value: `https://us.posthog.com` or `https://eu.posthog.com`
- `POSTHOG_CLI_API_KEY`
  - Personal API key with `error_tracking:write`
- `POSTHOG_CLI_PROJECT_ID`
  - PostHog project ID used for sourcemap upload
  - Sets the OpenTelemetry `service.name` resource attribute for logs
- `POSTHOG_DEPLOYMENT_ENVIRONMENT`
  - Recommended value on production: `production`
  - Sets the OpenTelemetry `deployment.environment` resource attribute

Optional server-side environment variables:

- `POSTHOG_SERVICE_VERSION`
  - Set this to your release identifier if your platform does not already expose one
  - On Vercel, `VERCEL_GIT_COMMIT_SHA` is already available and is used automatically

No separate logs token is required. PostHog Logs uses the same project token as the web and server
SDKs.
