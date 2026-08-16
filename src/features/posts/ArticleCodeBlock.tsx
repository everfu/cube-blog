'use client'

import { Check, Copy } from 'lucide-react'
import { Children, isValidElement, type ReactNode, useEffect, useRef, useState } from 'react'
import { ArticleCommentable } from '@/features/posts/ArticleCommentBlocks'
import { childText } from '@/features/posts/node-text'

type CodeBlockProps = {
  children?: ReactNode
  'data-blockid'?: string
}

export function ArticleCodeBlock({ children, ...props }: CodeBlockProps) {
  const codeElement = Children.toArray(children).find(child => isValidElement(child))
  const codeProps = isValidElement<CodeBlockProps>(codeElement) ? codeElement.props : undefined
  const blockId = props['data-blockid'] ?? codeProps?.['data-blockid']
  const code = childText(codeElement ?? children).replace(/\n$/, '')
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="article-code-block article-comment-block" data-blockid={blockId}>
      <ArticleCommentable blockId={blockId} />
      <div className="article-code-toolbar">
        <button type="button" onClick={copy} aria-label={copied ? '代码已复制' : '复制代码'}>
          {copied ? <Check /> : <Copy />}
        </button>
      </div>
      <pre>
        <code>
          {code.split('\n').map((line, index) => (
            <span className="article-code-line" key={index}>
              <span aria-hidden="true">{index + 1}</span>
              <span>{line || ' '}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}
