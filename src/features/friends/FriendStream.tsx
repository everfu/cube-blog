'use client'

import { ChevronDown, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatFeedDate, FriendArticleRow } from '@/features/friends/FriendArticleRow'
import { FriendSourcesPanel } from '@/features/friends/FriendSourcesPanel'
import type { FriendsResponse } from '@/features/friends/types'

const ALL_AUTHORS = '全部'
const INITIAL_VISIBLE_COUNT = 8

interface FriendStreamProps {
  initialData: FriendsResponse
  initialLoadFailed?: boolean
}

export function FriendStream({ initialData, initialLoadFailed = false }: FriendStreamProps) {
  const [data, setData] = useState(initialData)
  const [author, setAuthor] = useState(ALL_AUTHORS)
  const [visible, setVisible] = useState(INITIAL_VISIBLE_COUNT)
  const [hasSnapshot, setHasSnapshot] = useState(!initialLoadFailed)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(
    initialLoadFailed ? '朋友动态暂时无法获取，请稍后再试。' : null,
  )
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null)

  const authors = useMemo(
    () => [ALL_AUTHORS, ...new Set(data.items.map(article => article.author))],
    [data.items],
  )
  const selectedAuthor = authors.includes(author) ? author : ALL_AUTHORS
  const filtered = useMemo(
    () => selectedAuthor === ALL_AUTHORS
      ? data.items
      : data.items.filter(item => item.author === selectedAuthor),
    [data.items, selectedAuthor],
  )
  const failedSourceCount = data.sources.filter(source => !source.ok).length
  const successfulSourceCount = data.sources.length - failedSourceCount

  async function refreshFriends() {
    setIsRefreshing(true)
    setRefreshError(null)
    setRefreshNotice(null)

    try {
      const response = await fetch('/api/friends', {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const nextData = await response.json() as FriendsResponse
      setHasSnapshot(true)

      if (nextData.generatedAt === data.generatedAt && hasSnapshot) {
        setRefreshNotice('当前内容已是最新缓存。')
        return
      }

      setData(nextData)
      setVisible(INITIAL_VISIBLE_COUNT)
      setRefreshNotice('朋友动态已更新。')
    } catch {
      setRefreshError(hasSnapshot
        ? '刷新失败，正在继续显示上一份内容。'
        : '朋友动态暂时无法获取，请稍后再试。')
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <>
      <div className="snapshot-stat">
        <span>
          {data.items.length} 篇文章 · {successfulSourceCount}/{data.sources.length} 个来源可用
        </span>
        <button
          type="button"
          className="friends-refresh"
          onClick={refreshFriends}
          disabled={isRefreshing}
          aria-label="刷新朋友动态"
        >
          {hasSnapshot ? (
            <time dateTime={data.generatedAt}>更新于 {formatFeedDate(data.generatedAt, true)}</time>
          ) : (
            <span>暂无可用缓存</span>
          )}
          <RefreshCw aria-hidden="true" className={isRefreshing ? 'is-spinning' : ''} />
        </button>
      </div>

      <div className="friends-browser">
        <div className="friends-stream-column">
          <div className="filter-row" aria-label="按作者筛选">
            {authors.map(item => (
              <button
                type="button"
                className={selectedAuthor === item ? 'active' : ''}
                aria-pressed={selectedAuthor === item}
                key={item}
                onClick={() => {
                  setAuthor(item)
                  setVisible(INITIAL_VISIBLE_COUNT)
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="friends-feed-message" aria-live="polite">
            {refreshError ? <p>{refreshError}</p> : null}
            {!refreshError && refreshNotice ? <p>{refreshNotice}</p> : null}
            {!refreshError && !refreshNotice && failedSourceCount > 0 ? (
              <p>{failedSourceCount} 个来源暂时不可用，已显示其余来源的文章。</p>
            ) : null}
          </div>

          <p className="sr-only" aria-live="polite">
            当前显示 {Math.min(visible, filtered.length)} / {filtered.length} 篇
          </p>

          {filtered.length > 0 ? (
            <ol className="friend-stream">
              {filtered.slice(0, visible).map(article => (
                <FriendArticleRow
                  key={`${article.sourceHref}-${article.href}`}
                  article={article}
                />
              ))}
            </ol>
          ) : (
            <div className="friends-empty">
              {!hasSnapshot
                ? '尚无可显示的缓存内容。'
                : data.sources.length > 0 && failedSourceCount === data.sources.length
                ? '朋友动态暂时无法获取，请稍后刷新。'
                : '暂时没有匹配的朋友动态。'}
            </div>
          )}

          {visible < filtered.length ? (
            <button
              type="button"
              className="load-more"
              onClick={() => setVisible(count => count + INITIAL_VISIBLE_COUNT)}
            >
              继续浏览 <ChevronDown aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <FriendSourcesPanel sources={data.sources} />
      </div>
    </>
  )
}
