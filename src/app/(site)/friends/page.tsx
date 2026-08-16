import { headers } from 'next/headers'
import { DemoComment } from '@/components/DemoComment'
import { site } from '@/data/site'
import { emptyFriendsResponse } from '@/features/friends/aggregate'
import { FriendStream } from '@/features/friends/FriendStream'
import type { FriendsResponse } from '@/features/friends/types'

export const metadata = { title: '朋友动态', description: '朋友们最近写下的内容' }
export const dynamic = 'force-dynamic'
export const maxDuration = 20

function isTrustedRequestHost(host: string) {
  const hostname = host.replace(/:\d+$/, '').toLowerCase()

  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname === new URL(site.url).hostname
    || hostname.endsWith('.vercel.app')
}

async function getFriendsSnapshot(): Promise<FriendsResponse> {
  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host')?.split(',')[0]?.trim()
  const requestHost = forwardedHost || requestHeaders.get('host')?.trim()
  const useRequestHost = Boolean(requestHost && isTrustedRequestHost(requestHost))
  const isLocal = requestHost?.startsWith('localhost') || requestHost?.startsWith('127.0.0.1')
  const origin = useRequestHost
    ? `${isLocal ? 'http' : 'https'}://${requestHost}`
    : site.url
  const forwardedHeaders = new Headers({ Accept: 'application/json' })

  if (useRequestHost) {
    for (const name of ['authorization', 'cookie', 'x-vercel-protection-bypass']) {
      const value = requestHeaders.get(name)
      if (value) forwardedHeaders.set(name, value)
    }
  }

  const response = await fetch(new URL('/api/friends/', origin), {
    cache: 'no-store',
    headers: forwardedHeaders,
  })

  if (!response.ok) throw new Error(`Friends API returned HTTP ${response.status}`)

  return response.json() as Promise<FriendsResponse>
}

export default async function FriendsPage() {
  let data = emptyFriendsResponse()
  let initialLoadFailed = false

  try {
    data = await getFriendsSnapshot()
  } catch {
    initialLoadFailed = true
  }

  return (
    <>
      <section className="friends-page">
        <header className="friends-intro">
          <h1>朋友们最近写下的内容。</h1>
          <p>实时汇聚友情链接中的公开 RSS。免打扰的朋友不会出现在这里。</p>
        </header>

        <FriendStream initialData={data} initialLoadFailed={initialLoadFailed} />
      </section>
      <DemoComment title="留下一句话" />
    </>
  )
}
