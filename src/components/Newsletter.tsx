'use client'

import { Send } from 'lucide-react'
import { type FormEvent, useState } from 'react'

export function Newsletter({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('静态演示，不会提交或保存。')
    event.currentTarget.reset()
  }

  return (
    <form className={`newsletter ${compact ? 'newsletter--compact' : ''}`} onSubmit={submit}>
      <h2><Send />动态更新</h2>
      <p>喜欢我的内容的话不妨订阅支持一下 👋<br />不定期推送，随时可以取消订阅。</p>
      <div className="newsletter-row">
        <input type="email" required aria-label="电子邮箱" placeholder="你的邮箱" />
        <button type="submit">订阅</button>
      </div>
      {message ? <p className="demo-message" role="status">{message}</p> : null}
    </form>
  )
}
