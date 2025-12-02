'use client'

import { useState, useRef, useMemo, useCallback } from 'react'

interface CodeBlockClientProps {
  html: string
  code: string
  lang: string
}

const COLLAPSE_THRESHOLD = 15
const COLLAPSED_HEIGHT = 300

export function CodeBlockClient({ html, code, lang }: CodeBlockClientProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWrapped, setIsWrapped] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const preRef = useRef<HTMLDivElement>(null)

  const lineCount = useMemo(() => code.split('\n').length, [code])
  const shouldCollapse = lineCount > COLLAPSE_THRESHOLD

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  const toggleWrap = useCallback(() => setIsWrapped(prev => !prev), [])
  const toggleExpand = useCallback(() => setIsExpanded(prev => !prev), [])
  const onMouseEnter = useCallback(() => setIsHovered(true), [])
  const onMouseLeave = useCallback(() => setIsHovered(false), [])

  return (
    <div 
      className="relative my-4 rounded-lg overflow-hidden border border-border text-sm group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 语言标签 - 默认显示，悬停隐藏 */}
      <span 
        className={`absolute top-2 right-2 z-10 text-xs text-muted px-1.5 py-0.5 bg-card/80 rounded transition-opacity duration-200 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {lang}
      </span>

      {/* 工具栏 - 悬停显示 */}
      <div 
        className={`absolute top-2 right-2 z-10 flex items-center gap-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* 切换换行 */}
        <button
          onClick={toggleWrap}
          className="text-xs text-muted hover:text-foreground px-1.5 py-0.5 bg-card/80 hover:bg-card rounded transition-colors"
        >
          {isWrapped ? '滚动' : '换行'}
        </button>
        
        {/* 复制按钮 */}
        <button
          onClick={handleCopy}
          className="text-xs text-muted hover:text-foreground px-1.5 py-0.5 bg-card/80 hover:bg-card rounded transition-colors"
        >
          {copied ? '已复制' : '复制'}
        </button>
      </div>

      {/* 代码内容 */}
      <div 
        ref={preRef}
        style={{
          maxHeight: shouldCollapse && !isExpanded ? `${COLLAPSED_HEIGHT}px` : undefined,
          overflow: shouldCollapse && !isExpanded ? 'hidden' : undefined,
        }}
        className={`[&_pre]:!bg-card [&_pre]:px-4 [&_pre]:py-2 [&_code]:!bg-transparent transition-all duration-300 ${
          isWrapped 
            ? '[&_pre]:whitespace-pre-wrap [&_pre]:break-all' 
            : '[&_pre]:overflow-x-auto'
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* 折叠/展开按钮 */}
      {shouldCollapse && (
        <div 
          className={`relative ${!isExpanded ? '-mt-12' : ''}`}
        >
          {/* 渐变遮罩 */}
          {!isExpanded && (
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          )}
          <button
            onClick={toggleExpand}
            className="relative w-full py-2 text-xs text-muted hover:text-foreground bg-card border-t border-border transition-colors flex items-center justify-center gap-1"
          >
            <span className={`i-lucide-chevron-down transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? '收起代码' : `展开代码 (${lineCount} 行)`}
          </button>
        </div>
      )}
    </div>
  )
}
