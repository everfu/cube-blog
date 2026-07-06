import { createOpmlResponse } from '@/server/feeds/adapters/http'

export async function GET() {
  return await createOpmlResponse('feeds.opml')
}
