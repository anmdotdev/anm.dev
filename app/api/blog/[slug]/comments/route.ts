import { getBlogPost } from 'lib/blog'
import { createComment, deleteComment, getComments } from 'lib/db'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export const GET = async (_request: Request, { params }: RouteParams) => {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const comments = await getComments(slug)
  return NextResponse.json(
    { comments, count: comments.length },
    {
      headers: { 'Cache-Control': 'no-cache' },
    },
  )
}

export const POST = async (request: Request, { params }: RouteParams) => {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = (await request.json()) as {
    authorName?: string
    authorEmail?: string
    content?: string
    parentId?: number
    fingerprint?: string
  }

  if (!(body.authorName && body.content && body.fingerprint)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const authorName = body.authorName.trim()
  const content = body.content.trim()

  if (authorName.length < 1 || authorName.length > 50) {
    return NextResponse.json({ error: 'Name must be 1-50 characters' }, { status: 400 })
  }

  if (content.length < 1 || content.length > 2000) {
    return NextResponse.json({ error: 'Comment must be 1-2000 characters' }, { status: 400 })
  }

  const comment = await createComment({
    slug,
    parentId: body.parentId ?? null,
    authorName,
    authorEmail: body.authorEmail?.trim(),
    content,
    fingerprint: body.fingerprint,
  })

  return NextResponse.json(comment, { status: 201 })
}

export const DELETE = async (request: Request, { params }: RouteParams) => {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = (await request.json()) as { id?: number; fingerprint?: string }

  if (!(body.id && body.fingerprint)) {
    return NextResponse.json({ error: 'Missing id or fingerprint' }, { status: 400 })
  }

  const deleted = await deleteComment(body.id, body.fingerprint)
  if (!deleted) {
    return NextResponse.json({ error: 'Comment not found or not authorized' }, { status: 403 })
  }

  return NextResponse.json({ success: true })
}
