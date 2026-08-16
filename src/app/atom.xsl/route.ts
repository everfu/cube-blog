import { atomXsl } from '@/features/feeds/atom-xsl'
import { createDocumentResponse } from '@/features/feeds/documents'

export const dynamic = 'force-static'

export function GET() {
  return createDocumentResponse(atomXsl, 'atom.xsl', 'text/xsl')
}
