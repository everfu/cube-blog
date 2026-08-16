'use client'

import { type FormEvent, useState } from 'react'

export function DemoComment({ title = '聊聊这篇内容' }: { title?: string }) {
  const [message, setMessage] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('静态演示，不会提交或保存。')
    event.currentTarget.reset()
  }

  return (
    <section className="comment-demo">
      <div>
        <span className="section-kicker">COMMENTS</span>
        <h2>{title}</h2>
        <p>想法会留在这一页，刷新后自动清空。</p>
      </div>
      <form onSubmit={submit}>
        <textarea required aria-label="评论内容" placeholder="写下你的想法…" />
        <div>
          <input type="text" required aria-label="称呼" placeholder="你的称呼" />
          <button type="submit">发表评论</button>
        </div>
      </form>
      {message ? <p className="demo-message" role="status">{message}</p> : null}
    </section>
  )
}
