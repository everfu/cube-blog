'use client'

import { X, ZoomIn } from 'lucide-react'
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react'
import { ManagedImage } from '@/features/images'

export function ArticleImage({ alt = '', ...props }: ComponentPropsWithoutRef<'img'>) {
  const [open, setOpen] = useState(false)
  const src = typeof props.src === 'string' ? props.src : ''
  const width = typeof props.width === 'number' ? props.width : Number(props.width) || undefined
  const height = typeof props.height === 'number' ? props.height : Number(props.height) || undefined

  useEffect(() => {
    if (!open) return

    function close(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])

  if (!src) return null

  return (
    <>
      <button
        type="button"
        className="article-image-trigger"
        onClick={() => setOpen(true)}
        aria-label={`放大图片${alt ? `：${alt}` : ''}`}
      >
        <ManagedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 780px) calc(100vw - 48px), 672px"
          intent="content"
          fit="contain"
        />
        <ZoomIn aria-hidden="true" />
      </button>

      {open ? (
        <div
          className="article-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="图片预览"
          onClick={() => setOpen(false)}
        >
          <button type="button" aria-label="关闭图片预览"><X /></button>
          <ManagedImage
            src={src}
            alt={alt}
            className="article-lightbox-image"
            width={width}
            height={height}
            sizes="94vw"
            intent="lightbox"
            fit="contain"
            loading="eager"
            onClick={event => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}
