'use client'

import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'

const reactionIcons = ['👏', '❤️', '👍', '🔥'] as const

export function ArticleReactions() {
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const [active, setActive] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const timer = useRef<number | undefined>(undefined)
  const magnificationFrame = useRef<number | undefined>(undefined)
  const pointerY = useRef<number | undefined>(undefined)

  useEffect(() => () => {
    window.clearTimeout(timer.current)
    window.cancelAnimationFrame(magnificationFrame.current ?? 0)
  }, [])

  function move(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    pointerY.current = event.clientY
    if (magnificationFrame.current !== undefined) return

    magnificationFrame.current = window.requestAnimationFrame(() => {
      magnificationFrame.current = undefined
      const currentY = pointerY.current
      if (currentY === undefined) return

      const bounds = buttons.current.map(button => button?.getBoundingClientRect())
      const scales = bounds.map((rect) => {
        if (!rect) return 1
        const distance = Math.abs(currentY - rect.top - rect.height / 2)
        return 1 + 0.9 * Math.max(0, 1 - distance / 82)
      })

      buttons.current.forEach((button, index) => {
        button?.style.setProperty('--reaction-scale', scales[index].toFixed(3))
      })
    })
  }

  function resetMagnification() {
    pointerY.current = undefined
    window.cancelAnimationFrame(magnificationFrame.current ?? 0)
    magnificationFrame.current = undefined
    buttons.current.forEach(button => button?.style.removeProperty('--reaction-scale'))
  }

  function react(index: number) {
    setCounts(current => current.map((count, itemIndex) => itemIndex === index ? count + 1 : count))
    setActive(index)
    setNotice('静态演示，不会提交或保存。')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setActive(null)
      setNotice('')
    }, 2600)
  }

  return (
    <div className="article-reactions-wrap">
      <div
        className="article-reactions"
        aria-label="文章反应"
        onPointerMove={move}
        onPointerLeave={resetMagnification}
      >
        {reactionIcons.map((emoji, index) => (
          <button
            key={emoji}
            ref={(element) => { buttons.current[index] = element }}
            type="button"
            className={active === index ? 'is-active' : ''}
            onClick={() => react(index)}
            aria-label={`选择反应 ${emoji}，当前 ${counts[index]} 次`}
          >
            <span aria-hidden="true">{emoji}</span>
            <small>{counts[index]}</small>
          </button>
        ))}
      </div>
      {notice ? <p className="reaction-notice" role="status">{notice}</p> : null}
    </div>
  )
}
