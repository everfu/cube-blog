'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import type { PostSnapshot } from '@/features/posts/types'

export function ArticleToc({ headings }: { headings: PostSnapshot['headings'] }) {
  const [active, setActive] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    let frame = 0
    function update() {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const article = document.querySelector<HTMLElement>('article[data-postid]')
        const elements = headings
          .map((item) => document.getElementById(item.id))
          .filter((element): element is HTMLElement => Boolean(element))
        if (!article || elements.length === 0) return
        if (article.getBoundingClientRect().bottom < 120) {
          setActive('')
          return
        }
        const current = [...elements].reverse().find((element) => element.getBoundingClientRect().top <= 130)
        setActive((current ?? elements[0]).id)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [headings])

  return <nav className="article-toc" aria-label="文章目录">
    <ul>
      {headings.map((item, index) => <li
        key={item.id}
        className={active === item.id ? 'active' : ''}
        data-level={item.level}
        style={{ '--toc-index': index } as CSSProperties}
      >
        <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>{item.text}</a>
      </li>)}
    </ul>
  </nav>
}
