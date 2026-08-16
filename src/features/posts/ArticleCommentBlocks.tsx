'use client'

import { MessageCircle, Send, X } from 'lucide-react'
import { type FormEvent, type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react'
import { childText } from '@/features/posts/node-text'

type ArticleBlockProps = {
  children?: ReactNode
  className?: string
  id?: string
  'data-blockid'?: string
}

function ArticleCommentable({ blockId }: { blockId?: string }) {
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<string[]>([])
  const [notice, setNotice] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const textareaId = useId()

  const close = useCallback((restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  useEffect(() => {
    function closeOther(event: Event) {
      if (event instanceof CustomEvent && event.detail !== blockId) setOpen(false)
    }

    window.addEventListener('article-comment-open', closeOther)
    return () => window.removeEventListener('article-comment-open', closeOther)
  }, [blockId])

  useEffect(() => {
    if (!open) return

    function closeOnOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') close(true)
    }

    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [close, open])

  if (!blockId) return null

  function toggle() {
    const next = !open
    setOpen(next)
    if (next) window.dispatchEvent(new CustomEvent('article-comment-open', { detail: blockId }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const text = String(data.get('comment') ?? '').trim()
    if (!text) return

    setComments(current => [...current, text])
    setNotice('静态演示，不会提交或保存。')
    form.reset()
  }

  return (
    <div className="article-comment-control" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="article-comment-trigger"
        aria-label="评论这一段"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${textareaId}-popover`}
        onClick={toggle}
      >
        <MessageCircle />
        {comments.length > 0 ? <span>{comments.length}</span> : null}
      </button>

      {open ? (
        <div
          className="article-comment-popover"
          id={`${textareaId}-popover`}
          role="dialog"
          aria-label="段落评论"
        >
          <button
            type="button"
            className="article-comment-close"
            onClick={() => close(true)}
            aria-label="关闭评论"
          >
            <X />
          </button>

          {comments.length > 0 ? (
            <ul className="article-comment-list">
              {comments.map((comment, index) => (
                <li key={`${comment}-${index}`}>
                  <span>你 · 刚刚</span>
                  <p>{comment}</p>
                </li>
              ))}
            </ul>
          ) : null}

          <form onSubmit={submit}>
            <label className="sr-only" htmlFor={textareaId}>评论内容</label>
            <textarea
              id={textareaId}
              name="comment"
              required
              maxLength={999}
              autoFocus
              placeholder="写下你的想法…"
            />
            <button type="submit"><Send />发送</button>
          </form>
          {notice ? <p className="article-static-notice" role="status">{notice}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

export function ArticleParagraph({ children, ...props }: ArticleBlockProps) {
  const blockId = props['data-blockid']
  const empty = childText(children).trim().length === 0

  return (
    <div className="article-comment-block article-paragraph">
      {!empty ? <ArticleCommentable blockId={blockId} /> : null}
      <p {...props}>{children}</p>
    </div>
  )
}

function ArticleHeading({ level, children, ...props }: ArticleBlockProps & { level: 2 | 3 | 4 }) {
  const Tag = `h${level}` as 'h2' | 'h3' | 'h4'
  const headingText = childText(children)

  return (
    <div className="article-comment-block article-heading-block">
      <ArticleCommentable blockId={props['data-blockid']} />
      <Tag {...props} className="article-content-heading" aria-label={headingText}>
        {props.id ? (
          <a className="article-heading-hitarea" href={`#${props.id}`} aria-label={`跳转到 ${headingText}`} />
        ) : null}
        {children}
      </Tag>
    </div>
  )
}

export function ArticleHeading2(props: ArticleBlockProps) {
  return <ArticleHeading {...props} level={2} />
}

export function ArticleHeading3(props: ArticleBlockProps) {
  return <ArticleHeading {...props} level={3} />
}

export function ArticleHeading4(props: ArticleBlockProps) {
  return <ArticleHeading {...props} level={4} />
}

export function ArticleBlockquote({ children, ...props }: ArticleBlockProps) {
  return (
    <blockquote {...props} className="article-comment-block">
      <ArticleCommentable blockId={props['data-blockid']} />
      {children}
    </blockquote>
  )
}

export function ArticleListItem({ children, ...props }: ArticleBlockProps) {
  return (
    <li {...props} className="article-comment-block">
      <ArticleCommentable blockId={props['data-blockid']} />
      {children}
    </li>
  )
}

export { ArticleCommentable }
