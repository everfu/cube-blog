import { buildAtomFeed, createDocumentResponse } from '@/features/feeds/documents'
import { getAllPosts } from '@/features/posts/content'

export const dynamic = 'force-static'

export async function GET() {
  return createDocumentResponse(
    buildAtomFeed(await getAllPosts()),
    'atom.xml',
    'application/atom+xml',
  )
}
