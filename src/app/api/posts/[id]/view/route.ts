import { NextRequest } from 'next/server'
import { postViewResponse } from '@/server/posts/adapters/http'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  return postViewResponse(id)
}
