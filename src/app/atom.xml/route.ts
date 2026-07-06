import { createAtomResponse } from '@/server/feeds/adapters/http'
import { getAllPosts } from '@/server/posts/adapters/page'

export async function GET() {
  return createAtomResponse(await getAllPosts())
}
