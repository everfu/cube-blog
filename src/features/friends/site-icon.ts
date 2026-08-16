import type { FriendLink } from '@/features/friends/types'

const iconRequests = new Map<string, Promise<string | null>>()

function readAttributes(tag: string) {
  const attributes = new Map<string, string>()
  const pattern = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

  for (const match of tag.matchAll(pattern)) {
    const name = match[1]?.toLowerCase()
    if (!name || name === 'link') continue

    attributes.set(name, match[2] ?? match[3] ?? match[4] ?? '')
  }

  return attributes
}

function decodeAttribute(value: string) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
}

function findIconHref(html: string) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? html

  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    const attributes = readAttributes(tag)
    const rel = attributes.get('rel')?.toLowerCase().split(/\s+/)
    const href = attributes.get('href')?.trim()

    if (rel?.includes('icon') && href) return decodeAttribute(href)
  }

  return null
}

async function fetchSourceLogoUrl(href: string) {
  try {
    const sourceUrl = new URL(href)
    if (sourceUrl.protocol !== 'http:' && sourceUrl.protocol !== 'https:') return null

    const response = await fetch(sourceUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'Mozilla/5.0 (compatible; CubeBlog/1.0; +https://blog.efu.me)',
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) return null

    const contentType = response.headers.get('content-type')
    if (contentType && !contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) return null

    const iconHref = findIconHref(await response.text())
    if (!iconHref) return null

    const iconUrl = new URL(iconHref, response.url)
    if (iconUrl.protocol !== 'http:' && iconUrl.protocol !== 'https:') return null

    return iconUrl.href
  } catch {
    return null
  }
}

function getSourceLogoUrl(href: string) {
  const cached = iconRequests.get(href)
  if (cached) return cached

  const request = fetchSourceLogoUrl(href)
  iconRequests.set(href, request)
  return request
}

export async function resolveFriendLinkAvatar(link: FriendLink): Promise<FriendLink> {
  if (link.avatar?.trim()) return link

  const resolvedAvatar = await getSourceLogoUrl(link.href)
  return resolvedAvatar ? { ...link, resolvedAvatar } : link
}
