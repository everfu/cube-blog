import { NextRequest } from 'next/server'
import { commentLikeResponse } from '@/server/comments/adapters/http'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return commentLikeResponse(request, id)
}
