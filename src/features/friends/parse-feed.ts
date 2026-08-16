import { XMLParser } from 'fast-xml-parser'

export interface ParsedFeedItem {
  title: string
  link: string
  summary: string
  cover?: string
  pubDate: string
}

const parser = new XMLParser({
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  ignoreAttributes: false,
  textNodeName: '#text',
  trimValues: true,
})

function nodeText(node: unknown): string {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')

  if (typeof node === 'object') {
    const value = node as Record<string, unknown>
    if (value.__cdata != null) return nodeText(value.__cdata)
    if (value['#text'] != null) return nodeText(value['#text'])
  }

  return ''
}

function pick(value: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (value[key] != null && value[key] !== '') return value[key]
  }

  return undefined
}

function stripHtml(html: string): string {
  if (!html) return ''

  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(text: string, length: number): string {
  const chars = Array.from(text)
  if (chars.length <= length) return text
  return `${chars.slice(0, length).join('')}...`
}

function extractFirstImage(html: string): string | undefined {
  if (!html) return undefined

  const imageTag = html.match(/<img\b[^>]*>/i)?.[0]
  if (imageTag) {
    const source = imageTag.match(/(?:src|data-src|data-original)\s*=\s*["']([^"']+)["']/i)?.[1]
    if (source) return source

    const srcset = imageTag.match(/(?:srcset|data-srcset)\s*=\s*["']([^"']+)["']/i)?.[1]
    if (srcset) return srcset.split(',')[0]?.trim().split(/\s+/)[0]
  }

  const sourceTag = html.match(/<source\b[^>]*(?:srcset|data-srcset)\s*=\s*["']([^"']+)["']/i)?.[1]
  return sourceTag?.split(',')[0]?.trim().split(/\s+/)[0]
}

function pickAtomLink(link: unknown): string {
  if (!link) return ''
  if (typeof link === 'string') return link

  if (Array.isArray(link)) {
    const alternate = link.find((item) => {
      const rel = (item as Record<string, unknown>)['@_rel']
      return !rel || rel === 'alternate'
    }) as Record<string, unknown> | undefined
    const fallback = link[0] as Record<string, unknown> | undefined

    return nodeText(alternate?.['@_href'] ?? fallback?.['@_href'])
  }

  const value = link as Record<string, unknown>
  return nodeText(value['@_href']) || nodeText(value)
}

function isoDate(input: unknown): string {
  const value = nodeText(input).trim()
  if (!value) return ''

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

function asArray<T>(input: T | T[] | undefined): T[] {
  if (input == null) return []
  return Array.isArray(input) ? input : [input]
}

function pickEnclosureImage(item: Record<string, unknown>): string | undefined {
  const enclosure = item.enclosure
  if (!enclosure) return undefined

  for (const entry of asArray(enclosure as Record<string, unknown> | Record<string, unknown>[])) {
    const type = nodeText(entry['@_type'])
    const url = nodeText(entry['@_url'])
    if (url && (!type || type.startsWith('image/'))) return url
  }

  return undefined
}

function pickMediaImage(node: unknown): string | undefined {
  for (const entry of asArray(node as Record<string, unknown> | Record<string, unknown>[] | undefined)) {
    if (!entry || typeof entry !== 'object') continue

    const type = nodeText(entry['@_type'])
    const medium = nodeText(entry['@_medium'])
    const url = nodeText(entry['@_url']) || nodeText(entry['@_href']) || nodeText(entry.url)
    if (url && (!type || type.startsWith('image/')) && (!medium || medium === 'image')) return url
  }

  return undefined
}

function pickImageNode(node: unknown): string | undefined {
  if (!node) return undefined
  if (typeof node === 'string') return node

  if (typeof node === 'object') {
    const value = node as Record<string, unknown>
    return nodeText(value['@_href'])
      || nodeText(value['@_url'])
      || nodeText(value.url)
      || nodeText(value.src)
  }

  return undefined
}

export function parseFeedXml(xml: string, limit = 10): ParsedFeedItem[] {
  const root = parser.parse(xml) as Record<string, unknown>
  const rss = root.rss as { channel?: Record<string, unknown> } | undefined

  if (rss?.channel) {
    const items = asArray(
      rss.channel.item as Record<string, unknown> | Record<string, unknown>[] | undefined,
    ).slice(0, limit)

    return items
      .map((item) => {
        const content = nodeText(item['content:encoded'])
        const description = nodeText(item.description)
        const html = content || description

        return {
          title: stripHtml(nodeText(item.title)) || '无标题',
          link: nodeText(item.link).trim()
            || nodeText((item.link as Record<string, unknown> | undefined)?.['@_href']),
          summary: truncate(stripHtml(description || content), 200),
          cover: pickEnclosureImage(item)
            || pickMediaImage(item['media:content'])
            || pickMediaImage(item['media:thumbnail'])
            || pickImageNode(item.image)
            || pickImageNode(item['itunes:image'])
            || extractFirstImage(html),
          pubDate: isoDate(pick(item, ['pubDate', 'dc:date', 'pubdate'])),
        }
      })
      .filter(item => item.link)
  }

  const feed = root.feed as Record<string, unknown> | undefined
  if (feed) {
    const entries = asArray(
      feed.entry as Record<string, unknown> | Record<string, unknown>[] | undefined,
    ).slice(0, limit)

    return entries
      .map((entry) => {
        const summary = nodeText(entry.summary)
        const content = nodeText(entry.content)
        const html = content || summary

        return {
          title: stripHtml(nodeText(entry.title)) || '无标题',
          link: pickAtomLink(entry.link),
          summary: truncate(stripHtml(summary || content), 200),
          cover: pickMediaImage(entry['media:thumbnail'])
            || pickMediaImage(entry['media:content'])
            || pickImageNode(entry.image)
            || extractFirstImage(html),
          pubDate: isoDate(pick(entry, ['published', 'updated'])),
        }
      })
      .filter(item => item.link)
  }

  throw new Error('Unsupported feed format')
}
