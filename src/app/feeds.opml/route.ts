import { buildOpml, createDocumentResponse } from '@/features/feeds/documents'

export const dynamic = 'force-static'

export function GET() {
  return createDocumentResponse(buildOpml(), 'feeds.opml', 'text/x-opml')
}
