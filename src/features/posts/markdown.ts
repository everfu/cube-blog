import type { PostSnapshot } from '@/features/posts/types'

type MarkdownData = {
  hProperties?: Record<string, string>
}

type MarkdownNode = {
  type: string
  value?: string
  depth?: number
  children?: MarkdownNode[]
  data?: MarkdownData
}

function headingSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[：:，,。.!！?？、]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}

function plainText(node: MarkdownNode): string {
  if (typeof node.value === 'string') return node.value
  return node.children?.map(plainText).join('') ?? ''
}

function uniqueSlug(value: string, used: Map<string, number>) {
  const base = headingSlug(value)
  const count = used.get(base) ?? 0
  used.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

export function extractArticleHeadings(content: string): PostSnapshot['headings'] {
  const used = new Map<string, number>()
  const headings: PostSnapshot['headings'] = []
  let fence: string | null = null

  for (const line of content.split('\n')) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0]
      else if (fence === fenceMatch[1][0]) fence = null
      continue
    }
    if (fence) continue
    const match = line.match(/^(#{2,4})\s+(.+)$/)
    if (!match) continue
    headings.push({
      id: uniqueSlug(match[2].trim(), used),
      text: match[2].trim(),
      level: match[1].length as 2 | 3 | 4,
    })
  }

  return headings
}

export function normalizeArticleMarkdown(content: string) {
  return content.replace(
    /^(bash|text|markdown|go|json|yaml|typescript|javascript|shell|sh|css|html|sql)\s*\n\s*```\s*$/gm,
    '```$1',
  )
}

export function remarkArticleBlocks(postId: string) {
  return function articleBlocksPlugin() {
    return function transform(tree: MarkdownNode) {
      let blockIndex = 0
      const usedHeadings = new Map<string, number>()
      const commentable = new Set(['paragraph', 'heading', 'blockquote', 'listItem', 'code', 'image'])

      function visit(node: MarkdownNode) {
        if (commentable.has(node.type)) {
          blockIndex += 1
          node.data ??= {}
          node.data.hProperties ??= {}
          node.data.hProperties['data-blockid'] = `${postId}-block-${blockIndex}`
        }

        if (node.type === 'heading' && node.depth && node.depth >= 2 && node.depth <= 4) {
          node.data ??= {}
          node.data.hProperties ??= {}
          node.data.hProperties.id = uniqueSlug(plainText(node), usedHeadings)
        }

        node.children?.forEach(visit)
      }

      visit(tree)
    }
  }
}
