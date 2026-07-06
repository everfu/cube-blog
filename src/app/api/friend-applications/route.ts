import { NextRequest } from 'next/server'
import { friendApplicationResponse } from '@/server/friends/adapters/http'

export async function POST(request: NextRequest) {
  return friendApplicationResponse(request)
}

