import { NextRequest } from 'next/server'
import { postReactionResponse } from '@/server/posts/adapters/http'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return postReactionResponse(request, id)
}
