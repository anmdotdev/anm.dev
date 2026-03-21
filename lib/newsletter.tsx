import 'server-only'

import crypto from 'node:crypto'
import { render, toPlainText } from '@react-email/render'
import NewsletterConfirmationEmail from 'emails/newsletter-confirmation'
import NewsletterPostPublishedEmail from 'emails/newsletter-post-published'
import NewsletterWelcomeEmail from 'emails/newsletter-welcome'
import { getNewsletterSubscriberAnalyticsId } from 'lib/analytics/constants'
import { getBlogPost, getBlogPosts } from 'lib/blog'
import { type BlogEmailTextBlock, getRequiredBlogEmailDistribution } from 'lib/blog-distribution'
import { ensureDb } from 'lib/db'
import { getAbsoluteUrl, NEWSLETTER_FROM_NAME } from 'lib/site'
import { Resend, type WebhookEventPayload } from 'resend'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_PREVIEW_LENGTH = 140
const MAX_SIGNUP_ATTEMPTS_PER_HOUR = 5
const RATE_LIMIT_WINDOW = '-1 hour'
const CONFIRM_TOKEN_TTL_HOURS = 24 * 7
const ALREADY_IN_SEGMENT_REGEX = /already.*segment/i
const SITE_TIME_ZONE = 'Asia/Kolkata'

type NewsletterSubscriberStatus = 'active' | 'bounced' | 'complained' | 'pending' | 'unsubscribed'
type NewsletterTokenType = 'confirm' | 'manage' | 'unsubscribe'
type NewsletterCampaignKind = 'post_published'
type NewsletterCampaignStatus = 'failed' | 'pending' | 'sending' | 'sent'

interface NewsletterSubscriberRow {
  confirmed_at: string | null
  created_at: string
  email: string
  email_normalized: string
  id: number
  resend_contact_id: string | null
  source: string
  status: NewsletterSubscriberStatus
  suppression_reason: string | null
  unsubscribed_at: string | null
  updated_at: string
}

interface NewsletterTokenLookupRow {
  subscriber_confirmed_at: string | null
  subscriber_created_at: string
  subscriber_email: string
  subscriber_email_normalized: string
  subscriber_id: number
  subscriber_resend_contact_id: string | null
  subscriber_source: string
  subscriber_status: NewsletterSubscriberStatus
  subscriber_suppression_reason: string | null
  subscriber_unsubscribed_at: string | null
  subscriber_updated_at: string
  token_expires_at: string
  token_hash: string
  token_id: number
  token_type: NewsletterTokenType
  token_used_at: string | null
}

interface NewsletterCampaignRow {
  created_at: string
  failure_reason: string | null
  id: number
  kind: NewsletterCampaignKind
  post_date: string
  post_slug: string
  post_title: string
  preview_text: string
  resend_broadcast_id: string | null
  sent_at: string | null
  status: NewsletterCampaignStatus
  subject: string
  updated_at: string
}

interface NewsletterSubscriber {
  confirmedAt: string | null
  createdAt: string
  email: string
  emailNormalized: string
  id: number
  resendContactId: string | null
  source: string
  status: NewsletterSubscriberStatus
  suppressionReason: string | null
  unsubscribedAt: string | null
  updatedAt: string
}

interface NewsletterTokenRecord {
  expiresAt: string
  hash: string
  id: number
  subscriber: NewsletterSubscriber
  type: NewsletterTokenType
  usedAt: string | null
}

interface NewsletterCampaign {
  createdAt: string
  failureReason: string | null
  id: number
  kind: NewsletterCampaignKind
  postDate: string
  postSlug: string
  postTitle: string
  previewText: string
  resendBroadcastId: string | null
  sentAt: string | null
  status: NewsletterCampaignStatus
  subject: string
  updatedAt: string
}

interface SubscribeToNewsletterOptions {
  email: string
  ipAddress?: string | null
  source?: string
}

interface SubscribeToNewsletterResult {
  message: string
  subscriberAnalyticsId?: string
}

interface ConfirmNewsletterResult {
  source?: string
  status: 'already-confirmed' | 'confirmed' | 'invalid'
  subscriberAnalyticsId?: string
}

interface NewsletterSendConfig {
  adminSecret?: string
  apiKey: string
  cronSecret?: string
  fromEmail: string
  fromName: string
  replyToEmail: string
  segmentId: string
  webhookSecret?: string
}

interface NewsletterPostContent {
  body: BlogEmailTextBlock[]
  preview: string
  subject: string
  summary: string
}

export interface NewsletterPublishJobResult {
  createdCampaigns: number
  failedCampaigns: number
  sentCampaigns: number
  skippedPosts: number
  totalPublishedPosts: number
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase()

const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email)

const hashValue = (value: string): string => crypto.createHash('sha256').update(value).digest('hex')

const toSubscriberAnalyticsId = (subscriberId: number): string =>
  getNewsletterSubscriberAnalyticsId(subscriberId)

const generateToken = (): string => crypto.randomBytes(24).toString('base64url')

const truncate = (value: string, length: number): string => {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= length) {
    return normalized
  }

  return `${normalized.slice(0, Math.max(length - 1, 1)).trimEnd()}…`
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown newsletter error.'

const rowToSubscriber = (row: NewsletterSubscriberRow): NewsletterSubscriber => ({
  id: row.id,
  email: row.email,
  emailNormalized: row.email_normalized,
  source: row.source,
  status: row.status,
  resendContactId: row.resend_contact_id,
  confirmedAt: row.confirmed_at,
  unsubscribedAt: row.unsubscribed_at,
  suppressionReason: row.suppression_reason,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const rowToCampaign = (row: NewsletterCampaignRow): NewsletterCampaign => ({
  id: row.id,
  kind: row.kind,
  postSlug: row.post_slug,
  postTitle: row.post_title,
  postDate: row.post_date,
  subject: row.subject,
  previewText: row.preview_text,
  status: row.status,
  resendBroadcastId: row.resend_broadcast_id,
  sentAt: row.sent_at,
  failureReason: row.failure_reason,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

const tokenRowToRecord = (row: NewsletterTokenLookupRow): NewsletterTokenRecord => ({
  id: row.token_id,
  type: row.token_type,
  hash: row.token_hash,
  expiresAt: row.token_expires_at,
  usedAt: row.token_used_at,
  subscriber: rowToSubscriber({
    id: row.subscriber_id,
    email: row.subscriber_email,
    email_normalized: row.subscriber_email_normalized,
    source: row.subscriber_source,
    status: row.subscriber_status,
    resend_contact_id: row.subscriber_resend_contact_id,
    confirmed_at: row.subscriber_confirmed_at,
    unsubscribed_at: row.subscriber_unsubscribed_at,
    suppression_reason: row.subscriber_suppression_reason,
    created_at: row.subscriber_created_at,
    updated_at: row.subscriber_updated_at,
  }),
})

export const isNewsletterConfigured = (): boolean =>
  Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.RESEND_REPLY_TO_EMAIL &&
      process.env.RESEND_NEWSLETTER_SEGMENT_ID,
  )

const getNewsletterConfig = (): NewsletterSendConfig => {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID

  if (!(apiKey && fromEmail && replyToEmail && segmentId)) {
    throw new Error('Newsletter environment variables are not fully configured.')
  }

  return {
    apiKey,
    fromEmail,
    fromName: NEWSLETTER_FROM_NAME,
    replyToEmail,
    segmentId,
    webhookSecret: process.env.RESEND_WEBHOOK_SIGNING_SECRET,
    cronSecret: process.env.CRON_SECRET,
    adminSecret: process.env.NEWSLETTER_ADMIN_SECRET,
  }
}

let resendClient: Resend | null = null

const getResendClient = (): Resend => {
  if (resendClient) {
    return resendClient
  }

  resendClient = new Resend(getNewsletterConfig().apiKey)
  return resendClient
}

const formatPostDate = (date: string): string =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: SITE_TIME_ZONE,
  }).format(new Date(`${date}T00:00:00+05:30`))

const buildPostContent = (post: ReturnType<typeof getBlogPosts>[number]): NewsletterPostContent => {
  const distribution = getRequiredBlogEmailDistribution(post)
  const preview = truncate(distribution.preview, MAX_PREVIEW_LENGTH)

  return {
    body: distribution.body,
    preview,
    subject: distribution.subject,
    summary: distribution.summary,
  }
}

const createTokenExpiry = (hours: number): string => {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + hours)
  return expiresAt.toISOString()
}

const getSubscriberByNormalizedEmail = async (
  emailNormalized: string,
): Promise<NewsletterSubscriber | null> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: 'SELECT * FROM newsletter_subscribers WHERE email_normalized = ? LIMIT 1',
    args: [emailNormalized],
  })
  const row = result.rows[0] as unknown as NewsletterSubscriberRow | undefined

  return row ? rowToSubscriber(row) : null
}

const syncActiveSubscriberFromResend = async (
  subscriber: NewsletterSubscriber,
): Promise<NewsletterSubscriber> => {
  if (subscriber.status !== 'active') {
    return subscriber
  }

  const resend = getResendClient()
  const result = await resend.contacts.get(
    subscriber.resendContactId ? { id: subscriber.resendContactId } : { email: subscriber.email },
  )

  if (result.error?.name === 'not_found') {
    const updatedSubscriber = await updateSubscriberStatus(subscriber.email, 'unsubscribed')
    return updatedSubscriber ?? subscriber
  }

  if (result.error) {
    throw new Error(`Unable to verify newsletter contact status: ${result.error.message}`)
  }

  if (!result.data?.unsubscribed) {
    return subscriber
  }

  const updatedSubscriber = await updateSubscriberStatus(subscriber.email, 'unsubscribed', {
    occurredAt: new Date().toISOString(),
    resendContactId: result.data.id,
  })

  return updatedSubscriber ?? subscriber
}

const recordSignupAttempt = async (keyHash: string): Promise<void> => {
  const db = await ensureDb()
  await db.execute({
    sql: 'INSERT INTO newsletter_signup_attempts (key_hash) VALUES (?)',
    args: [keyHash],
  })
}

const countRecentSignupAttempts = async (keyHash: string): Promise<number> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: `SELECT COUNT(*) AS count
      FROM newsletter_signup_attempts
      WHERE key_hash = ?
        AND created_at >= datetime('now', ?)`,
    args: [keyHash, RATE_LIMIT_WINDOW],
  })

  return Number(result.rows[0]?.count ?? 0)
}

const issueConfirmationToken = async (subscriberId: number): Promise<string> => {
  const db = await ensureDb()
  const rawToken = generateToken()
  const tokenHash = hashValue(rawToken)

  await db.execute({
    sql: `UPDATE newsletter_tokens
      SET used_at = datetime('now')
      WHERE subscriber_id = ?
        AND type = 'confirm'
        AND used_at IS NULL`,
    args: [subscriberId],
  })

  await db.execute({
    sql: `INSERT INTO newsletter_tokens (subscriber_id, type, token_hash, expires_at)
      VALUES (?, 'confirm', ?, ?)`,
    args: [subscriberId, tokenHash, createTokenExpiry(CONFIRM_TOKEN_TTL_HOURS)],
  })

  return rawToken
}

const getConfirmationTokenRecord = async (
  rawToken: string,
): Promise<NewsletterTokenRecord | null> => {
  const db = await ensureDb()
  const tokenHash = hashValue(rawToken)

  const result = await db.execute({
    sql: `SELECT
        t.id AS token_id,
        t.type AS token_type,
        t.token_hash,
        t.expires_at AS token_expires_at,
        t.used_at AS token_used_at,
        s.id AS subscriber_id,
        s.email AS subscriber_email,
        s.email_normalized AS subscriber_email_normalized,
        s.source AS subscriber_source,
        s.status AS subscriber_status,
        s.resend_contact_id AS subscriber_resend_contact_id,
        s.confirmed_at AS subscriber_confirmed_at,
        s.unsubscribed_at AS subscriber_unsubscribed_at,
        s.suppression_reason AS subscriber_suppression_reason,
        s.created_at AS subscriber_created_at,
        s.updated_at AS subscriber_updated_at
      FROM newsletter_tokens t
      INNER JOIN newsletter_subscribers s ON s.id = t.subscriber_id
      WHERE t.token_hash = ?
        AND t.type = 'confirm'
        AND t.used_at IS NULL
        AND t.expires_at >= datetime('now')
      LIMIT 1`,
    args: [tokenHash],
  })

  const row = result.rows[0] as unknown as NewsletterTokenLookupRow | undefined
  return row ? tokenRowToRecord(row) : null
}

const markTokenUsed = async (tokenId: number): Promise<void> => {
  const db = await ensureDb()
  await db.execute({
    sql: `UPDATE newsletter_tokens
      SET used_at = datetime('now')
      WHERE id = ?`,
    args: [tokenId],
  })
}

const upsertPendingSubscriber = async (
  email: string,
  source: string,
): Promise<{
  shouldSendConfirmation: boolean
  subscriber: NewsletterSubscriber
}> => {
  const db = await ensureDb()
  const emailNormalized = normalizeEmail(email)
  let existing = await getSubscriberByNormalizedEmail(emailNormalized)

  if (!existing) {
    const insertResult = await db.execute({
      sql: `INSERT INTO newsletter_subscribers (
          email,
          email_normalized,
          source,
          status
        ) VALUES (?, ?, ?, 'pending')`,
      args: [email.trim(), emailNormalized, source],
    })

    const created = await db.execute({
      sql: 'SELECT * FROM newsletter_subscribers WHERE id = ? LIMIT 1',
      args: [Number(insertResult.lastInsertRowid)],
    })

    return {
      shouldSendConfirmation: true,
      subscriber: rowToSubscriber(created.rows[0] as unknown as NewsletterSubscriberRow),
    }
  }

  if (existing.status === 'active') {
    existing = await syncActiveSubscriberFromResend(existing)

    if (existing.status === 'active') {
      return {
        shouldSendConfirmation: false,
        subscriber: existing,
      }
    }
  }

  if (existing.status === 'bounced' || existing.status === 'complained') {
    return {
      shouldSendConfirmation: false,
      subscriber: existing,
    }
  }

  await db.execute({
    sql: `UPDATE newsletter_subscribers
      SET email = ?,
        source = ?,
        status = 'pending',
        unsubscribed_at = NULL,
        suppression_reason = NULL,
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [email.trim(), source, existing.id],
  })

  const refreshed = await getSubscriberByNormalizedEmail(emailNormalized)
  if (!refreshed) {
    throw new Error('Unable to refresh newsletter subscriber after update.')
  }

  return {
    shouldSendConfirmation: true,
    subscriber: refreshed,
  }
}

const sendConfirmationEmail = async (email: string, token: string): Promise<void> => {
  const resend = getResendClient()
  const config = getNewsletterConfig()
  const confirmUrl = getAbsoluteUrl(`/newsletter/confirm?token=${token}`)

  const { error } = await resend.emails.send({
    from: `${config.fromName} <${config.fromEmail}>`,
    to: email,
    replyTo: config.replyToEmail,
    subject: 'Confirm your subscription to anmdotdev',
    react: <NewsletterConfirmationEmail confirmUrl={confirmUrl} />,
    headers: {
      'X-Entity-Ref-ID': `newsletter-confirm-${hashValue(email)}`,
    },
  })

  if (error) {
    throw new Error(`Unable to send confirmation email: ${error.message}`)
  }
}

const sendWelcomeEmail = async (email: string): Promise<void> => {
  const resend = getResendClient()
  const config = getNewsletterConfig()
  const blogUrl = getAbsoluteUrl('/blog')

  const { error } = await resend.emails.send({
    from: `${config.fromName} <${config.fromEmail}>`,
    to: email,
    replyTo: config.replyToEmail,
    subject: 'You are subscribed to anmdotdev',
    react: <NewsletterWelcomeEmail blogUrl={blogUrl} />,
    headers: {
      'X-Entity-Ref-ID': `newsletter-welcome-${hashValue(email)}`,
    },
  })

  if (error) {
    throw new Error(`Unable to send welcome email: ${error.message}`)
  }
}

const ensureContactIsInSegment = async (contactId: string | null, email: string): Promise<void> => {
  const resend = getResendClient()
  const { segmentId } = getNewsletterConfig()

  const { error } = await resend.contacts.segments.add(
    contactId ? { contactId, segmentId } : { email, segmentId },
  )

  if (error && !ALREADY_IN_SEGMENT_REGEX.test(error.message || '')) {
    throw new Error(`Unable to add contact to newsletter segment: ${error.message}`)
  }
}

const syncSubscriberToResend = async (subscriber: NewsletterSubscriber): Promise<string> => {
  const resend = getResendClient()

  const updateResult = await resend.contacts.update(
    subscriber.resendContactId
      ? { id: subscriber.resendContactId, unsubscribed: false }
      : { email: subscriber.email, unsubscribed: false },
  )

  if (!(updateResult.error || !updateResult.data)) {
    await ensureContactIsInSegment(updateResult.data.id, subscriber.email)
    return updateResult.data.id
  }

  if (updateResult.error?.name !== 'not_found') {
    throw new Error(`Unable to update newsletter contact: ${updateResult.error.message}`)
  }

  const { segmentId } = getNewsletterConfig()
  const createResult = await resend.contacts.create({
    email: subscriber.email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  })

  if (createResult.error || !createResult.data) {
    throw new Error(`Unable to create newsletter contact: ${createResult.error?.message}`)
  }

  return createResult.data.id
}

export const subscribeToNewsletter = async ({
  email,
  ipAddress,
  source = 'website',
}: SubscribeToNewsletterOptions): Promise<SubscribeToNewsletterResult> => {
  if (!isNewsletterConfigured()) {
    throw new Error('Newsletter is not configured.')
  }

  const normalizedEmail = normalizeEmail(email)
  if (!isValidEmail(normalizedEmail)) {
    throw new Error('Please enter a valid email address.')
  }

  const attemptKeys = [
    hashValue(`email:${normalizedEmail}`),
    ...(ipAddress ? [hashValue(`ip:${ipAddress}`)] : []),
  ]

  for (const key of attemptKeys) {
    const attempts = await countRecentSignupAttempts(key)
    if (attempts >= MAX_SIGNUP_ATTEMPTS_PER_HOUR) {
      return {
        message: 'If this email can receive updates, a confirmation link is on its way.',
      }
    }
  }

  for (const key of attemptKeys) {
    await recordSignupAttempt(key)
  }

  const { shouldSendConfirmation, subscriber } = await upsertPendingSubscriber(
    normalizedEmail,
    source,
  )

  if (shouldSendConfirmation) {
    const token = await issueConfirmationToken(subscriber.id)
    await sendConfirmationEmail(subscriber.email, token)
  }

  return {
    message: 'If this email can receive updates, a confirmation link is on its way.',
    subscriberAnalyticsId: toSubscriberAnalyticsId(subscriber.id),
  }
}

export const confirmNewsletterSubscription = async (
  rawToken: string,
): Promise<ConfirmNewsletterResult> => {
  if (!(rawToken && isNewsletterConfigured())) {
    return { status: 'invalid' }
  }

  const tokenRecord = await getConfirmationTokenRecord(rawToken)
  if (!tokenRecord) {
    return { status: 'invalid' }
  }

  if (tokenRecord.subscriber.status === 'active') {
    await markTokenUsed(tokenRecord.id)
    return {
      status: 'already-confirmed',
      subscriberAnalyticsId: toSubscriberAnalyticsId(tokenRecord.subscriber.id),
      source: tokenRecord.subscriber.source,
    }
  }

  const resendContactId = await syncSubscriberToResend(tokenRecord.subscriber)
  const db = await ensureDb()
  await db.execute({
    sql: `UPDATE newsletter_subscribers
      SET status = 'active',
        confirmed_at = COALESCE(confirmed_at, datetime('now')),
        unsubscribed_at = NULL,
        suppression_reason = NULL,
        resend_contact_id = ?,
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [resendContactId, tokenRecord.subscriber.id],
  })
  await markTokenUsed(tokenRecord.id)

  try {
    await sendWelcomeEmail(tokenRecord.subscriber.email)
  } catch {
    // Confirmation should succeed even if the follow-up welcome email fails transiently.
  }

  return {
    status: 'confirmed',
    subscriberAnalyticsId: toSubscriberAnalyticsId(tokenRecord.subscriber.id),
    source: tokenRecord.subscriber.source,
  }
}

export const queueNewsletterCampaignForPost = async (postSlug: string): Promise<boolean> => {
  const post = getBlogPost(postSlug)
  if (!(post && !post.newsletterDisabled)) {
    return false
  }

  const { preview, subject } = buildPostContent(post)
  const db = await ensureDb()
  const result = await db.execute({
    sql: `INSERT OR IGNORE INTO newsletter_campaigns (
        kind,
        post_slug,
        post_title,
        post_date,
        subject,
        preview_text,
        status
      ) VALUES ('post_published', ?, ?, ?, ?, ?, 'pending')`,
    args: [post.slug, post.title, post.date, subject, preview],
  })

  return Number(result.rowsAffected ?? 0) > 0
}

const listCampaignsToProcess = async (): Promise<NewsletterCampaign[]> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: `SELECT *
      FROM newsletter_campaigns
      WHERE status IN ('pending', 'failed')
      ORDER BY post_date ASC`,
  })

  return result.rows.map((row) => rowToCampaign(row as unknown as NewsletterCampaignRow))
}

const claimCampaign = async (campaignId: number): Promise<boolean> => {
  const db = await ensureDb()
  const result = await db.execute({
    sql: `UPDATE newsletter_campaigns
      SET status = 'sending',
        failure_reason = NULL,
        updated_at = datetime('now')
      WHERE id = ?
        AND status IN ('pending', 'failed')`,
    args: [campaignId],
  })

  return Number(result.rowsAffected ?? 0) > 0
}

const markCampaignSent = async (campaignId: number, broadcastId: string): Promise<void> => {
  const db = await ensureDb()
  await db.execute({
    sql: `UPDATE newsletter_campaigns
      SET status = 'sent',
        resend_broadcast_id = ?,
        sent_at = datetime('now'),
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [broadcastId, campaignId],
  })
}

const markCampaignFailed = async (campaignId: number, reason: string): Promise<void> => {
  const db = await ensureDb()
  await db.execute({
    sql: `UPDATE newsletter_campaigns
      SET status = 'failed',
        failure_reason = ?,
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [reason, campaignId],
  })
}

const sendCampaign = async (campaign: NewsletterCampaign): Promise<boolean> => {
  try {
    const post = getBlogPost(campaign.postSlug)
    if (!(post && !post.newsletterDisabled)) {
      await markCampaignFailed(campaign.id, 'Post is no longer eligible for newsletter sends.')
      return false
    }

    const config = getNewsletterConfig()
    const postUrl = getAbsoluteUrl(`/blog/${post.slug}`)
    const { body, preview, summary, subject } = buildPostContent(post)
    const emailComponent = (
      <NewsletterPostPublishedEmail
        body={body}
        postDateLabel={formatPostDate(post.date)}
        postUrl={postUrl}
        preview={preview}
        readingTime={post.readingTime}
        summary={summary}
        tags={post.tags}
        title={post.title}
      />
    )
    const html = await render(emailComponent)
    const text = toPlainText(html)
    const resend = getResendClient()

    const { data, error } = await resend.broadcasts.create({
      segmentId: config.segmentId,
      from: `${config.fromName} <${config.fromEmail}>`,
      replyTo: config.replyToEmail,
      subject,
      previewText: preview,
      name: `Blog post: ${post.title}`,
      react: emailComponent,
      html,
      text,
      send: true,
    })

    if (error || !data) {
      await markCampaignFailed(campaign.id, error?.message ?? 'Unknown broadcast error.')
      return false
    }

    await markCampaignSent(campaign.id, data.id)
    return true
  } catch (error) {
    await markCampaignFailed(campaign.id, getErrorMessage(error))
    return false
  }
}

export const runNewsletterPublishJob = async (): Promise<NewsletterPublishJobResult> => {
  if (!isNewsletterConfigured()) {
    throw new Error('Newsletter is not configured.')
  }

  const publishedPosts = getBlogPosts().filter((post) => !post.newsletterDisabled)
  let createdCampaigns = 0

  for (const post of publishedPosts) {
    if (await queueNewsletterCampaignForPost(post.slug)) {
      createdCampaigns += 1
    }
  }

  const candidates = await listCampaignsToProcess()
  let sentCampaigns = 0
  let failedCampaigns = 0

  for (const campaign of candidates) {
    const claimed = await claimCampaign(campaign.id)
    if (!claimed) {
      continue
    }

    const sent = await sendCampaign(campaign)
    if (sent) {
      sentCampaigns += 1
    } else {
      failedCampaigns += 1
    }
  }

  return {
    totalPublishedPosts: publishedPosts.length,
    createdCampaigns,
    sentCampaigns,
    failedCampaigns,
    skippedPosts: publishedPosts.length - createdCampaigns - sentCampaigns,
  }
}

const getCampaignByBroadcastId = async (
  broadcastId: string | undefined,
): Promise<NewsletterCampaign | null> => {
  if (!broadcastId) {
    return null
  }

  const db = await ensureDb()
  const result = await db.execute({
    sql: 'SELECT * FROM newsletter_campaigns WHERE resend_broadcast_id = ? LIMIT 1',
    args: [broadcastId],
  })
  const row = result.rows[0] as unknown as NewsletterCampaignRow | undefined

  return row ? rowToCampaign(row) : null
}

const updateSubscriberStatus = async (
  email: string,
  status: NewsletterSubscriberStatus,
  options?: {
    occurredAt?: string
    resendContactId?: string
    suppressionReason?: string
  },
): Promise<NewsletterSubscriber | null> => {
  const normalizedEmail = normalizeEmail(email)
  const existing = await getSubscriberByNormalizedEmail(normalizedEmail)
  if (!existing) {
    return null
  }

  const db = await ensureDb()
  await db.execute({
    sql: `UPDATE newsletter_subscribers
      SET status = ?,
        unsubscribed_at = CASE WHEN ? = 'unsubscribed' THEN COALESCE(?, datetime('now')) ELSE unsubscribed_at END,
        suppression_reason = CASE
          WHEN ? IN ('bounced', 'complained') THEN ?
          WHEN ? = 'active' THEN NULL
          ELSE suppression_reason
        END,
        resend_contact_id = COALESCE(?, resend_contact_id),
        updated_at = datetime('now')
      WHERE id = ?`,
    args: [
      status,
      status,
      options?.occurredAt ?? null,
      status,
      options?.suppressionReason ?? null,
      status,
      options?.resendContactId ?? null,
      existing.id,
    ],
  })

  return getSubscriberByNormalizedEmail(normalizedEmail)
}

const getPayloadPrimaryEmail = (payload: WebhookEventPayload): string | undefined => {
  if ('to' in payload.data) {
    return payload.data.to[0]
  }

  if ('email' in payload.data) {
    return payload.data.email
  }

  return undefined
}

const getPayloadBroadcastId = (payload: WebhookEventPayload): string | undefined =>
  'broadcast_id' in payload.data ? payload.data.broadcast_id : undefined

const getPayloadMessageId = (payload: WebhookEventPayload): string | null =>
  'email_id' in payload.data ? payload.data.email_id : null

const updateSubscriberForWebhookPayload = (
  payload: WebhookEventPayload,
  primaryEmail: string | undefined,
): Promise<NewsletterSubscriber | null> => {
  if (payload.type === 'contact.created' || payload.type === 'contact.updated') {
    if (payload.data.unsubscribed) {
      return updateSubscriberStatus(payload.data.email, 'unsubscribed', {
        occurredAt: payload.created_at,
        resendContactId: payload.data.id,
      })
    }

    return updateSubscriberStatus(payload.data.email, 'active', {
      resendContactId: payload.data.id,
    })
  }

  if (payload.type === 'email.complained' && primaryEmail) {
    return updateSubscriberStatus(primaryEmail, 'complained', {
      occurredAt: payload.created_at,
      suppressionReason: 'Recipient marked the email as spam.',
    })
  }

  if (payload.type === 'email.bounced' && primaryEmail) {
    return updateSubscriberStatus(primaryEmail, 'bounced', {
      occurredAt: payload.created_at,
      suppressionReason: payload.data.bounce.message,
    })
  }

  return primaryEmail
    ? getSubscriberByNormalizedEmail(normalizeEmail(primaryEmail))
    : Promise.resolve(null)
}

export const handleResendWebhook = async (
  payload: WebhookEventPayload,
  providerEventId?: string,
): Promise<void> => {
  const primaryEmail = getPayloadPrimaryEmail(payload)
  const subscriber = await updateSubscriberForWebhookPayload(payload, primaryEmail)
  const campaign = await getCampaignByBroadcastId(getPayloadBroadcastId(payload))

  const db = await ensureDb()
  await db.execute({
    sql: `INSERT OR IGNORE INTO newsletter_events (
        subscriber_id,
        campaign_id,
        provider,
        provider_event_id,
        provider_message_id,
        event_type,
        payload_json,
        occurred_at
      ) VALUES (?, ?, 'resend', ?, ?, ?, ?, ?)`,
    args: [
      subscriber?.id ?? null,
      campaign?.id ?? null,
      providerEventId ?? null,
      getPayloadMessageId(payload),
      payload.type,
      JSON.stringify(payload),
      payload.created_at,
    ],
  })
}

export const verifyResendWebhook = (
  body: string,
  headers: {
    id: string | null
    signature: string | null
    timestamp: string | null
  },
): WebhookEventPayload => {
  const config = getNewsletterConfig()
  if (!config.webhookSecret) {
    throw new Error('Resend webhook secret is not configured.')
  }

  return getResendClient().webhooks.verify({
    payload: body,
    webhookSecret: config.webhookSecret,
    headers: {
      id: headers.id ?? '',
      timestamp: headers.timestamp ?? '',
      signature: headers.signature ?? '',
    },
  })
}

export const getCronAuthorizationHeader = (): string => {
  const { cronSecret } = getNewsletterConfig()
  if (!cronSecret) {
    throw new Error('CRON_SECRET is not configured.')
  }

  return `Bearer ${cronSecret}`
}

export const getNewsletterAdminAuthorizationHeader = (): string => {
  const { adminSecret } = getNewsletterConfig()
  if (!adminSecret) {
    throw new Error('NEWSLETTER_ADMIN_SECRET is not configured.')
  }

  return `Bearer ${adminSecret}`
}
