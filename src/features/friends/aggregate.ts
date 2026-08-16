import { unstable_cache } from 'next/cache'
import { friendFeedSources } from '@/data/links'
import { parseFeedXml, type ParsedFeedItem } from '@/features/friends/parse-feed'
import { resolveFriendLinkAvatar } from '@/features/friends/site-icon'
import type { FriendArticle, FriendLink, FriendsResponse, FriendSourceStatus } from '@/features/friends/types'

const PER_FEED_LIMIT = 10
const TOTAL_LIMIT = 100
const FETCH_TIMEOUT_MS = 8000
const FRIENDS_CACHE_TTL_SECONDS = 5 * 60
const FRIENDS_CACHE_TAG = 'friends'
const FRIENDS_CACHE_SOURCE_SIGNATURE = JSON.stringify(friendFeedSources)

type FeedSource = FriendLink & { feed: string }

let pendingFriendsRequest: Promise<FriendsResponse> | null = null

function resolveHttpUrl(value: string | undefined, base: string): string | undefined {
  if (!value) return undefined

  try {
    const url = new URL(value, base)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined
  } catch {
    return undefined
  }
}

function toArticle(item: ParsedFeedItem, source: FriendLink, baseUrl: string): FriendArticle | null {
  const href = resolveHttpUrl(item.link, baseUrl)
  if (!href || !item.pubDate) return null

  return {
    author: source.author,
    avatar: source.avatar,
    resolvedAvatar: source.resolvedAvatar,
    sourceHref: source.href,
    date: item.pubDate,
    title: item.title,
    description: item.summary,
    href,
    tags: source.tags ?? [],
    cover: resolveHttpUrl(item.cover, baseUrl),
  }
}

async function fetchOne(source: FeedSource): Promise<{ items: FriendArticle[]; status: FriendSourceStatus }> {
  const resolvedSourcePromise = resolveFriendLinkAvatar(source)
  let items: FriendArticle[] = []
  let error: string | undefined

  try {
    const response = await fetch(source.feed, {
      headers: {
        Accept: 'application/atom+xml, application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5',
        'User-Agent': `cube-blog-friends/1.0 (+${source.href})`,
      },
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const parsedItems = parseFeedXml(await response.text(), PER_FEED_LIMIT)
    const resolvedSource = await resolvedSourcePromise
    items = parsedItems
      .map(item => toArticle(item, resolvedSource, response.url || source.feed))
      .filter((item): item is FriendArticle => item !== null)
  } catch (feedError) {
    error = feedError instanceof Error ? feedError.message : String(feedError)
  }

  const resolvedSource = await resolvedSourcePromise
  const status: FriendSourceStatus = {
    name: resolvedSource.name,
    description: resolvedSource.description,
    avatar: resolvedSource.avatar,
    resolvedAvatar: resolvedSource.resolvedAvatar,
    href: resolvedSource.href,
    feed: source.feed,
    ok: !error,
    count: items.length,
    error,
  }

  return { items, status }
}

export function emptyFriendsResponse(): FriendsResponse {
  return {
    items: [],
    sources: [],
    generatedAt: new Date().toISOString(),
  }
}

export async function aggregateFriends(): Promise<FriendsResponse> {
  const results = await Promise.all(friendFeedSources.map(fetchOne))
  const sources = results.map(result => result.status)

  if (sources.length > 0 && sources.every(source => !source.ok)) {
    throw new Error('All friend feeds failed')
  }

  const items = results
    .flatMap(result => result.items)
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, TOTAL_LIMIT)

  return {
    items,
    sources,
    generatedAt: new Date().toISOString(),
  }
}

async function aggregateFriendsOnce(): Promise<FriendsResponse> {
  if (!pendingFriendsRequest) {
    pendingFriendsRequest = aggregateFriends().finally(() => {
      pendingFriendsRequest = null
    })
  }

  return pendingFriendsRequest
}

export const getCachedFriends = unstable_cache(
  aggregateFriendsOnce,
  [FRIENDS_CACHE_TAG, FRIENDS_CACHE_SOURCE_SIGNATURE],
  {
    revalidate: FRIENDS_CACHE_TTL_SECONDS,
    tags: [FRIENDS_CACHE_TAG],
  },
)
