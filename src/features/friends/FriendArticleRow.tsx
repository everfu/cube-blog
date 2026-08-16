'use client'

import { useState } from 'react'
import { FriendAvatar } from '@/features/friends/FriendAvatar'
import type { FriendArticle } from '@/features/friends/types'
import { ManagedImage } from '@/features/images'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Shanghai',
})

const dateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai',
})

export function formatFeedDate(value: string, includeTime = false) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return (includeTime ? dateTimeFormatter : dateFormatter).format(date)
}

function FriendCover({ src }: { src: string }) {
  const [isVisible, setIsVisible] = useState(true)
  if (!isVisible) return null

  return (
    <span className="friend-article-cover" aria-hidden="true">
      <ManagedImage
        src={src}
        alt=""
        className="friend-article-cover-image"
        fill
        width={264}
        height={160}
        sizes="(max-width: 780px) 92px, 132px"
        intent="thumbnail"
        deferUntilVisible
        failureMode="hide"
        onError={() => setIsVisible(false)}
      />
    </span>
  )
}

export function FriendArticleRow({ article }: { article: FriendArticle }) {
  return (
    <li className="friend-article">
      <FriendAvatar
        className="friend-avatar"
        imageSize={48}
        name={article.author}
        avatar={article.avatar}
        resolvedAvatar={article.resolvedAvatar}
      />
      <a href={article.href} target="_blank" rel="noreferrer noopener">
        <div className="friend-article-copy">
          <div className="friend-article-meta">
            <strong>{article.author}</strong>
            <time dateTime={article.date}>{formatFeedDate(article.date)}</time>
          </div>
          <h2>{article.title}</h2>
          {article.description ? <p>{article.description}</p> : null}
          {article.tags.length > 0 ? (
            <div className="friend-tags">
              {article.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </div>
        {article.cover ? <FriendCover key={article.cover} src={article.cover} /> : null}
      </a>
    </li>
  )
}
