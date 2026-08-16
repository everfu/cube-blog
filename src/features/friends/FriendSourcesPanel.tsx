'use client'

import { FriendAvatar } from '@/features/friends/FriendAvatar'
import type { FriendSourceStatus } from '@/features/friends/types'

export function FriendSourcesPanel({ sources }: { sources: FriendSourceStatus[] }) {
  return (
    <aside className="friend-sources" aria-label="动态来源">
      <div className="friend-sources-panel">
        <header>
          <h2>来源概览</h2>
          <span>{sources.length} 个来源</span>
        </header>
        <ul>
          {sources.map(source => (
            <li key={source.href} className={source.ok ? undefined : 'is-error'}>
              <FriendAvatar
                className="friend-avatar"
                imageSize={40}
                name={source.name}
                avatar={source.avatar}
                resolvedAvatar={source.resolvedAvatar}
              />
              <div>
                <strong>{source.name}</strong>
                <p>{source.ok ? source.description : '暂时无法读取 RSS'}</p>
              </div>
              <span>{source.ok ? `${source.count} 篇` : '失败'}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
