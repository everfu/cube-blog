import { commentSettingsResponse } from '@/server/comments/adapters/http'

export async function GET() {
  return commentSettingsResponse()
}
